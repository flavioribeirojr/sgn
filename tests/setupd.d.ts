import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql'

declare global {
  export var databaseContainer: StartedPostgreSqlContainer
}