package db

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func InitTables(c context.Context, db *Queries) error {
	ctx, cancel := context.WithTimeout(c, time.Second*10)
	defer cancel()

	err := db.ClearGames(ctx)
	if err != nil {
		return err
	}

	path, err := filepath.Abs("../server/db/init/game/apocalypses.txt")
	if err != nil {
		return err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	apocalypses := strings.Split(string(data), "\n")
	for _, apocalypse := range apocalypses {
		if apocalypse == "" {
			continue
		}
		err = db.AddApocalypse(ctx, apocalypse)
		if err != nil && !strings.Contains(err.Error(), "pkey") {
			return err
		}
	}

	path, err = filepath.Abs("../server/db/init/game/places.txt")
	if err != nil {
		return err
	}
	data, err = os.ReadFile(path)
	if err != nil {
		return err
	}
	places := strings.Split(string(data), "\n")
	for _, place := range places {
		if place == "" {
			continue
		}
		err = db.AddPlace(ctx, place)
		if err != nil && !strings.Contains(err.Error(), "pkey") {
			return err
		}
	}

	path, err = filepath.Abs("../server/db/init/game/rooms.txt")
	if err != nil {
		return err
	}
	data, err = os.ReadFile(path)
	if err != nil {
		return err
	}
	rooms := strings.Split(string(data), "\n")
	for _, room := range rooms {
		if room == "" {
			continue
		}
		err = db.AddRoom(ctx, room)
		if err != nil && !strings.Contains(err.Error(), "pkey") {
			return err
		}
	}

	path, err = filepath.Abs("../server/db/init/game/resources.txt")
	if err != nil {
		return err
	}
	data, err = os.ReadFile(path)
	if err != nil {
		return err
	}
	resources := strings.Split(string(data), "\n")
	for _, resource := range resources {
		if resource == "" {
			continue
		}
		err = db.AddResource(ctx, resource)
		if err != nil && !strings.Contains(err.Error(), "pkey") {
			return err
		}
	}

	return nil
}
