import React, { useState, useEffect } from "react";

function MainPage() {
  const [query, setQuery] = useState("2025");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    if (!query.trim()) {
      setArticles([]);
      setTotalPages(1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8085/search?q=${encodeURIComponent(
          query
        )}&page=${page}`
      );
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      if (data.results && Array.isArray(data.results.articles)) {
        setArticles(data.results.articles);
      } else {
        setArticles([]);
      }

      setTotalPages(data.totalPages || 1);
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
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>Goleaf News</h1>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите поисковый запрос"
            style={{
              padding: "10px",
              width: "300px",
              marginRight: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Поиск
          </button>
        </form>
      </header>

      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      {loading && <p>Загрузка...</p>}

      {!loading && !error && articles.length === 0 && (
        <p>Новостей не найдено.</p>
      )}

      <div>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "40px 0",
          }}
        >
          {articles.map((article, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "1px solid #eee",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                ":hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      overflow: "hidden",
                      borderRadius: "6px",
                      position: "relative",
                    }}
                  >
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "1.4rem",
                        lineHeight: "1.3",
                        color: "#333",
                      }}
                    >
                      {article.title}
                    </h3>

                    <p
                      style={{
                        margin: "0",
                        fontSize: "0.95rem",
                        color: "#666",
                        lineHeight: "1.5",
                        maxHeight: "3em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {article.description}
                    </p>
                  </div>
                </div>
              </a>

              <small
                style={{
                  display: "block",
                  marginTop: "15px",
                  paddingTop: "10px",
                  color: "#999",
                  fontSize: "0.8rem",
                  borderTop: "1px solid #eee",
                }}
              >
                Источник: {article.source?.name || "неизвестен"} | Автор:{" "}
                {article.author || "неизвестен"} | Дата:{" "}
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleString()
                  : "неизвестна"}
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

export default MainPage;
