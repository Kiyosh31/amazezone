package rediscache

import (
	"context"
	"product_service/utils"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

var log = utils.Logger()

func CreateRedisClient() {
	prefix := utils.CreatePrefix("CreateRedisClient")
	ctx := context.Background()

	redisUri := utils.GetEnvVar("REDIS_URI")

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     redisUri,
		Password: "",
		DB:       0,
	})

	pong, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf(prefix+"Error connecting to redis: %v", err)
	}

	log.Info("[product-service] Redis client connected successfully: ", pong)
}
