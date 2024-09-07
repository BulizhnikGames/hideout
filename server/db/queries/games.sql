-- name: StartGame :one
INSERT INTO games (id, apocalypse, size, time, food, place, rooms, resources)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: ClearGames :exec
DELETE FROM games;

-- name: GetApocalypse :one
SELECT val FROM apocalypses
ORDER BY RANDOM()
LIMIT 1;

-- name: GetPlace :one
SELECT val FROM places
ORDER BY RANDOM()
LIMIT 1;

-- name: GetRooms :many
SELECT val FROM rooms
ORDER BY RANDOM()
LIMIT $1;

-- name: GetResources :many
SELECT val FROM resources
ORDER BY RANDOM()
LIMIT $1;