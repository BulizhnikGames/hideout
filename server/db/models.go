// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package db

import (
	"database/sql"

	"github.com/google/uuid"
)

type Ability struct {
	Val string
}

type Apocalypse struct {
	Val string
}

type Body struct {
	Val string
}

type Character struct {
	ID      uuid.UUID
	GameID  uuid.UUID
	Main    sql.NullString
	Body    sql.NullString
	Health  sql.NullString
	Job     sql.NullString
	Hobby   sql.NullString
	Phobia  sql.NullString
	Item    sql.NullString
	Info    sql.NullString
	Ability sql.NullString
}

type Game struct {
	ID         uuid.UUID
	Apocalypse sql.NullString
	Size       sql.NullInt32
	Time       sql.NullInt32
	Food       sql.NullInt32
	Place      sql.NullString
	Rooms      sql.NullString
	Resources  sql.NullString
}

type Health struct {
	Val string
}

type Hobby struct {
	Val string
}

type Info struct {
	Val string
}

type Item struct {
	Val string
}

type Job struct {
	Val string
}

type Phobia struct {
	Val string
}

type Place struct {
	Val string
}

type Resource struct {
	Val string
}

type Room struct {
	Val string
}
