# Cache control API

This is a simple REST API to act like a small management system. It handle also TTLs for cache records and king of data rotation so that it overrides the oldest cache records when the maximum cache size is exceeded.

## Setup

Just install node modules using

```jsx
yarn # or npm i
```

## Run

```jsx
yarn dev # or npm run dev
```

## Test

```jsx
yarn test # or npm run test
```

## To be done

- [x]  Add endpoint that return cached data for a given key
    - [x]  return random string if key was not found
    - [x]  return cached data for this key if it was found
- [x]  Limit number of cache records, and override the cache if it was exceeded
- [x]  Handle TTL for each cache record
- [x]  Add endpoint to return all keys
- [x]  Add endpoint to remove all keys
- [x]  Add endpoint to remove a single cache record by its key
- [x]  Add endpoint to create or update a single cache record
- [x]  Cover with tests
- [ ]  Enable CORS
- [ ]  Properly handle **all** server errors
- [ ]  Return unified API response
- [ ]  Docker image
