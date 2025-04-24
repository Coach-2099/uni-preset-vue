// Vue 3 RSS Parser Implementation

// 1. First, install the required packages:
// npm install rss-parser axios

// 2. Create a proxy service to handle CORS issues
// src/services/rssService.js
import 'events';
import Parser from 'rss-parser';
import axios from 'axios';

// Create a CORS proxy URL (you can use a public one or set up your own)
// Be aware that public CORS proxies may have limitations
const CORS_PROXY = 'https://corsproxy.io/?url=';

export default {
  async fetchRssFeed(feedUrl) {
    try {
		// Initialize parser after getting the response
		const parser = new Parser();
      // Use a server-side approach with axios instead of direct browser parsing
	  const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`);

      // Parse the string content instead of direct URL fetching
      const feed = await parser.parseString(response.data);
      
      return feed;
    } catch (error) {
      console.error('Error fetching or parsing RSS feed:', error);
      throw error;
    }
  }
};
