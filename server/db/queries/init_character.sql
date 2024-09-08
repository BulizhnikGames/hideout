-- name: AddBody :exec
INSERT INTO bodies (val)
VALUES ($1);

-- name: AddHealth :exec
INSERT INTO health (val)
VALUES ($1);

-- name: AddJob :exec
INSERT INTO jobs (val)
VALUES ($1);

-- name: AddHobby :exec
INSERT INTO hobbies (val)
VALUES ($1);

-- name: AddPhobia :exec
INSERT INTO phobias (val)
VALUES ($1);

-- name: AddItem :exec
INSERT INTO items (val)
VALUES ($1);

-- name: AddInfo :exec
INSERT INTO info (val)
VALUES ($1);

-- name: AddAbility :exec
INSERT INTO abilities (val)
VALUES ($1);