package packets

import (
	"github.com/BulizhnikGames/hideout/internal/ws"
	"log"
)

func HandleTextMessage(hub *ws.Hub, packet *ws.Message) {
	msg := string(packet.Data)
	log.Println(msg)

	hub.Broadcast <- packet
}

func HandleStartGame(hub *ws.Hub, packet *ws.Message) {
	if hub.Rooms[packet.RoomID].Players[packet.Username].Admin {
		log.Println("Start game")
	} else {
		log.Println("Only admin can start game")
	}
}
