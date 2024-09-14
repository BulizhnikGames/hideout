package ws

import (
	"context"
	"github.com/BulizhnikGames/hideout/internal/packets"
	"log"
	"strconv"
	"strings"
)

var handlersTable map[string]func(hub *Hub, packet *Message)

func Init() {
	handlersTable = make(map[string]func(hub *Hub, packet *Message))
	handlersTable[packets.TextMessage] = handleTextMessage
	handlersTable[packets.StartGame] = handleStartGame
	handlersTable[packets.UpdateLock] = handleUpdateLock
}

func handleTextMessage(hub *Hub, packet *Message) {
	log.Printf("Text message: %s", packet.Data)

	hub.Broadcast <- packet
}

func handleStartGame(hub *Hub, packet *Message) {
	if hub.Rooms[packet.RoomID].Players[packet.Username].Admin {
		game, characters, names, err := hub.startGame(context.Background(), hub.Rooms[packet.RoomID])
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

		data = strconv.Itoa(len(*characters))
		for i, char := range *characters {
			data += "&" + (*names)[i]
			data += "&" + char.ID.String()
			data += "&" + char.Main.String
			data += "&" + char.Body.String
			data += "&" + char.Health.String
			data += "&" + char.Job.String
			data += "&" + char.Hobby.String
			data += "&" + char.Phobia.String
			data += "&" + char.Item.String
			data += "&" + char.Info.String
			data += "&" + char.Ability.String
			data += "&" + hub.Rooms[packet.RoomID].Players[(*names)[i]].Lock
		}
		hub.Broadcast <- &Message{
			Type:     packets.CharData,
			Username: "",
			RoomID:   packet.RoomID,
			Data:     data,
		}
	} else {
		log.Println("Only admin can start game")
	}
}

func handleUpdateLock(hub *Hub, packet *Message) {
	vals := strings.Split(packet.Data, "&")
	username, lock := vals[0], vals[1]
	oldLock := hub.Rooms[packet.RoomID].Players[username].Lock
	newLock := ""
	isNew := false
	for i := 0; i < 9; i++ {
		if lock[i] == '1' && oldLock[i] == '0' {
			isNew = true
		}
		if oldLock[i] == '1' || lock[i] == '1' {
			newLock += "1"
		} else {
			newLock += "0"
		}
	}
	if !isNew {
		log.Print("No new data in updating lock")
		return
	}
	hub.Rooms[packet.RoomID].Players[username].Lock = newLock
	hub.Broadcast <- &Message{
		Type:     packets.UpdateLock,
		Username: username,
		RoomID:   packet.RoomID,
		Data:     newLock,
	}
}
