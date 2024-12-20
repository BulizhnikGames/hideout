package router

import (
	"github.com/BulizhnikGames/hideout/internal/ws"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

var r *gin.Engine

func InitRouter(wsHandler *ws.Handler) {
	r = gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type", "username"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 12 * time.Hour,
	}))

	r.POST("/api/play", wsHandler.CreateRoom)
	r.GET("/api/play/:roomID", wsHandler.JoinRoom)
}

func Start(addr string) error {
	return r.Run(addr)
}
