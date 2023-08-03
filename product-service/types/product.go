package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type Product struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Name        string             `bson:"name" binding:"required"`
	Description string             `bson:"description" binding:"required"`
	Price       float64            `bson:"price" binding:"required"`
	Brand       string             `bson:"brand" binding:"required"`
	Stars       float64            `bson:"stars" binding:"required"`
}
