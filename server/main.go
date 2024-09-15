package main

import (
	"context"
	"database/sql"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/BulizhnikGames/hideout/internal/ws"
	"github.com/BulizhnikGames/hideout/router"
	"github.com/BulizhnikGames/hideout/tools"
	_ "github.com/lib/pq"
	"log"
)

func main() {
	tools.Init()
	ws.Init()

	dbConn, err := sql.Open("postgres", tools.GetDBUrl())
	if err != nil {
		log.Fatal(err)
	}
	database := db.New(dbConn)
	err = db.Init(context.Background(), database)
	if err != nil {
		log.Fatal(err)
	}

	hub := ws.NewHub(database)
	wsHandler := ws.NewHandler(hub)

	go hub.Run()

	router.InitRouter(wsHandler)
	err = router.Start("192.168.103.132:" + tools.GetPort())
	if err != nil {
		log.Fatalf("Router failed: %v", err)
	}
}
