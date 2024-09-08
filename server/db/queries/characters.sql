-- name: CreateCharacter :one
INSERT INTO characters (id, game_id, main, body, health, job, hobby, phobia, item, info, ability)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;

-- name: GetBody :one
SELECT val FROM bodies
ORDER BY RANDOM()
LIMIT 1;

-- name: GetHealth :one
SELECT val FROM health
WHERE val NOT IN (
    SELECT health FROM characters
    WHERE game_id = $1
)
ORDER BY RANDOM()
LIMIT 1;

-- name: GetJob :one
SELECT val FROM jobs
WHERE val NOT IN (
    SELECT job FROM characters
    WHERE game_id = $1
)
ORDER BY RANDOM()
LIMIT 1;

-- name: GetHobby :one
SELECT val FROM hobbies
WHERE val NOT IN (
    SELECT hobby FROM characters
    WHERE game_id = $1
)
ORDER BY RANDOM()
LIMIT 1;

-- name: GetPhobia :one
SELECT val FROM phobias
WHERE val NOT IN (
    SELECT phobia FROM characters
    WHERE game_id = $1
)
ORDER BY RANDOM()
LIMIT 1;

-- name: GetItem :one
SELECT val FROM items
WHERE val NOT IN (
    SELECT item FROM characters
    WHERE game_id = $1
)
ORDER BY RANDOM()
LIMIT 1;

-- name: GetInfo :one
SELECT val FROM info
WHERE val NOT IN (
    SELECT info FROM characters
    WHERE game_id = $1
)
ORDER BY RANDOM()
LIMIT 1;

-- name: GetAbility :one
SELECT val FROM abilities
WHERE val NOT IN (
    SELECT ability FROM characters
    WHERE game_id = $1
)
ORDER BY RANDOM()
LIMIT 1;