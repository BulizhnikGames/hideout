package tools

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

var port string = ""
var db_url string = ""
var key string = ""

func Init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port = os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT must be set in .env file")
	}

	db_url = os.Getenv("DB_URL")
	if db_url == "" {
		log.Fatal("DB_URL must be set in .env file")
	}

	key = os.Getenv("KEY")
	if key == "" {
		log.Fatal("KEY must be set in .env file")
	}
}

func GetPort() string  { return port }
func GetDBUrl() string { return db_url }
func GetKey() string   { return key }
