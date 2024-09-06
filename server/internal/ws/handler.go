package ws

import (
	"github.com/gin-gonic/gin"
	"log"
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

	room, err := h.hub.CreateNewRoom(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Created new room with ID: %s", room.ID)

	c.JSON(http.StatusOK, req)
}
