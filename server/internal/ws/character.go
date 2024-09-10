package ws

import (
	"context"
	"database/sql"
	"github.com/BulizhnikGames/hideout/db"
	"github.com/BulizhnikGames/hideout/tools"
	"github.com/google/uuid"
)

func (h *Hub) createCharacter(ctx context.Context, gameID uuid.UUID) (uuid.UUID, error) {
	main := tools.GenerateMainStringForCharacter()
	body, err := h.DB.GetBody(ctx)
	if err != nil {
		return uuid.Nil, err
	}
	health, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetHealth)
	if err != nil {
		return uuid.Nil, err
	}
	job, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetJob)
	if err != nil {
		return uuid.Nil, err
	}
	hobby, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetHobby)
	if err != nil {
		return uuid.Nil, err
	}
	phobia, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetPhobia)
	if err != nil {
		return uuid.Nil, err
	}
	item, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetItem)
	if err != nil {
		return uuid.Nil, err
	}
	info, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetInfo)
	if err != nil {
		return uuid.Nil, err
	}
	ability, err := tools.GenerateNewValueForCharacter(ctx, gameID, h.DB.GetAbility)
	if err != nil {
		return uuid.Nil, err
	}

	character, err := h.DB.CreateCharacter(ctx, db.CreateCharacterParams{
		ID:      uuid.New(),
		GameID:  gameID,
		Main:    sql.NullString{String: main, Valid: true},
		Body:    sql.NullString{String: body, Valid: true},
		Health:  sql.NullString{String: health, Valid: true},
		Job:     sql.NullString{String: job, Valid: true},
		Hobby:   sql.NullString{String: hobby, Valid: true},
		Phobia:  sql.NullString{String: phobia, Valid: true},
		Item:    sql.NullString{String: item, Valid: true},
		Info:    sql.NullString{String: info, Valid: true},
		Ability: sql.NullString{String: ability, Valid: true},
	})
	if err != nil {
		return uuid.Nil, err
	}

	return character.ID, nil
}