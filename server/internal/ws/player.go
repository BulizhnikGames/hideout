package ws

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Player struct {
	Conn        *websocket.Conn
	Messages    chan *Message
	Username    string    `json:"username"`
	RoomID      string    `json:"roomID"`
	CharacterID uuid.UUID `json:"characterID"`
}

type Message struct {
	Content  string `json:"content"`
	RoomID   string `json:"roomID"`
	Username string `json:"username"`
}
