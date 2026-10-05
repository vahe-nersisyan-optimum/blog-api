# Blog API

A small blog built with Express and PostgreSQL. It has a JSON API for posts, users and tags, and a plain HTML page for browsing, creating and deleting posts.

## Requirements

- Node.js 20.6 or newer (the dev script uses `--env-file` and `--watch`)
- PostgreSQL

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create the database and load the schema and sample data:

   ```sh
   createdb blog
   psql blog -f schema.sql
   psql blog -f seed.sql
   ```

   `schema.sql` drops and recreates all tables, so running it again resets the database.

3. Create your environment file:

   ```sh
   cp .env.example .env
   ```

   Edit `DATABASE_URL` in `.env` if your database name, user or password is different, for example `postgres://user:password@localhost:5432/blog`.

## Run

```sh
npm run dev
```

Open http://localhost:3000/ to use the page. The server restarts when you save a file.

Open the page through the server, not by opening `public/index.html` as a file. Otherwise its API requests fail with "Could not reach the server".

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/posts` | List posts, newest first. Optional filters: `?tag=NAME`, `?userId=ID` |
| GET | `/api/posts/:id` | Get one post |
| POST | `/api/posts` | Create a post. Body: `{ "userId", "title", "content", "tags": [] }` |
| PUT | `/api/posts/:id` | Update a post. Body: `{ "title", "content", "tags": [] }` |
| DELETE | `/api/posts/:id` | Delete a post (204, no body) |
| GET | `/api/users` | List users |
| POST | `/api/users` | Create a user. Body: `{ "name", "email" }` |
| GET | `/api/tags` | List tags |

Errors return a non-2xx status with a JSON body: `{ "error": "message" }`.

Example:

```sh
curl -X POST http://localhost:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"userId": 1, "title": "Hello", "content": "First post", "tags": ["Intro"]}'
```

## Project layout

```
app.js          Express app: routes, static files, error handling
routes/         URL to controller mapping
controllers/    Read the request, send the response
services/       Validation and business rules
repositories/   SQL queries
middleware/     404 and error handlers
public/         The web page (index.html)
schema.sql      Database tables
seed.sql        Sample data
queries.sql     Practice queries (it updates and deletes rows, so it is not part of setup)
```
