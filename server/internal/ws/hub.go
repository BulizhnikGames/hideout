package ws

import (
	"context"
	"errors"
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
}

func NewHub() *Hub {
	return &Hub{
		Rooms: make(map[string]*Room),
	}
}

func (h *Hub) CreateNewRoom(c context.Context) (*Room, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*4)
	defer cancel()

	id := h.GetEmptyRoomID(ctx)
	if id == "" {
		return nil, errors.New("time limit for finding empty room exceeded")
	}

	return h.Rooms[id], nil
}

func (h *Hub) GetEmptyRoomID(c context.Context) string {
	for {
		select {
		case <-c.Done():
			return ""
		default:
			id := tools.GetRoomID(tools.RoomIDLength)
			_, ok := h.Rooms[id]
			if !ok {
				return id
			}
		}
	}
}
