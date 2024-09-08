-- name: AddApocalypse :exec
INSERT INTO apocalypses (val)
VALUES ($1);

-- name: AddPlace :exec
INSERT INTO places (val)
VALUES ($1);

-- name: AddRoom :exec
INSERT INTO rooms (val)
VALUES ($1);

-- name: AddResource :exec
INSERT INTO resources (val)
VALUES ($1);