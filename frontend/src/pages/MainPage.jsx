import React, { useState, useEffect } from "react";

function ProjectsList() {
  const [query, setQuery] = useState("golang");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/search?q=${encodeURIComponent(query)}&page=${page}`
      );
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.statusText}`);
      }
      const data = await response.json();
      setArticles(data.Results.Articles);
      setTotalPages(data.TotalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [query, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews();
  };

  return (
    <div>
      <header>
        <h1>Goleaf News</h1>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите поисковый запрос"
          />
          <button type="submit" disabled={loading}>
            Поиск
          </button>
        </form>
      </header>

      <div>
        <ul>
          {articles.map((article, idx) => (
            <li key={idx} style={{ marginBottom: "20px" }}>
              <a href={article.URL} target="_blank" rel="noopener noreferrer">
                <h3>{article.Title}</h3>
              </a>
              <p>{article.Description}</p>
              <small>
                Источник: {article.Source.Name} | Автор:{" "}
                {article.Author || "неизвестен"} | Дата:{" "}
                {new Date(article.PublishedAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      </div>

      <footer>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || loading}
        >
          Назад
        </button>
        <span style={{ margin: "0 10px" }}>
          Страница {page} из {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || loading}
        >
          Вперед
        </button>
      </footer>
    </div>
  );
}

export default ProjectsList;
