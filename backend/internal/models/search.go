package models

type Search struct {
	SearchKey  string  `json:"searchKey"`
	NextPage   int     `json:"nextPage"`
	TotalPages int     `json:"totalPages"`
	Results    Results `json:"results"`
}
