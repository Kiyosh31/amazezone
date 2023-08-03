package api

import (
	"context"
	"encoding/json"
	"net/http"
	"product_service/database"
	"product_service/models"
	"product_service/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateComment(c *gin.Context) {
	prefix := utils.CreatePrefix("CreateComment")
	log.Info(prefix + "Request incoming...")

	var newComment models.ProductComment
	err := c.BindJSON(&newComment)
	if err != nil {
		log.Warn(prefix+"Invalid body: %v", err)
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Invalid body", err))
		return
	}

	log.Info(prefix+"Creating new comment with data: ", newComment)

	col := database.GetCommentCollection()
	res, err := col.InsertOne(context.TODO(), newComment)
	if err != nil {
		log.Warn(prefix+"Error creating new comment: %v", err)
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Error creating new comment: ", err))
		return
	}

	log.Info(prefix + "Comment created successfully")
	log.Info(prefix + "Reques finished...")

	c.JSON(http.StatusCreated, res)
}

func GetCommentById(c *gin.Context) {
	prefix := utils.CreatePrefix("GetComment")
	log.Info(prefix + "Request incoming...")

	id := utils.GetMongoId(c.Param("id"))
	filter := bson.D{{Key: "_id", Value: id}}

	log.Info(prefix+"Searching comment with id: ", id)

	var comment models.ProductComment
	col := database.GetCommentCollection()
	err := col.FindOne(context.TODO(), filter).Decode(&comment)
	if err != nil {
		log.Warn(prefix+"Comment not found: ", err)
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Product not found", err))
		return
	}

	log.Info(prefix+"Comment not found: ", comment)
	log.Info(prefix + "Request finished....")

	c.JSON(http.StatusOK, comment)
}

func GetAllComments(c *gin.Context) {
	prefix := utils.CreatePrefix("GetAllComments")
	log.Info(prefix + "Reqest incoming...")

	log.Info(prefix + "Searching for all comments related to product: ")

	product_id := utils.GetMongoId(c.Param("id"))
	filter := bson.D{{Key: "productId", Value: product_id}}
	col := database.GetCommentCollection()
	cursor, err := col.Find(context.TODO(), filter)
	if err != nil {
		log.Warn(prefix+"Comments not found: ", err)
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Comments not found", err))
		return
	}

	var comments []models.ProductComment
	if err = cursor.All(context.TODO(), &comments); err != nil {
		log.Warn(prefix+"Error in cursor: %v", err)
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Error in cursor", err))
		return
	}

	for _, comment := range comments {
		cursor.Decode(&comment)
		_, err := json.MarshalIndent(comment, "", "    ")
		if err != nil {
			log.Warn(prefix+"Error iterating comments: %v", err)
			c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Error iterating comments", err))
			return
		}
	}

	log.Info(prefix+"Comments found with data: ", comments)
	log.Info(prefix + "Reques finished...")

	c.JSON(http.StatusOK, comments)
}
