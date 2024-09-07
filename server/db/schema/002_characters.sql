-- +goose Up

CREATE TABLE characters
(
    id UUID PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    main TEXT,
    body TEXT,
    health TEXT,
    job TEXT,
    hobby TEXT,
    phobia TEXT,
    item TEXT,
    info TEXT,
    ability TEXT
);

-- +goose Down

DROP TABLE characters;