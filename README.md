# Cache control API

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/omarahm3/cache-control)

This is a simple REST API to act like a small management system. It handle also TTLs for cache records and king of data rotation so that it overrides the oldest cache records when the maximum cache size is exceeded.

## Prerequisites

- You need to have mongodb running on your machine to be able to run the server. Tests are using in-memory database though.

```
# You can run a local instance directly using docker
docker run -d -p 27017:27017 --name local-mongo mongo:latest
```

- To be able to properly run the tests, its recommended to use node version `"^12.13.0 || ^14.15.0 || ^16.10.0 || >=17.0.0"` or jest will throw this error:

[Check the workflow](https://github.com/omarahm3/cache-control/runs/6582756628?check_suite_focus=true)

```
error jest@28.1.0: The engine "node" is incompatible with this module. Expected version "^12.13.0 || ^14.15.0 || ^16.10.0 || >=17.0.0". Got "15.14.0"
```

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
