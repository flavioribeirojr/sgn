import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../config/env'
import * as schema from './schema'

const queryClient = postgres(env.DATABASE_CONNECTION_URL)
export const db = () => drizzle(queryClient, { schema })