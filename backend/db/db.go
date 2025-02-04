package db

import (
	"backend/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	dsn := "host=localhost user=postgres password=6930 dbname=users port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	DB.AutoMigrate(&models.User{}, &models.Admin{})
}

func UpdateUserImage(email string, imagePath string) error {
	query := `UPDATE users SET image = $1 WHERE email = $2`
	result := DB.Exec(query, imagePath, email)
	return result.Error
}
