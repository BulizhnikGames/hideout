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

-- name: SetFoodEqualToTime :one
UPDATE games
SET food = time
WHERE id = $1
RETURNING *;

-- name: MultiplyFood :one
UPDATE games
SET food = food * 2
WHERE id = $1
RETURNING *;

-- name: NewApocalypse :one
UPDATE games
SET apocalypse = $2
WHERE id = $1
RETURNING *;

-- name: NewBunker :one
UPDATE games
SET size = $2, time = $3, food = $4, place = $5, rooms = $6, resources = $7
WHERE id = $1
RETURNING *;