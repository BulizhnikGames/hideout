package ws

import (
	"context"
	"errors"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/BulizhnikGames/hideout/tools"
	"github.com/google/uuid"
	"time"
)

type Room struct {
	ID      string             `json:"id"`
	GameID  uuid.UUID          `json:"gameID"`
	Players map[string]*Player `json:"players"`
}

type Hub struct {
	Rooms map[string]*Room
	DB    *db.Queries
}

func NewHub(db *db.Queries) *Hub {
	return &Hub{
		Rooms: make(map[string]*Room),
		DB:    db,
	}
}

func (h *Hub) CreateNewRoom(c context.Context) (*Room, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*2)
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
