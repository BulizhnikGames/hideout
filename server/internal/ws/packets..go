package ws

import (
	"context"
	"github.com/BulizhnikGames/hideout/internal/packets"
	"log"
	"strconv"
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
		game, err := hub.startGame(context.Background(), hub.Rooms[packet.RoomID])
		if err != nil {
			log.Printf("Couldnt start game: %v", err)
			return
		}
		strconv.Itoa(10)
		data := game.ID.String()
		data += "&" + game.Apocalypse.String
		data += "&" + strconv.Itoa(int(game.Size.Int32))
		data += "&" + strconv.Itoa(int(game.Time.Int32))
		data += "&" + strconv.Itoa(int(game.Food.Int32))
		data += "&" + game.Place.String
		data += "&" + game.Rooms.String
		data += "&" + game.Resources.String
		hub.Broadcast <- &Message{
			Type:     packets.GameData,
			Username: packet.Username,
			RoomID:   packet.RoomID,
			Data:     data,
		}
	} else {
		log.Println("Only admin can start game")
	}
}
