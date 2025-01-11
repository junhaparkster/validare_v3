import React, { useState, useEffect } from 'react';
    import { useSearchParams, useNavigate } from 'react-router-dom';
    import './ResultsPage.css';

    const ResultsPage = () => {
      const [searchParams] = useSearchParams();
      const [results, setResults] = useState(null);
      const navigate = useNavigate();
      const query = searchParams.get('query');

        useEffect(() => {
          const fetchResults = async () => {
            try {
              const response = await fetch(`/api/search?query=${query}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              setResults(data);
            } catch (error) {
              console.error("Could not fetch search results:", error);
            }
          };

          if (query) {
            fetchResults();
          }
        }, [query]);

      const handleContinue = () => {
        navigate(`/user-list?query=${query}`);
      };

      if (!results) {
        return <div className="results-container">Loading...</div>;
      }

      return (
        <div className="results-container">
          <h1>Search Results for: {query}</h1>
          <div className="results-content">
            <div className="subreddits">
              <h2>Top Subreddits</h2>
              <ul>
                {results.subreddits.map((subreddit, index) => (
                  <li key={index}>
                    <a href={`https://www.reddit.com/r/${subreddit}`} target="_blank" rel="noopener noreferrer">
                      {subreddit}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="posts">
              <h2>Example Posts</h2>
              <ul>
                {results.posts.map((post, index) => (
                  <li key={index}>
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      {post.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button className="continue-button" onClick={handleContinue}>Continue</button>
        </div>
      );
    };

    export default ResultsPage;
