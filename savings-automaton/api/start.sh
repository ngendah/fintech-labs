#!/usr/bin/env sh
: "${DATABASE_URL:=sqlite3:///file::memory:?cache=shared}"
export DATABASE_URL
npx knex migrate:latest
npx knex seed:run
npm run start:all
