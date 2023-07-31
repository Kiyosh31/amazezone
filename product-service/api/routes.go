package api

import (
	"products-service/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		products := api.Group("/products")
		{
			products.GET("", handlers.GetAllProducts)
			products.GET("/:id", handlers.GetProductById)
			products.POST("/", handlers.CreateProduct)
			products.PUT("/:id", handlers.UpdateProduct)
			products.DELETE("/:id", handlers.DeleteProduct)
		}
	}
}
