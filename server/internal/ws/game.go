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
