import { setupTestDB } from './db-setup'

process.env.MAIL_HOST = 'host'
process.env.MAIL_PORT = '0'

export default async function setup() {
  const dbContainer = await setupTestDB()

  globalThis.databaseContainer = dbContainer
}