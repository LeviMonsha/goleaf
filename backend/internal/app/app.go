package app

import (
	"goleaf/internal/routes"

	"github.com/gin-gonic/gin"
)

func Run() {
    r := gin.Default()
	r.Use(routes.CORSMiddleware())

    routes.SetupRoutes(r)
    r.Run(":8085")
}
