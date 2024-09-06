package main

import (
	"database/sql"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/BulizhnikGames/hideout/tools"
	"log"
)

func main() {
	tools.Init()

	dbConn, err := sql.Open("postgres", tools.GetDBUrl())
	if err != nil {
		log.Fatal(err)
	}
	database := db.New(dbConn)

}
