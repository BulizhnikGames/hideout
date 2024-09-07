package packets

import "github.com/BulizhnikGames/hideout/internal/ws"

const TextMessage byte = 0
const StartGame byte = 1

var PacketsTable map[byte]func(hub *ws.Hub, packet *ws.Message)

func InitTable() {
	PacketsTable = make(map[byte]func(hub *ws.Hub, packet *ws.Message))
	PacketsTable[TextMessage] = HandleTextMessage
	PacketsTable[StartGame] = HandleStartGame
}
