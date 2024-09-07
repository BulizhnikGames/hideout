package main

import (
	"database/sql"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/BulizhnikGames/hideout/internal/packets"
	"github.com/BulizhnikGames/hideout/internal/ws"
	"github.com/BulizhnikGames/hideout/router"
	"github.com/BulizhnikGames/hideout/tools"
	_ "github.com/lib/pq"
	"log"
)

func main() {
	tools.Init()
	packets.InitTable()

	dbConn, err := sql.Open("postgres", tools.GetDBUrl())
	if err != nil {
		log.Fatal(err)
	}
	database := db.New(dbConn)

	hub := ws.NewHub(database)
	wsHandler := ws.NewHandler(hub)

	go hub.Run()

	router.InitRouter(wsHandler)
	router.Start("localhost:" + tools.GetPort())
}
