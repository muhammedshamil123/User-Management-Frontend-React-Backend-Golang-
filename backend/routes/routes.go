package routes

import (
	"backend/handlers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Set CORS headers
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Allow requests from your frontend origin
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true") // Allow cookies and credentials

		// Handle preflight requests
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(CORSMiddleware())

	router.POST("/user/register", handlers.RegisterUser)
	router.POST("/user/login", handlers.LoginUser)
	router.POST("/user/uploadImage/:email", handlers.UploadImage)

	router.POST("/admin/register", handlers.RegisterAdmin)
	router.POST("/admin/login", handlers.LoginAdmin)
	router.GET("/admin/dashboard", handlers.GetUsers)
	router.POST("/admin/addUser", handlers.AddUser)
	router.DELETE("/admin/deleteUser/:email", handlers.DeleteUser)
	router.PUT("/admin/updateUser/:email", handlers.UpdateUser)

	return router
}
