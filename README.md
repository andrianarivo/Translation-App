### Translation App

To run this app: `make build && make start`

To stop: `make stop`

### In dev mode

- copy `.env.example` to `.env` and fill in the values (backend and frontend)
- run the database with `docker compose -f dev-compose.yml up -d`
- run migrations with `npx prisma@6.8.2 migrate dev`
- run backend with `pnpm i && pnpm run start:dev`
- run frontend with `pnpm i && pnpm run dev`
- test coverage in backend `pnpm run test:cov`