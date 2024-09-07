-- name: CreateCharacter :one
INSERT INTO characters (id, game_id, main, body, health, job, hobby, phobia, item, info, ability)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;

-- name: GetBody :one
SELECT val FROM bodies
ORDER BY RANDOM()
LIMIT 1;

-- name: GetHealth :one
SELECT health.val FROM health
LEFT JOIN characters ON characters.health = health.val
WHERE characters.game_id = $1 AND characters.health IS NULL
ORDER BY RANDOM()
LIMIT 1;

-- name: GetJob :one
SELECT jobs.val FROM jobs
LEFT JOIN characters ON characters.job = jobs.val
WHERE characters.game_id = $1 AND characters.job IS NULL
ORDER BY RANDOM()
LIMIT 1;

-- name: GetHobby :one
SELECT hobbies.val FROM hobbies
LEFT JOIN characters ON characters.hobby = hobbies.val
WHERE characters.game_id = $1 AND characters.hobby IS NULL
ORDER BY RANDOM()
LIMIT 1;

-- name: GetPhobia :one
SELECT phobias.val FROM phobias
LEFT JOIN characters ON characters.phobia = phobias.val
WHERE characters.game_id = $1 AND characters.phobia IS NULL
ORDER BY RANDOM()
LIMIT 1;

-- name: GetItem :one
SELECT items.val FROM items
LEFT JOIN characters ON characters.item = items.val
WHERE characters.game_id = $1 AND characters.item IS NULL
ORDER BY RANDOM()
LIMIT 1;

-- name: GetInfo :one
SELECT info.val FROM info
LEFT JOIN characters ON characters.info = info.val
WHERE characters.game_id = $1 AND characters.info IS NULL
ORDER BY RANDOM()
LIMIT 1;

-- name: GetAbility :one
SELECT abilities.val FROM abilities
LEFT JOIN characters ON characters.ability = abilities.val
WHERE characters.game_id = $1 AND characters.abilitiy IS NULL
ORDER BY RANDOM()
LIMIT 1;