package app

import (
	"goleaf/internal/routes"
	"log"
	"net/http"
	"os"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("<h1>Hello World!</h1>"))
}

func Run() {
	port := os.Getenv("PORT")
    if port == "" {
        port = "8000"
    }

    apiKey := os.Getenv("API_KEY")
	if apiKey == "" {
		log.Fatal("API_KEY environment variable is not set")
	}

	routes.SetAPIKey(apiKey)

    mux := http.NewServeMux()

    mux.HandleFunc("/search", routes.SearchHandler)
    http.ListenAndServe(":"+port, mux)
}
