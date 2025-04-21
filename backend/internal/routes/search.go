package routes

import (
	"encoding/json"
	"fmt"
	"goleaf/internal/models"
	"math"
	"net/http"
	"net/url"
	"strconv"
)

var (
	apiKey string
)

func SetAPIKey(key string) {
	apiKey = key
}

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	searchKey := params.Get("q")
	if searchKey == "" {
		http.Error(w, "Missing search query parameter 'q'", http.StatusBadRequest)
		return
	}

	pageStr := params.Get("page")
	if pageStr == "" {
		pageStr = "1"
	}
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		http.Error(w, "Invalid page parameter", http.StatusBadRequest)
		return
	}

	pageSize := 20

	endpoint := fmt.Sprintf(
		"https://newsapi.org/v2/everything?q=%s&pageSize=%d&page=%d&apiKey=%s&sortBy=publishedAt&language=en",
		url.QueryEscape(searchKey), pageSize, page, apiKey,
	)

	resp, err := http.Get(endpoint)
	if err != nil {
		http.Error(w, "Failed to fetch news data", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "News API returned error", http.StatusInternalServerError)
		return
	}

	var results models.Results
	err = json.NewDecoder(resp.Body).Decode(&results)
	if err != nil {
		http.Error(w, "Failed to decode news data", http.StatusInternalServerError)
		return
	}

	totalPages := int(math.Ceil(float64(results.TotalResults) / float64(pageSize)))

	search := models.Search{
		SearchKey:  searchKey,
		NextPage:   page,
		TotalPages: totalPages,
		Results:    results,
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(search)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}
