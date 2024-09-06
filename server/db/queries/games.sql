-- name: StartGame :one
INSERT INTO games (id, apocalypse, size, time, food, place, rooms, resources)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;