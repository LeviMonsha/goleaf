package app

import (
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

    mux := http.NewServeMux()

    mux.HandleFunc("/", indexHandler)
    http.ListenAndServe(":"+port, mux)
}
