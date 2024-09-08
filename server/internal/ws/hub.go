package ws

import (
	"context"
	"errors"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/BulizhnikGames/hideout/internal/packets"
	"github.com/BulizhnikGames/hideout/tools"
	"github.com/google/uuid"
	"log"
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
