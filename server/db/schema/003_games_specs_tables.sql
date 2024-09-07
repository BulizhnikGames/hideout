-- +goose Up

CREATE TABLE apocalypses(
    val TEXT PRIMARY KEY
);

CREATE TABLE places(
    val TEXT PRIMARY KEY
);

CREATE TABLE rooms(
    val TEXT PRIMARY KEY
);

CREATE TABLE resources(
    val TEXT PRIMARY KEY
);

-- +goose Down

DROP TABLE apocalypses;
DROP TABLE places;
DROP TABLE rooms;
DROP TABLE resources;