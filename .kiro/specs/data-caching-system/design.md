# Design Document

## Overview

The data caching system transforms the current direct API approach into a hybrid caching architecture. Instead of making real-time API calls to Notion for every page load, the system will:

1. Fetch data from Notion on-demand via a generic backend endpoint
2. Cache the transformed data in local JSON files in the `public/data/` directory
3. Serve data to the frontend from these local JSON files for fast loading
4. Provide manual sync functionality to refresh cached data when needed

This approach provides offline capability, faster load times, and reduced API usage while maintaining data freshness through user-controlled synchronization.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend (React)"
        A[PromptsPage] --> B[usePrompts Hook]
        C[LlmLinksPage] --> D[useLlmLinks Hook]
        B --> E[Local JSON Files]
        D --> E
        A --> F[Sync Button]
        C --> G[Sync Button]
    end
    
    subgraph "Backend (Express)"
        H[/api/fetch-and-cache] --> I[Notion Client]
        H --> J[File System]
        F --> H
        G --> H
    end
    
    subgraph "Data Storage"
        E --> K[/public/data/prompts.json]
        E --> L[/public/data/llmLinks.json]
        J --> K
        J --> L
        I --> M[Notion API]
    end
```

### Data Flow

1. **Initial Load**: Frontend hooks fetch data from local JSON files
2. **Manual Sync**: User clicks sync button → Backend fetches from Notion → Updates local JSON → Frontend refetches from updated JSON
3. **Offline Access**: Application continues to work with cached JSON files when offline

## Components and Interfaces

### Backend Components

#### Generic Fetch and Cache Endpoint
- **Path**: `/api/fetch-and-cache`
- **Method**: GET
- **Query Parameters**: `type` (string) - Data type identifier ('prompts' or 'llm_links')
- **Response**: Success/error message with item count

#### Database Configuration Map
```javascript
const notionDatabases = {
  prompts: {
    databaseId: process.env.NOTION_PROMPTS_DATABASE_ID,
    parser: (page) => { /* transform Notion page to prompt object */ }
  },
  llm_links: {
    databaseId: process.env.NOTION_LINKS_DATABASE_ID,
    parser: (page) => { /* transform Notion page to link object */ }
  }
}
```

#### Property Parsers
Each data type has a custom parser function that transforms Notion page properties into standardized objects:
- **Prompts Parser**: Handles dynamic property extraction for flexible prompt schemas
- **LLM Links Parser**: Handles specific properties (name, isPopular, model, category, description, tags, url)

### Frontend Components

#### Updated Hooks
- **usePrompts**: Fetches from `/data/prompts.json` instead of API endpoint
- **useLlmLinks**: New hook that fetches from `/data/llmLinks.json`

#### Page Components
- **PromptsPage**: Enhanced with sync functionality and error handling
- **LlmLinksPage**: Enhanced with sync functionality and error handling

#### Sync Functionality
- Manual sync buttons on each page
- Toast notifications for sync status
- Error handling for network failures
- Prevention of concurrent sync operations

## Data Models

### Prompt Interface
```typescript
interface Prompt {
  id: string;
  [key: string]: any; // Dynamic properties from Notion
}
```

### LLM Link Interface
```typescript
interface LlmLink {
  id: string;
  name: string;
  isPopular: boolean;
  model: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
}
```

### API Response Interface
```typescript
interface CacheResponse {
  message: string;
  error?: string;
}
```

## Error Handling

### Backend Error Scenarios
1. **Invalid Data Type**: Return 400 with descriptive error message
2. **Missing Database ID**: Return 500 with configuration error message
3. **Notion API Failure**: Return 500 with API error details
4. **File System Errors**: Log error and return 500 with generic message

### Frontend Error Scenarios
1. **Network Failures**: Display toast with retry option
2. **JSON Parse Errors**: Display error state with refresh option
3. **Missing Cache Files**: Display loading state or empty state
4. **Concurrent Sync Prevention**: Disable sync button during operation

### Error Recovery
- Graceful degradation when cache files are missing
- Retry mechanisms for failed sync operations
- Clear error messaging to guide user actions
- Fallback to existing data when sync fails

## Testing Strategy

### Backend Testing
1. **Unit Tests**:
   - Test database configuration mapping
   - Test property parsers for each data type
   - Test error handling for invalid inputs
   - Test file system operations

2. **Integration Tests**:
   - Test complete fetch-and-cache flow
   - Test Notion API integration
   - Test JSON file creation and updates

### Frontend Testing
1. **Hook Testing**:
   - Test data fetching from local JSON files
   - Test error states and loading states
   - Test cache invalidation and refetching

2. **Component Testing**:
   - Test sync button functionality
   - Test toast notifications
   - Test error state displays
   - Test offline behavior

3. **End-to-End Testing**:
   - Test complete sync workflow
   - Test offline functionality
   - Test data consistency between sync operations

### Performance Testing
1. **Load Time Comparison**: Measure improvement in initial page load times
2. **Cache File Size**: Monitor JSON file sizes and loading performance
3. **Sync Operation Time**: Measure time for complete sync operations
4. **Memory Usage**: Monitor frontend memory usage with cached data

## Security Considerations

### Environment Variables
- Separate database IDs for different data types
- Secure storage of Notion API keys
- Validation of environment variable presence

### File System Security
- Restrict cache file locations to public/data directory
- Validate file paths to prevent directory traversal
- Proper error handling to avoid information leakage

### API Security
- Input validation for data type parameters
- Rate limiting considerations for sync operations
- CORS configuration for frontend access