package services

import (
	"encoding/json"
	"fmt"
	"goleaf/internal/config"
	"goleaf/internal/models"
	"math"
	"net/http"
	"net/url"
	"strconv"

	"github.com/gin-gonic/gin"
)

func SearchHandler(c *gin.Context) {
	searchKey := c.Query("q")
	if searchKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing search query parameter 'q'"})
		return
	}

	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page parameter"})
		return
	}

	pageSize := 20
	apiKey := config.ApiKey
	endpoint := fmt.Sprintf(
		"https://newsapi.org/v2/everything?q=%s&pageSize=%d&page=%d&apiKey=%s&sortBy=publishedAt&language=en",
		url.QueryEscape(searchKey), pageSize, page, apiKey,
	)
	print(endpoint)

	resp, err := http.Get(endpoint)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch news data"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "News API returned error"})
		return
	}

	var results models.Results
	err = json.NewDecoder(resp.Body).Decode(&results)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode news data"})
		return
	}

	totalPages := int(math.Ceil(float64(results.TotalResults) / float64(pageSize)))

	search := models.Search{
		SearchKey:  searchKey,
		NextPage:   page,
		TotalPages: totalPages,
		Results:    results,
	}

	c.JSON(http.StatusOK, search)
}
