import React, { useEffect, useState } from "react";
import NewsCard from "./cards/NewsCard";
import Category from "./cards/Category";
import { useSearch } from "./contexts/SearchContext";
import WeatherCard from "./cards/WeatherCard";
import { ErrorMessage, Loader } from "./utils/Elements";

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("General");
  const { searchQuery, country } = useSearch();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        let apiUrl = "";

        if (searchQuery) {
          apiUrl = `https://gnews.io/api/v4/search?q=${searchQuery}&apikey=${process.env.REACT_APP_NEWS_API_KEY}`;
        } else {
          apiUrl = `https://gnews.io/api/v4/top-headlines?category=${activeCategory.toLowerCase()}&country=${country.toLowerCase()}&apikey=${
            process.env.REACT_APP_NEWS_API_KEY
          }`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(
            `Reached API request limits for a day. Status:` + response.status
          );
        }
        const data = await response.json();

        const articles = data.articles || [];
        const filteredNews = articles.filter(
          (news) => news.title && news.url && news.title !== "[Removed]"
        );

        setNewsList(filteredNews);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory, searchQuery, country]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="">
      <div className="row">
        <div className="col-md-3 d-flex flex-column justify-content-between">
          <div className="mb-1">
            <Category
              activeCategory={activeCategory}
              handleCategoryChange={handleCategoryChange}
            />
          </div>
          <div>
            <WeatherCard />
          </div>
        </div>

        <div
          className="col"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div className="card shadow-sm">
            {searchQuery !== "" ? (
              <div className="card-header fw-medium fs-4">
                Search result for - {searchQuery}
              </div>
            ) : (
              <div className="card-header fw-medium fs-4">{activeCategory}</div>
            )}
            {loading ? (
              <Loader />
            ) : (
              <>
                {error ? (
                  <ErrorMessage />
                ) : (
                  <>
                    <div className="card-body">
                      {newsList.map((news, index) => (
                        <NewsCard key={index} news={news} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsList;
