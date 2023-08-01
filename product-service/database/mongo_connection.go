package database

import (
	"context"
	"log"
	"product_service/utils"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func ConnectToDB() error {
	uri := utils.GetEnvVar("MONGO_URI")

	if uri == "" {
		log.Fatal("You must provide MONGO_URI in env")
	}

	var err error
	MongoClient, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	return nil
}

func DisconnectOfDB() {
	err := MongoClient.Disconnect(context.TODO())
	if err != nil {
		panic(err)
	}
}

func GetProductCollection() *mongo.Collection {
	db := utils.GetEnvVar("DB_NAME")
	col := utils.GetEnvVar("DB_PRODUCT_COLLECTION")

	return MongoClient.Database(db).Collection(col)
}

func GetCommentCollection() *mongo.Collection {
	db := utils.GetEnvVar("DB_NAME")
	col := utils.GetEnvVar("DB_COMMENT_COLLECTION")

	return MongoClient.Database(db).Collection(col)
}

func GetLogsCollection() *mongo.Collection {
	db := utils.GetEnvVar("DB_NAME")
	col := utils.GetEnvVar("DB_LOGGER_COLLECTION")

	return MongoClient.Database(db).Collection(col)
}
