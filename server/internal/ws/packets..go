package ws

import (
	"context"
	"github.com/BulizhnikGames/hideout/internal/packets"
	"log"
)

var HandlersTable map[byte]func(hub *Hub, packet *Message)

func InitTable() {
	HandlersTable = make(map[byte]func(hub *Hub, packet *Message))
	HandlersTable[packets.TextMessage] = HandleTextMessage
	HandlersTable[packets.StartGame] = HandleStartGame
}

func HandleTextMessage(hub *Hub, packet *Message) {
	msg := string(packet.Data)
	log.Printf("Text message: %s", msg)

	hub.Broadcast <- packet
}

func HandleStartGame(hub *Hub, packet *Message) {
	if hub.Rooms[packet.RoomID].Players[packet.Username].Admin {
		log.Println("Got start game packet")
		id, err := hub.StartGame(context.Background(), hub.Rooms[packet.RoomID])
		if err != nil {
			log.Printf("Couldnt start game: %v", err)
			return
		}
		msg := &Message{
			Type:     packets.TextMessage,
			Username: packet.Username,
			RoomID:   packet.RoomID,
			Data:     []byte("Game with id " + id.String() + " was started!"),
		}
		hub.Broadcast <- msg
	} else {
		log.Println("Only admin can start game")
	}
}
