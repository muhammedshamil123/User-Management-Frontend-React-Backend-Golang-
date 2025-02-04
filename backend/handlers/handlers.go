package handlers

import (
	"backend/db"
	"backend/models"
	"backend/utils"
	"context"
	"fmt"
	"os"

	"net/http"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var existingUser models.User
	if err := db.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hash)

	if err := db.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

func RegisterAdmin(c *gin.Context) {
	var admin models.Admin
	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var existingAdmin models.Admin
	if err := db.DB.Where("email = ?", admin.Email).First(&existingAdmin).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(admin.Password), bcrypt.DefaultCost)
	admin.Password = string(hash)

	if err := db.DB.Create(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Admin registered successfully"})
}

func LoginUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var existingUser models.User
	if err := db.DB.Where("email = ?", user.Email).First(&existingUser).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	fmt.Println(existingUser)

	if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(user.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Password"})
		return
	}

	token, err := utils.CreateToken(user.Email, "user", existingUser.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	userDetails := models.UserDetails{
		Name:  existingUser.Name,
		Email: existingUser.Email,
		Image: existingUser.Image,
	}
	c.JSON(http.StatusOK, gin.H{
		"message":     "Login successful",
		"token":       token,
		"userDetails": userDetails,
	})
}
func LoginAdmin(c *gin.Context) {
	var admin models.Admin
	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var existingAdmin models.Admin
	if err := db.DB.Where("email = ?", admin.Email).First(&existingAdmin).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(existingAdmin.Password), []byte(admin.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.CreateToken(admin.Email, "admin", admin.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	userDetails := models.UserDetails{
		Name:  existingAdmin.Name,
		Email: existingAdmin.Email,
		Image: "",
	}
	c.JSON(http.StatusOK, gin.H{
		"message":     "Login successful",
		"token":       token,
		"userDetails": userDetails,
	})
}

func uploadImageToCloudinary(filePath string) (string, error) {
	ctx := context.Background()
	cld, err := cloudinary.NewFromParams("drbv64pdy", "958454882948255", "YzbThloEhjn9Z_bXOsNaMc2OIeY")
	if err != nil {
		return "", fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	uploadResult, err := cld.Upload.Upload(ctx, filePath, uploader.UploadParams{})
	if err != nil {
		return "", fmt.Errorf("failed to upload image: %w", err)
	}

	return uploadResult.SecureURL, nil
}
func UploadImage(c *gin.Context) {

	email := c.Param("email")
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to get the image file"})
		return
	}

	tempFile := fmt.Sprintf("./temp/%s", file.Filename)
	if err := c.SaveUploadedFile(file, tempFile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save the image file"})
		return
	}
	defer os.Remove(tempFile)

	cloudinaryURL, err := uploadImageToCloudinary(tempFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload image to Cloudinary"})
		return
	}

	result := db.DB.Model(&models.User{}).Where("email = ?", email).Update("image", cloudinaryURL)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update database"})
		return
	}
	fmt.Println(cloudinaryURL)
	c.JSON(http.StatusOK, gin.H{
		"message": "Image uploaded successfully",
		"user":    "user",
		"image":   cloudinaryURL,
	})
}

func GetUsers(c *gin.Context) {
	db := db.DB

	var users []models.User
	if err := db.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch users"})
		return
	}

	c.JSON(http.StatusOK, users)
}

func AddUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	fmt.Println("hello", user)
	var existingUser models.User
	if err := db.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hash)

	if err := db.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

func DeleteUser(c *gin.Context) {
	email := c.Param("email")
	result := db.DB.Where("email = ?", email).Delete(&models.User{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error deleting user",
			"error":   result.Error.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}
func UpdateUser(c *gin.Context) {
	var updatedUser models.User
	email := c.Param("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Email is required"})
		return
	}

	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}

	var existingUser models.User
	if err := db.DB.Where("email = ?", email).First(&existingUser).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found", "error": err.Error()})
		return
	}

	var exist models.User
	if err := db.DB.Where("email = ?", updatedUser.Email).First(&exist).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	updates := map[string]interface{}{}
	if updatedUser.Name != "" {
		updates["name"] = updatedUser.Name
	}
	if updatedUser.Email != "" {
		updates["email"] = updatedUser.Email
	}
	if updatedUser.Password != "" {
		hash, _ := bcrypt.GenerateFromPassword([]byte(updatedUser.Password), bcrypt.DefaultCost)
		updates["password"] = hash
	}

	result := db.DB.Model(&models.User{}).Where("email = ?", email).Updates(updates)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating user", "error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}
