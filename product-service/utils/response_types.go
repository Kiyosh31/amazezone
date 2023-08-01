package utils

import "github.com/gin-gonic/gin"

func CreateErrorResponse(message string, err error) gin.H {
	return gin.H{
		"message": message,
		"error":   err.Error(),
	}
}
