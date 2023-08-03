package utils

import "go.mongodb.org/mongo-driver/bson/primitive"

func GetMongoId(id string) primitive.ObjectID {
	mongoId, _ := primitive.ObjectIDFromHex(id)

	return mongoId
}
