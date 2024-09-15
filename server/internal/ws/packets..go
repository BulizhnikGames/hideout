package ws

import (
	"context"
	"database/sql"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/BulizhnikGames/hideout/internal/packets"
	"log"
	"strconv"
	"strings"
	"time"
)

var handlersTable map[string]func(hub *Hub, packet *Message)

func Init() {
	handlersTable = make(map[string]func(hub *Hub, packet *Message))
	handlersTable[packets.TextMessage] = handleTextMessage
	handlersTable[packets.StartGame] = handleStartGame
	handlersTable[packets.UpdateLock] = handleUpdateLock
	handlersTable[packets.UpdateGame] = handleUpdateGame
	handlersTable[packets.NewParam] = handleNewParam
	handlersTable[packets.DeleteParam] = handleDeleteParam
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

		sendGameData(hub, game, packet.RoomID)

		data := strconv.Itoa(len(*characters))
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

func handleUpdateGame(hub *Hub, packet *Message) {
	if hub.Rooms[packet.RoomID].Players[packet.Username].Admin {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		if packet.Data == "0" {
			game, err := hub.DB.SetFoodEqualToTime(ctx, hub.Rooms[packet.RoomID].GameID)
			if err != nil {
				log.Printf("Couldn't set food: %v", err)
				return
			}
			sendGameData(hub, &game, packet.RoomID)
		} else if packet.Data == "1" {
			game, err := hub.DB.MultiplyFood(ctx, hub.Rooms[packet.RoomID].GameID)
			if err != nil {
				log.Printf("Couldn't set food: %v", err)
				return
			}
			sendGameData(hub, &game, packet.RoomID)
		} else if packet.Data == "2" {
			apocalypse, err := hub.DB.GetApocalypse(ctx)
			if err != nil {
				log.Printf("Couldn't get apocalypse: %v", err)
				return
			}
			game, err := hub.DB.NewApocalypse(ctx, db.NewApocalypseParams{
				ID:         hub.Rooms[packet.RoomID].GameID,
				Apocalypse: sql.NullString{String: apocalypse, Valid: true},
			})
			if err != nil {
				log.Printf("Couldn't set apocalypse: %v", err)
				return
			}
			sendGameData(hub, &game, packet.RoomID)
		} else if packet.Data == "3" {
			bunker, err := generateBunker(hub, ctx, hub.Rooms[packet.RoomID])
			if err != nil {
				log.Printf("Couldn't create bunker: %v", err)
				return
			}
			game, err := hub.DB.NewBunker(ctx, db.NewBunkerParams{
				ID:        hub.Rooms[packet.RoomID].GameID,
				Size:      sql.NullInt32{Int32: bunker.size, Valid: true},
				Time:      sql.NullInt32{Int32: bunker.time, Valid: true},
				Food:      sql.NullInt32{Int32: bunker.food, Valid: true},
				Place:     sql.NullString{String: bunker.place, Valid: true},
				Rooms:     sql.NullString{String: bunker.rooms, Valid: true},
				Resources: sql.NullString{String: bunker.resources, Valid: true},
			})
			if err != nil {
				log.Printf("Couldn't set new bunker: %v", err)
				return
			}
			sendGameData(hub, &game, packet.RoomID)
		}
	} else {
		log.Println("Only admin can update game data")
	}
}

func handleNewParam(hub *Hub, packet *Message) {
	if hub.Rooms[packet.RoomID].Players[packet.Username].Admin {
		log.Print("TODO: regenerate params")
	} else {
		log.Println("Only admin can regenerate params")
	}
}

func handleDeleteParam(hub *Hub, packet *Message) {
	if hub.Rooms[packet.RoomID].Players[packet.Username].Admin {
		log.Print("TODO: delete params")
	} else {
		log.Println("Only admin can delete params")
	}
}

func sendGameData(hub *Hub, game *db.Game, roomID string) {
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
		Username: "",
		RoomID:   roomID,
		Data:     data,
	}
}
