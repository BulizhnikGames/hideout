package db

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func Init(c context.Context, db *Queries) error {
	ctx, cancel := context.WithTimeout(c, time.Second*10)
	defer cancel()

	err := db.ClearGames(ctx)
	if err != nil {
		return err
	}

	err = initGame(ctx, db, "../server/db/init/game/")
	if err != nil {
		return errors.New("Error initializing game's tables: " + err.Error())
	}

	err = initCharacter(ctx, db, "../server/db/init/character/")
	if err != nil {
		return errors.New("Error initializing character's tables: " + err.Error())
	}

	return nil
}

func initGame(ctx context.Context, db *Queries, startPath string) error {
	err := initFile(ctx, startPath+"apocalypses.txt", db.AddApocalypse)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"places.txt", db.AddPlace)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"rooms.txt", db.AddRoom)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"resources.txt", db.AddResource)
	if err != nil {
		return err
	}

	return nil
}

func initCharacter(ctx context.Context, db *Queries, startPath string) error {
	err := initFile(ctx, startPath+"bodies.txt", db.AddBody)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"health.txt", db.AddHealth)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"jobs.txt", db.AddJob)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"hobbies.txt", db.AddHobby)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"phobias.txt", db.AddPhobia)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"items.txt", db.AddItem)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"info.txt", db.AddInfo)
	if err != nil {
		return err
	}
	err = initFile(ctx, startPath+"abilities.txt", db.AddAbility)
	if err != nil {
		return err
	}

	return nil
}

func initFile(ctx context.Context, path string, dbFunc func(ctx context.Context, val string) error) error {
	path, err := filepath.Abs(path)
	if err != nil {
		return err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	values := strings.Split(string(data), "\n")
	for _, value := range values {
		if value == "" {
			continue
		}
		err = dbFunc(ctx, value)
		if err != nil && !strings.Contains(err.Error(), "pkey") {
			return err
		}
	}

	return nil
}
