# SGN (Study Group Network)
A social network for people who believe studying together can be way more fun

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

To run integration tests simply run:

```bash
npm run test:int:watch
```

We use the @testcontainers package to raise Postgres and Redis containers (this require docker to be running)

To run e2e tests first create an `.env.test` file(with the same shape as .env.example). You must configure the database and redis connections.

Then run

```bash
npm run e2e
```