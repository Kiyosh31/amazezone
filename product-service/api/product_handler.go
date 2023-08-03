package api

import (
	"context"
	"encoding/json"
	"net/http"
	"product_service/database"
	"product_service/models"
	rediscache "product_service/redis_cache"
	"product_service/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateProduct(c *gin.Context) {
	prefix := utils.CreatePrefix("CreateProduct")
	log.Info(prefix + "Request incoming....")

	var newProduct models.Product
	err := c.BindJSON(&newProduct)
	if err != nil {
		log.Warn(prefix+"Invalid body: %v", err)
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Invalid body", err))
		return
	}

	log.Info(prefix+"Creating new product with data: ", newProduct)

	col := database.GetProductCollection()
	res, err := col.InsertOne(context.TODO(), newProduct)
	if err != nil {
		log.Warn(prefix+"Error creating new product: %v", err)
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Error creating new product:", err))
		return
	}

	log.Info(prefix + "product created successfully")

	log.Info(prefix + "Deleting allProducts from redis")
	_, err = rediscache.RedisClient.Del(c.Request.Context(), "allProducts").Result()
	if err != nil {
		log.Warn(prefix+"Error deleting a product: %v", err)
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Error deleting allProducts:", err))
		return
	}
	log.Info(prefix + "allProducts deleted from redis")

	log.Info(prefix + "Request finished....")
	c.JSON(http.StatusCreated, res)
}

func GetProductById(c *gin.Context) {
	prefix := utils.CreatePrefix("GetProductById")
	log.Info(prefix + "Request incoming....")

	id := utils.GetMongoId(c.Param("id"))
	filter := bson.D{{Key: "_id", Value: id}}

	log.Info(prefix+"Searching for product with id: ", id)

	// Check if exists in redis
	// val, err := rediscache.RedisClient.Get(c.Request.Context(), "product?=" + ).Result()

	var product models.Product
	col := database.GetProductCollection()
	err := col.FindOne(context.TODO(), filter).Decode(&product)
	if err != nil {
		log.Warn(prefix+"Product not found: ", err)
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Product not found", err))
		return
	}

	log.Info(prefix+"Product found: ", product)
	log.Info(prefix + "Request finished....")

	c.JSON(http.StatusOK, product)
}

func GetAllProducts(c *gin.Context) {
	prefix := utils.CreatePrefix("GetAllProducts")
	log.Info(prefix + "Request incoming...")

	log.Info(prefix + "Searching for all products")
	filter := bson.D{{}}
	col := database.GetProductCollection()
	cursor, err := col.Find(context.TODO(), filter)
	if err != nil {
		log.Warn(prefix+"Products not found: ", err)
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Products not found", err))
		return
	}

	var results []models.Product
	if err = cursor.All(context.TODO(), &results); err != nil {
		log.Info(prefix+"Error in cursor: %v", err)
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Error in cursor", err))
		return
	}

	for _, product := range results {
		cursor.Decode(&product)
		_, err := json.MarshalIndent(product, "", "    ")
		if err != nil {
			log.Warn(prefix+"Error iterating users: %v", err)
			c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Error iterating users", err))
			return
		}
	}
	log.Info(prefix+"products found with data: ", results)
	log.Info(prefix + "Request finished....")

	c.JSON(http.StatusOK, results)
}

func UpdateProduct(c *gin.Context) {
	prefix := utils.CreatePrefix("UpdateProduct")
	log.Info(prefix + "Request incoming....")

	id := utils.GetMongoId(c.Param("id"))
	filter := bson.D{{Key: "_id", Value: id}}

	var updatedProduct models.Product
	c.BindJSON(&updatedProduct)

	log.Info(prefix+"Updating product with id: %v and data: %v", id, updatedProduct)

	updateQuery := bson.D{{Key: "$set", Value: updatedProduct}}

	col := database.GetProductCollection()
	res, err := col.UpdateOne(context.TODO(), filter, updateQuery)
	if err != nil {
		log.Warn(prefix+"Error updating product: %v", err)
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Error updating product: ", err))
		return
	}

	c.JSON(http.StatusCreated, res)
}

func DeleteProduct(c *gin.Context) {
	prefix := utils.CreatePrefix("DeleteProduct")
	log.Info(prefix + "Request incoming....")

	id := utils.GetMongoId(c.Param("id"))
	col := database.GetProductCollection()
	filter := bson.D{{
		Key:   "_id",
		Value: id,
	}}

	log.Info(prefix+"Deleting product with id: ", id)

	res, err := col.DeleteOne(context.TODO(), filter)
	if err != nil {
		log.Warn(prefix+"Error deleting product: %v", err)
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Error deleting product: ", err))
		return
	}

	c.JSON(http.StatusAccepted, res)
}
