// server/index.js

const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// A map to associate a data 'type' with its Notion DB ID and property parser
const notionDatabases = {
  prompts: {
    databaseId: process.env.NOTION_PROMPTS_DATABASE_ID,
    parser: (page) => {
      const allProps = {};
      for (const [key, value] of Object.entries(page.properties)) {
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
      return { id: page.id, ...allProps };
    }
  },
  llm_links: {
    databaseId: process.env.NOTION_LINKS_DATABASE_ID,
    parser: (page) => {
      const props = page.properties;
      return {
        id: page.id,
        name: props.Name?.title?.[0]?.plain_text || '',
        isPopular: props.isPopular?.checkbox || false,
        model: props.Model?.rich_text?.[0]?.plain_text || '',
        category: props.Category?.select?.name || '',
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        tags: props.Tags?.multi_select?.map(tag => tag.name) || [],
        url: props.URL?.url || ''
      };
    }
  }
};

app.use(cors());

/**
 * Generic endpoint to fetch data from a specified Notion DB,
 * transform it, and cache it to a local JSON file.
 */
app.get('/api/fetch-and-cache', async (req, res) => {
  const { type } = req.query; // 'prompts' or 'llm_links'

  if (!type || !notionDatabases[type]) {
    return res.status(400).json({ error: 'Invalid or missing data type specified.' });
  }

  const { databaseId, parser } = notionDatabases[type];
  const cacheFileName = type === 'prompts' ? 'prompts.json' : 'llmLinks.json';
  const cachePath = path.join(__dirname, '..', 'public', 'data', cacheFileName);

  if (!databaseId) {
    return res.status(500).json({ error: `Notion Database ID for '${type}' is not configured.` });
  }

  try {
    console.log(`Fetching data for '${type}' from Notion...`);
    const response = await notion.databases.query({ database_id: databaseId });
    const data = response.results.map(parser);

    console.log(`Writing ${data.length} items to cache file: ${cachePath}`);
    await fs.writeFile(cachePath, JSON.stringify(data, null, 2));

    res.json({ message: `Successfully fetched and cached ${data.length} items for '${type}'.` });
  } catch (error) {
    console.error(`Error fetching from Notion for '${type}':`, error);
    res.status(500).json({ error: `Failed to fetch data from Notion API for '${type}'.` });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
  console.log(`🔄 Fetch and cache endpoint: http://localhost:${port}/api/fetch-and-cache`);
}); 