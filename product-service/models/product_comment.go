package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type ProductComment struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	ProductId  primitive.ObjectID `bson:"productId"`
	UserId     primitive.ObjectID `bson:"userId"`
	UserName   string             `bson:"userName"`
	Comment    string             `bson:"comment"`
	RatingStar float64            `bson:"ratingStar"`
}
