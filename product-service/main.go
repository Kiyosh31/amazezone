package main

import (
	"products-service/api"
	"products-service/database"
	rediscache "products-service/redis-cache"
	"products-service/utils"

	"github.com/gin-gonic/gin"
)

var log = utils.Logger()

func main() {
	router := gin.New()
	app_mode := utils.GetEnvVar("APP_ENV")
	mode := gin.DebugMode
	if app_mode != "development" {
		mode = gin.ReleaseMode
	}
	gin.SetMode(mode)

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
