-- +goose Up

CREATE TABLE games
(
    id         UUID PRIMARY KEY,
    apocalypse TEXT,
    size       INTEGER,
    time       INTEGER,
    food       INTEGER,
    place      TEXT,
    rooms      TEXT,
    resources  TEXT
);

-- +goose Down

DROP TABLE games;