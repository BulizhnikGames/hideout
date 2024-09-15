package ws

import (
	"context"
	"database/sql"
	"errors"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/google/uuid"
	"log"
	"math/rand"
)

type bunker struct {
	size      int32
	time      int32
	food      int32
	place     string
	rooms     string
	resources string
}

func (h *Hub) startGame(c context.Context, r *Room) (*db.Game, *[]db.Character, *[]string, error) {
	ctx, cancel := context.WithTimeout(c, h.Timeout)
	defer cancel()

	apocalypse, err := h.DB.GetApocalypse(ctx)
	if err != nil {
		return nil, nil, nil, err
	}

	bunker, err := generateBunker(h, ctx, r)
	if err != nil {
		return nil, nil, nil, err
	}

	game, err := h.DB.StartGame(ctx, db.StartGameParams{
		ID:         uuid.New(),
		Apocalypse: sql.NullString{String: apocalypse, Valid: true},
		Size:       sql.NullInt32{Int32: int32(bunker.size), Valid: true},
		Time:       sql.NullInt32{Int32: int32(bunker.time), Valid: true},
		Food:       sql.NullInt32{Int32: int32(bunker.food), Valid: true},
		Place:      sql.NullString{String: bunker.place, Valid: true},
		Rooms:      sql.NullString{String: bunker.rooms, Valid: true},
		Resources:  sql.NullString{String: bunker.resources, Valid: true},
	})
	if err != nil {
		return nil, nil, nil, err
	}

	players := make([]db.Character, len(r.Players))
	names := make([]string, len(r.Players))
	i := 0
	for _, player := range r.Players {
		players[i], err = h.createCharacter(ctx, game.ID)
		if err != nil {
			return nil, nil, nil, errors.New("Error creating character for player " + player.Username + " in room " + r.ID + ": " + err.Error())
		}

		player.CharacterID = players[i].ID
		names[i] = player.Username

		i++
	}

	r.GameID = game.ID
	log.Printf("Game with ID: %s in room %s has been started", game.ID, r.ID)

	return &game, &players, &names, nil
}

func generateBunker(h *Hub, ctx context.Context, r *Room) (*bunker, error) {
	place, err := h.DB.GetPlace(ctx)
	if err != nil {
		return nil, err
	}
	cnt := rand.Intn(6) + 3 // [3; 8]
	roomsList, err := h.DB.GetRooms(ctx, int32(cnt))
	if err != nil {
		return nil, err
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
		return nil, err
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
	cnt = 6
	if timeLimit > 25 {
		cnt = rand.Intn(timeLimit/2-12) + 6
	}
	food := rand.Intn(cnt*2) + timeLimit - cnt
	var people int
	if len(r.Players) < 6 {
		people = 2
	} else if len(r.Players) >= 6 && len(r.Players) < 10 {
		people = 3
	} else {
		people = 4
	}

	return &bunker{
		size:      int32(people),
		time:      int32(timeLimit),
		food:      int32(food),
		place:     place,
		rooms:     rooms,
		resources: resources,
	}, nil
}
