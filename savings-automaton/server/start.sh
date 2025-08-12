#! /usr/bin/sh
npx prisma migrate deploy
npx prisma generate

nest start
