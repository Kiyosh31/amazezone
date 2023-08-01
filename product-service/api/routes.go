package api

import (
	"product_service/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		product := api.Group("/product")
		{
			product.GET("", handlers.GetAllProducts)
			product.GET("/:id", handlers.GetProductById)
			product.POST("/", handlers.CreateProduct)
			product.PUT("/:id", handlers.UpdateProduct)
			product.DELETE("/:id", handlers.DeleteProduct)

			comment := product.Group("/comment")
			{
				comment.POST("", handlers.CreateComment)
				comment.GET("/:id", handlers.GetComment)
				comment.GET("/all/:id", handlers.GetAllComments)
			}
		}
	}
}
