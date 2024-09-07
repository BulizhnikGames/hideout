-- +goose Up

CREATE TABLE bodies (
    val TEXT PRIMARY KEY
);

CREATE TABLE health (
    val TEXT PRIMARY KEY
);

CREATE TABLE jobs (
    val TEXT PRIMARY KEY
);

CREATE TABLE hobbies (
    val TEXT PRIMARY KEY
);

CREATE TABLE phobias (
    val TEXT PRIMARY KEY
);

CREATE TABLE items (
    val TEXT PRIMARY KEY
);

CREATE TABLE info (
    val TEXT PRIMARY KEY
);

CREATE TABLE abilities (
    val TEXT PRIMARY KEY
);

-- +goose Down

DROP TABLE bodies;
DROP TABLE health;
DROP TABLE jobs;
DROP TABLE hobbies;
DROP TABLE phobias;
DROP TABLE items;
DROP TABLE info;
DROP TABLE abilities;