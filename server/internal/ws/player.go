package ws

import (
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
	Type     string `json:"type"`
	RoomID   string `json:"roomID"`
	Username string `json:"username"`
	Data     string `json:"data"`
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

		//log.Printf("message data in bytes: %v", (*FormatMessageForJS(message)).Data)
		//log.Printf("message data: %s", string((*FormatMessageForJS(message)).Data))
		//log.Printf("message data in string: %s", string((*FormatMessageForJS(message)).Data))
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

		packetType := string(packet[1])
		packetData := ""
		if len(packet) > 3 {
			packetData = string(packet[2 : len(packetData)-1])
		}

		if handler, ok := HandlersTable[packetType]; ok {
			msg := &Message{
				Type:     packetType,
				RoomID:   p.RoomID,
				Username: p.Username,
				Data:     packetData,
			}
			handler(hub, msg)
		} else {
			log.Printf("packetType %v not found in HandlersTable", packetType)
		}
	}
}
