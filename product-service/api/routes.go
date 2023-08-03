package api

import (
	"product_service/utils"

	"github.com/gin-gonic/gin"
)

var log = utils.Logger()

func RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		product := api.Group("/product")
		{
			product.GET("", GetAllProducts)
			product.GET("/:id", GetProductById)
			product.POST("/", CreateProduct)
			product.PUT("/:id", UpdateProduct)
			product.DELETE("/:id", DeleteProduct)

			comment := product.Group("/comment")
			{
				comment.POST("", CreateComment)
				comment.GET("/:id", GetComment)
				comment.GET("/all/:id", GetAllComments)
			}
		}
	}
}
