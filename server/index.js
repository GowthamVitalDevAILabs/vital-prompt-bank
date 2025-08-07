// server/index.js

const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
const databaseId = process.env.NOTION_DATABASE_ID;

app.use(cors());

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    env: {
      hasApiKey: !!process.env.NOTION_API_KEY,
      hasDatabaseId: !!process.env.NOTION_DATABASE_ID,
      port: process.env.PORT || 3001
    }
  });
});

app.get('/api/prompts', async (req, res) => {
  if (!databaseId) {
    return res.status(500).json({ error: 'Notion Database ID is not configured.' });
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const prompts = response.results.map(page => {
      // Dynamically extract all properties
      const allProps = {};
      for (const [key, value] of Object.entries(page.properties)) {
        // Handle different property types as needed
        if (value.type === 'title') {
          allProps[key] = value.title?.[0]?.plain_text || '';
        } else if (value.type === 'rich_text') {
          allProps[key] = value.rich_text?.[0]?.plain_text || '';
        } else if (value.type === 'select') {
          allProps[key] = value.select?.name || '';
        } else if (value.type === 'multi_select') {
          allProps[key] = value.multi_select?.map(tag => tag.name) || [];
        } else if (value.type === 'checkbox') {
          allProps[key] = value.checkbox;
        } else if (value.type === 'date') {
          allProps[key] = value.date?.start || '';
        } else if (value.type === 'number') {
          allProps[key] = value.number;
        } else if (value.type === 'url') {
          allProps[key] = value.url;
        } else if (value.type === 'email') {
          allProps[key] = value.email;
        } else if (value.type === 'phone_number') {
          allProps[key] = value.phone_number;
        } else {
          // Fallback for other types
          allProps[key] = value[value.type];
        }
      }
      return {
        id: page.id,
        ...allProps,
      };
    });

    console.log('Prompts sent to frontend:', prompts);

    res.json(prompts);
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    res.status(500).json({ error: 'Failed to fetch data from Notion API.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
  console.log(`📝 Test endpoint: http://localhost:${port}/api/test`);
  console.log(`🔗 Prompts endpoint: http://localhost:${port}/api/prompts`);
}); 