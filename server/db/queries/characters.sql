-- name: CreateCharacter :one
INSERT INTO characters (id, game_id, main, body, health, job, hobby, phobia, inventory, info, ability)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;