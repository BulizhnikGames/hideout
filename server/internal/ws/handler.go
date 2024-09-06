package ws

import (
	"github.com/BulizhnikGames/hideout/tools"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Handler struct {
	hub *Hub
}

type CreateRoomReq struct {
	Username string `json:"username"`
}

func NewHandler(h *Hub) *Handler {
	return &Handler{hub: h}
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var req CreateRoomReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var id string

	for {
		id = tools.GetRoomID(tools.RoomIDLength)
		_, ok := h.hub.Rooms[id]
		if !ok {
			break
		}
	}

}
