package ws

import (
	"github.com/BulizhnikGames/hideout/internal/packets"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"log"
)

type Player struct {
	Conn        *websocket.Conn
	Messages    chan *Message
	Username    string    `json:"username"`
	RoomID      string    `json:"roomID"`
	Admin       bool      `json:"admin"`
	CharacterID uuid.UUID `json:"characterID"`
}

type Message struct {
	Type     byte   `json:"type"`
	RoomID   string `json:"roomID"`
	Username string `json:"username"`
	Data     []byte `json:"data"`
}

func (p *Player) writeMessage() { //API gets new packet from other client, this func sends it to this client
	defer func() {
		p.Conn.Close()
	}()

	for {
		message, ok := <-p.Messages
		if !ok {
			return
		}

		p.Conn.WriteJSON(message)
	}
}

func (p *Player) readMessage(hub *Hub) { //Broadcast message from client to other clients
	defer func() {
		hub.Unregister <- p
		p.Conn.Close()
	}()

	for {
		_, packet, err := p.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		packetType := packet[0]
		packetData := packet[1:]

		//TODO handle different types of packages

		if packetType == packets.TextMessage {
			log.Printf("Got message: %s", string(packetData))
		} else {
			log.Printf("Got message (%v): %v", packetType, packetData)
		}

		msg := &Message{
			Type:     packetType,
			RoomID:   p.RoomID,
			Username: p.Username,
			Data:     packetData,
		}

		hub.Broadcast <- msg
	}
}
