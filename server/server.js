import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import axios from 'axios';
    import { GoogleGenerativeAI } from "@google/generative-ai";
    import { createClient } from '@supabase/supabase-js';

    dotenv.config();

    const app = express();
    const port = 3000;

    app.use(cors());
    app.use(express.json());

    const googleApiKey = process.env.GOOGLE_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    app.get('/api/search', async (req, res) => {
      const { query } = req.query;

      if (!query) {
        return res.status(400).send({ error: 'Missing query parameter' });
      }

      try {
        const searchResults = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: googleApiKey,
            cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
            q: `site:reddit.com ${query}`,
          },
        });

        const redditLinks = searchResults.data.items
          ? searchResults.data.items.filter(item => item.link.includes('reddit.com'))
          : [];

        const subreddits = new Set();
        const posts = [];

        for (const item of redditLinks) {
          const url = new URL(item.link);
          const pathSegments = url.pathname.split('/').filter(Boolean);

          if (pathSegments[0] === 'r' && pathSegments.length > 1) {
            subreddits.add(pathSegments[1]);
            if (pathSegments.length > 2) {
              posts.push({
                title: item.title,
                url: item.link,
              });
            }
          }
        }

        const topSubreddits = Array.from(subreddits).slice(0, 5);
        const examplePosts = posts.slice(0, 5);

        res.send({ subreddits: topSubreddits, posts: examplePosts });
      } catch (error) {
        console.error('Error during Google Search API call:', error);
        res.status(500).send({ error: 'Failed to fetch search results' });
      }
    });

    app.get('/api/generate-users', async (req, res) => {
      const { query } = req.query;

      if (!query) {
        return res.status(400).send({ error: 'Missing query parameter' });
      }

      try {
        const prompt = `Generate a list of 10 Reddit usernames and their profile links that are interested in ${query}.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const userList = text.split('\n').filter(line => line.trim() !== '').map(line => {
          const parts = line.split(' ');
          const username = parts[0].replace('u/', '').replace(':', '');
          const profileLink = `https://www.reddit.com/user/${username}`;
          return { username, profileLink };
        });

        res.send({ users: userList });
      } catch (error) {
        console.error('Error during Gemini API call:', error);
        res.status(500).send({ error: 'Failed to generate user list' });
      }
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
