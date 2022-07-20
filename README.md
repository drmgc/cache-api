# Cache API example

## Installation

```bash
$ npm ci
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The service will be running on [http://localhost:3000/](http://localhost:3000/) by default.

Documentation is available at [http://localhost:3000/docs](http://localhost:3000/docs)

## Environment Variables

`PORT` -- a port the service will be using

`MONGODB_URI` -- a connection string for MongoDB

`CACHE_TTL` -- time-to-leave of a cache record. Format base on [ms](https://github.com/vercel/ms)

`CACHE_CAPACITY` -- maximal count of cache entries.

`CACHE_CLEANUP_GAP` -- on reaching `CACHE_CAPACITY` - `CACHE_CLEANUP_GAP` the service will try to cleanup cache. At first only expried entries will be cleaned up. If that's not enough, top `CACHE_CLEANUP_GAP` oldest records will be removed.

## Requirements

Running MongoDB is required. You can also start a mongo from container using `docker-compose up`.

