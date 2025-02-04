package main

import (
	"backend/db"
	"backend/routes"
	"log"
)

func main() {
	db.InitDB()

	r := routes.SetupRouter()

	log.Fatal(r.Run(":8080"))

}
