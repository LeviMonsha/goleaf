package models

type Search struct {
	SearchKey  string
	NextPage   int
	TotalPages int
	Results    Results
}