package database

import (
	"context"
	"product_service/utils"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	uri         = utils.GetEnvVar("MONGO_URI")
	product_db  = utils.GetEnvVar("DB_NAME")
	product_col = utils.GetEnvVar("DB_PRODUCT_COLLECTION")
	comment_col = utils.GetEnvVar("DB_COMMENT_COLLECTION")
	logger_col  = utils.GetEnvVar("DB_LOGGER_COLLECTION")
)

var MongoClient *mongo.Client

func ConnectToDB() error {
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
	return MongoClient.Database(product_db).Collection(product_col)
}

func GetCommentCollection() *mongo.Collection {
	return MongoClient.Database(product_db).Collection(comment_col)
}

func GetLogsCollection() *mongo.Collection {
	return MongoClient.Database(product_db).Collection(logger_col)
}
