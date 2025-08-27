# Implementation Plan

- [x] 1. Set up data directory structure and environment variables


  - Create `public/data/` directory for cache files
  - Update server environment variables to use specific database IDs
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. Implement generic backend caching endpoint

  - [x] 2.1 Create database configuration mapping system


    - Define `notionDatabases` object with database IDs and parsers
    - Implement property parser for prompts data type
    - Implement property parser for llm_links data type
    - _Requirements: 3.1, 3.2, 6.1_

  - [x] 2.2 Implement `/api/fetch-and-cache` endpoint


    - Add route handler with type parameter validation
    - Implement Notion API data fetching logic
    - Add JSON file writing functionality with proper error handling
    - _Requirements: 3.1, 3.3, 3.4, 6.2, 6.3_

  - [x] 2.3 Add comprehensive error handling

    - Handle invalid data type parameters (400 errors)
    - Handle missing database ID configuration (500 errors)
    - Handle Notion API failures with descriptive messages
    - _Requirements: 3.3, 5.2, 6.2_

- [x] 3. Update frontend hooks for local JSON file access

  - [x] 3.1 Refactor usePrompts hook


    - Change queryFn to fetch from `/data/prompts.json`
    - Update staleTime to Infinity for cache-first approach
    - Maintain existing Prompt interface
    - _Requirements: 1.1, 1.2, 4.1_

  - [x] 3.2 Create useLlmLinks hook


    - Implement new hook following usePrompts pattern
    - Define LlmLink interface with required properties
    - Configure React Query for local JSON file fetching
    - _Requirements: 1.1, 1.2, 4.1_

- [x] 4. Implement sync functionality in page components

  - [x] 4.1 Add sync functionality to PromptsPage


    - Import required dependencies (RefreshCw icon, useToast)
    - Implement handleRefresh function with API call to fetch-and-cache
    - Add sync button to page header with loading states
    - Add toast notifications for sync status and errors
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_



  - [ ] 4.2 Add sync functionality to LlmLinksPage
    - Import useLlmLinks hook and sync dependencies
    - Implement handleRefresh function for llm_links data type
    - Add sync button to page header matching PromptsPage pattern

    - Add consistent toast notifications and error handling

    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 5. Implement error handling and offline support
  - [ ] 5.1 Add frontend error states for missing cache files
    - Update hooks to handle missing JSON files gracefully


    - Display appropriate loading or empty states when files don't exist
    - Provide clear messaging for users when cache is empty
    - _Requirements: 1.3, 4.2, 6.4_



  - [ ] 5.2 Implement offline detection and messaging
    - Add network error handling in sync functions
    - Display offline-specific error messages when sync fails
    - Ensure cached data remains accessible when offline
    - _Requirements: 4.1, 4.2, 4.3_



- [ ] 6. Remove deprecated API endpoint and update configurations
  - [x] 6.1 Remove old `/api/prompts` endpoint from backend


    - Delete the existing prompts endpoint from server/index.js


    - Remove unused imports and variables related to old endpoint
    - Update server logging to reflect new endpoint structure
    - _Requirements: 3.1, 3.2_


  - [ ] 6.2 Update API service layer
    - Remove or update ApiService.getPrompts method
    - Update API_BASE_URL usage to reflect new architecture
    - Clean up unused API service methods
    - _Requirements: 1.1, 3.1_


- [ ] 7. Add comprehensive testing and validation
  - [ ] 7.1 Test backend endpoint functionality
    - Write tests for database configuration mapping
    - Test property parsers for both data types
    - Test error handling for invalid parameters and missing config
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 7.2 Test frontend hook behavior
    - Test data fetching from local JSON files
    - Test error states when files are missing
    - Test refetch functionality after sync operations
    - _Requirements: 1.1, 1.2, 1.3, 4.1_

  - [ ] 7.3 Test sync workflow end-to-end
    - Test complete sync operation from button click to data refresh
    - Test error handling during sync failures
    - Test prevention of concurrent sync operations
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_