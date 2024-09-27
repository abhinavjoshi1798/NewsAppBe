const axios = require("axios");

// NewsAPI and CurrentsAPI configurations
const apiSources = [
    {
      name: 'NewsAPI',
      url: 'https://newsapi.org/v2/top-headlines',
      params: {
        apiKey: 'c9529bacbd14464eaf899bc393d51c20',
        country: 'in', // India news
        pageSize: 10,
      },
    },
    {
      name: 'CurrentsAPI',
      url: 'https://api.currentsapi.services/v1/latest-news',
      params: {
        apiKey: 'tazM99_9Jjo4seuX3zijifqE4y37d_HiRYJy32ODYVmHm4bA',
        language: 'en', // Language code for English articles
        keywords: 'India', // Filter articles containing the keyword "India"
      },
    },
];

// Helper function to fetch news from a given API source
async function fetchNews(source, category, query, page, pageSize) {
    try {
      // Create a copy of the params object to avoid mutation
      const params = { ...source.params };
      
  
      // For NewsAPI, set page and pageSize for pagination
      if (source.name === 'NewsAPI') {
        params.page = page;
        params.pageSize = pageSize;
      }
  
      // For CurrentsAPI, set start and limit for pagination
      if (source.name === 'CurrentsAPI') {
        params.start = (page - 1) * pageSize;
        params.limit = pageSize;
      }
  
      // Add category and query if provided
      if (category) params.category = category;
      if (query) {
        params.q = query; // For NewsAPI
        params.keywords += `,${query}`; // For CurrentsAPI, append keywords
      }
  
      const response = await axios.get(source.url, { params });
      return response.data.news || response.data.articles || [];
    } catch (error) {
      console.error(`Error fetching news from ${source.name}:`, error.message);
      return [];
    }
}
  

const getNews = async (req,res) => {
    console.log(req.query);

    const { category, query, page = 1, pageSize = 10 } = req.query;
    

    

    try {
      // Fetch news from all sources concurrently
      const newsPromises = apiSources.map(source =>
        fetchNews(source, category, query, page, pageSize)
      );
  
      // Combine the results and flatten the array
      const results = await Promise.all(newsPromises);
      const combinedNews = results.flat();
  
      // Paginate results based on the page and pageSize parameters
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + parseInt(pageSize);
      const paginatedNews = combinedNews.slice(startIndex, endIndex);
  
      // Return paginated news and metadata
      res.json({
        totalResults: combinedNews.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(combinedNews.length / pageSize),
        news: paginatedNews,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch news.' });
    }
}

module.exports = {
   getNews
};