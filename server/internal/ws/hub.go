package ws

import (
	"context"
	"database/sql"
	"errors"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/BulizhnikGames/hideout/internal/packets"
	"github.com/BulizhnikGames/hideout/tools"
	"github.com/google/uuid"
	"log"
	"math/rand"
	"time"
)

type Room struct {
	ID      string             `json:"id"`
	GameID  uuid.UUID          `json:"gameID"`
	Players map[string]*Player `json:"players"`
}

type Hub struct {
	Rooms      map[string]*Room
	DB         *db.Queries
	Register   chan *Player
	Unregister chan *Player
	Broadcast  chan *Message
	Timeout    time.Duration
}

func NewHub(db *db.Queries) *Hub {
	return &Hub{
		Rooms:      make(map[string]*Room),
		DB:         db,
		Register:   make(chan *Player),
		Unregister: make(chan *Player),
		Broadcast:  make(chan *Message, 20),
		Timeout:    time.Second * 4,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case player := <-h.Register:
			if r, ok := h.Rooms[player.RoomID]; ok {
				if _, ok = r.Players[player.Username]; !ok {
					r.Players[player.Username] = player
				}
			}
		case player := <-h.Unregister:
			if r, ok := h.Rooms[player.RoomID]; ok {
				if _, ok = r.Players[player.Username]; ok {
					delete(r.Players, player.Username)
					close(player.Messages)

					if len(r.Players) == 0 {
						log.Printf("Room %s has no players; deleting it", player.RoomID)
						delete(h.Rooms, player.RoomID)
					} else {
						if player.Admin {
							for _, newAdmin := range r.Players {
								newAdmin.Admin = true
								log.Printf("Player (%s) in room (%s) is now admin", newAdmin.Username, newAdmin.RoomID)
								break
							}
						}

						h.Broadcast <- &Message{
							Type:     packets.TextMessage,
							RoomID:   player.RoomID,
							Username: player.Username,
							Data:     []byte("Player (" + player.Username + ") left the room"),
						}
					}
				}
			}
		case message := <-h.Broadcast:
			if r, ok := h.Rooms[message.RoomID]; ok {
				for _, player := range r.Players {
					player.Messages <- message
				}
			}
		}
	}
}

func (h *Hub) CreateNewRoom(c context.Context) (*Room, error) {
	ctx, cancel := context.WithTimeout(c, h.Timeout)
	defer cancel()

	id := h.GetEmptyRoomID(ctx)
	if id == "" {
		return nil, errors.New("time limit for finding empty room exceeded")
	}

	h.Rooms[id] = &Room{
		ID:      id,
		Players: make(map[string]*Player),
	}

	return h.Rooms[id], nil
}

func (h *Hub) GetEmptyRoomID(c context.Context) string {
	for {
		select {
		case <-c.Done():
			return ""
		default:
			id := tools.GenRoomID(tools.RoomIDLength)
			_, ok := h.Rooms[id]
			if !ok {
				return id
			}
		}
	}
}

func (h *Hub) startGame(c context.Context, r *Room) (uuid.UUID, error) {
	ctx, cancel := context.WithTimeout(c, h.Timeout)
	defer cancel()

	apocalypse, err := h.DB.GetApocalypse(ctx)
	if err != nil {
		return uuid.Nil, err
	}
	place, err := h.DB.GetPlace(ctx)
	if err != nil {
		return uuid.Nil, err
	}
	cnt := rand.Intn(6) + 3 // [3; 8]
	roomsList, err := h.DB.GetRooms(ctx, int32(cnt))
	if err != nil {
		return uuid.Nil, err
	}
	var rooms string
	for i, room := range roomsList {
		rooms += room
		if i != len(roomsList)-1 {
			rooms += ", "
		}
	}
	cnt = rand.Intn(4) + 3 // [3; 6]
	resourcesList, err := h.DB.GetResources(ctx, int32(cnt))
	if err != nil {
		return uuid.Nil, err
	}
	var resources string
	for i, resource := range resourcesList {
		resources += resource
		if i != len(resourcesList)-1 {
			resources += ", "
		}
	}
	cnt = rand.Intn(5) + 3 // [3; 7]
	timeLimit := rand.Intn(cnt*12) + 12
	cnt = rand.Intn(timeLimit/2-6) + 6
	food := rand.Intn(cnt*2) + timeLimit - cnt
	var people int
	if len(r.Players) < 6 {
		people = 2
	} else if len(r.Players) >= 6 && len(r.Players) < 10 {
		people = 3
	} else {
		people = 4
	}

	game, err := h.DB.StartGame(ctx, db.StartGameParams{
		ID:         uuid.New(),
		Apocalypse: sql.NullString{String: apocalypse, Valid: true},
		Size:       sql.NullInt32{Int32: int32(people), Valid: true},
		Time:       sql.NullInt32{Int32: int32(timeLimit), Valid: true},
		Food:       sql.NullInt32{Int32: int32(food), Valid: true},
		Place:      sql.NullString{String: place, Valid: true},
		Rooms:      sql.NullString{String: rooms, Valid: true},
		Resources:  sql.NullString{String: resources, Valid: true},
	})
	if err != nil {
		return uuid.Nil, err
	}

	for _, player := range r.Players {
		id, err := h.createCharacter(ctx, game.ID)
		if err != nil {
			return uuid.Nil, errors.New("Error creating character for player " + player.Username + " in room " + r.ID + ": " + err.Error())
		}
		player.CharacterID = id
	}

	r.GameID = game.ID
	log.Printf("Game with ID: %s in room %s has been started", game.ID, r.ID)

	return game.ID, nil
}

func (h *Hub) createCharacter(ctx context.Context, gameID uuid.UUID) (uuid.UUID, error) {
	main := tools.GenerateMainStringForCharacter()
	body, err := h.DB.GetBody(ctx)
	if err != nil {
		return uuid.Nil, err
	}
	health, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetHealth)
	if err != nil {
		return uuid.Nil, err
	}
	job, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetJob)
	if err != nil {
		return uuid.Nil, err
	}
	hobby, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetHobby)
	if err != nil {
		return uuid.Nil, err
	}
	phobia, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetPhobia)
	if err != nil {
		return uuid.Nil, err
	}
	item, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetItem)
	if err != nil {
		return uuid.Nil, err
	}
	info, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetInfo)
	if err != nil {
		return uuid.Nil, err
	}
	ability, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetAbility)
	if err != nil {
		return uuid.Nil, err
	}

	character, err := h.DB.CreateCharacter(ctx, db.CreateCharacterParams{
		ID:      uuid.New(),
		GameID:  gameID,
		Main:    sql.NullString{String: main, Valid: true},
		Body:    sql.NullString{String: body, Valid: true},
		Health:  sql.NullString{String: health, Valid: true},
		Job:     sql.NullString{String: job, Valid: true},
		Hobby:   sql.NullString{String: hobby, Valid: true},
		Phobia:  sql.NullString{String: phobia, Valid: true},
		Item:    sql.NullString{String: item, Valid: true},
		Info:    sql.NullString{String: info, Valid: true},
		Ability: sql.NullString{String: ability, Valid: true},
	})
	if err != nil {
		return uuid.Nil, err
	}

	return character.ID, nil
}
