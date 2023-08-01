package main

import (
	"product_service/api"
	"product_service/database"
	rediscache "product_service/redis_cache"
	"product_service/utils"

	"github.com/gin-gonic/gin"
)

var log = utils.Logger()

func main() {
	router := gin.New()
	gin.SetMode(gin.DebugMode)

	api.RegisterRoutes(router)

	err := database.ConnectToDB()
	if err != nil {
		log.Panic(err)
	}

	rediscache.CreateRedisClient()

	port := ":" + utils.GetEnvVar("PORT")
	router.Run(port)

	defer database.DisconnectOfDB()
	defer utils.CloseLogsFile()
}
