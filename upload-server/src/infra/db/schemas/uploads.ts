import { randomUUID } from 'node:crypto'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const UPLOADS_TABLE_NAME = 'uploads'

export const uploads = pgTable(UPLOADS_TABLE_NAME, {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  remoteKey: text('remote_key').notNull().unique(),
  remoteUrl: text('remote_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
