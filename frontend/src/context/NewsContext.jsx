import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [markets, setMarkets] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalData = async () => {
    try {
      const [catsRes, brkRes, mktRes, heroRes] = await Promise.allSettled([
        api.get('/categories'),
        api.get('/news/breaking'),
        api.get('/markets'),
        api.get('/news/hero-slides')
      ]);

      if (catsRes.status === 'fulfilled') setCategories(catsRes.value.data);
      if (brkRes.status === 'fulfilled') setBreakingNews(brkRes.value.data);
      if (mktRes.status === 'fulfilled') setMarkets(mktRes.value.data);
      if (heroRes.status === 'fulfilled') setHeroSlides(heroRes.value.data);
    } catch (err) {
      console.error('Failed to fetch global news data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
    // Poll market & breaking news updates every 60 seconds
    const interval = setInterval(fetchGlobalData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NewsContext.Provider
      value={{
        categories,
        breakingNews,
        markets,
        heroSlides,
        loading,
        refreshGlobalData: fetchGlobalData
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
