package ws

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

type Handler struct {
	hub *Hub
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  2048,
	WriteBufferSize: 2048,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func NewHandler(h *Hub) *Handler {
	return &Handler{hub: h}
}

func (h *Handler) CreateRoom(c *gin.Context) {
	room, err := h.hub.CreateNewRoom(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Created new room with ID: %s", room.ID)

	c.JSON(http.StatusOK, room)
}

func (h *Handler) JoinRoom(c *gin.Context) {
	username := c.Query("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username is empty"})
		return
	}

	room := c.Param("roomID")
	if _, ok := h.hub.Rooms[room]; !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "incorrect roomID"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var admin bool
	if len(h.hub.Rooms[room].Players) == 0 {
		admin = true
	} else {
		admin = false
	}

	player := &Player{
		Conn:     conn,
		Messages: make(chan *Message, 10),
		Username: username,
		RoomID:   room,
		Admin:    admin,
	}

	log.Printf("Added new player (%s) to room (%s), is admin: %v", player.Username, player.RoomID, player.Admin)

	h.hub.Register <- player

	go player.writeMessage()
	player.readMessage(h.hub)
}
