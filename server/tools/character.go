package tools

import (
	"context"
	"github.com/google/uuid"
	"math/rand"
	"strconv"
)

func GenerateMainStringForCharacter() string {
	male := false // 50/50
	if rand.Intn(2) == 0 {
		male = true
	}
	natural := true // gay - 1/6
	if rand.Intn(6) == 0 {
		natural = false
	}
	help := rand.Intn(6) + 4 // [4; 9]
	age := rand.Intn(help*10+1-16) + 16
	childfree := false // childfree - 1/5
	if rand.Intn(5) == 0 {
		childfree = true
	}
	pregnant := false // pregnant - 10%
	if !male && !childfree && age < 49 && rand.Intn(10) == 0 {
		pregnant = true
	}

	res := ""
	if male {
		res += "Мужчина"
	} else {
		res += "Женщина"
	}
	res += " / " + strconv.Itoa(age)
	if age%10 > 4 || age%10 == 0 || (age >= 10 && age <= 20) {
		res += " лет"
	} else if age%10 == 1 {
		res += " год"
	} else {
		res += " года"
	}
	if !natural {
		if male {
			res += " / гей"
		} else {
			res += " / лесбиянка"
		}
	}
	if childfree {
		res += " / чайлдфри"
	}
	if pregnant {
		res += " / беременная"
	}

	return res
}

func GenerateNewValueForCharacter(ctx context.Context, gameID uuid.UUID, dbFunc func(ctx context.Context, gameID uuid.UUID) (string, error)) (string, error) {
	res, err := dbFunc(ctx, gameID)
	if err != nil {
		return "", err
	}
	return res, nil
}
