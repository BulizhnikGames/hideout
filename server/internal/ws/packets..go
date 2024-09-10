package ws

import (
	"context"
	"github.com/BulizhnikGames/hideout/internal/packets"
	"log"
)

var HandlersTable map[string]func(hub *Hub, packet *Message)

func Init() {
	HandlersTable = make(map[string]func(hub *Hub, packet *Message))
	HandlersTable[packets.TextMessage] = HandleTextMessage
	HandlersTable[packets.StartGame] = HandleStartGame
}

func HandleTextMessage(hub *Hub, packet *Message) {
	log.Printf("Text message: %s", packet.Data)

	hub.Broadcast <- packet
}

func HandleStartGame(hub *Hub, packet *Message) {
	if hub.Rooms[packet.RoomID].Players[packet.Username].Admin {
		id, err := hub.startGame(context.Background(), hub.Rooms[packet.RoomID])
		if err != nil {
			log.Printf("Couldnt start game: %v", err)
			return
		}
		msg := &Message{
			Type:     packets.TextMessage,
			Username: packet.Username,
			RoomID:   packet.RoomID,
			Data:     "Game with id " + id.String() + " was started!",
		}
		hub.Broadcast <- msg
	} else {
		log.Println("Only admin can start game")
	}
}
