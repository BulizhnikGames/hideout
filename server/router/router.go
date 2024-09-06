package router

import (
	"github.com/BulizhnikGames/hideout/internal/ws"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(wsHandler *ws.Handler) {
	r = gin.Default()

	r.POST("/play", wsHandler.CreateRoom)
}

func Start(addr string) error {
	return r.Run(addr)
}
