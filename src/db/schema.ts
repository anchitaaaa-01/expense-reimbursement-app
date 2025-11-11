import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('employee'),
  department: text('department').notNull(),
  createdAt: text('created_at').notNull(),
});

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('USD'),
  category: text('category').notNull(),
  description: text('description'),
  receiptUrl: text('receipt_url'),
  status: text('status').notNull().default('draft'),
  submittedAt: text('submitted_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const approvals = sqliteTable('approvals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  expenseId: integer('expense_id').references(() => expenses.id).notNull(),
  approverId: integer('approver_id').references(() => users.id).notNull(),
  status: text('status').notNull(),
  comments: text('comments'),
  approvedAt: text('approved_at'),
  createdAt: text('created_at').notNull(),
});

export const approvalRules = sqliteTable('approval_rules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  minAmount: real('min_amount').notNull().default(0),
  maxAmount: real('max_amount'),
  requiredApprovers: integer('required_approvers').notNull().default(0),
  autoApprove: integer('auto_approve', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

export const companySettings = sqliteTable('company_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  createdAt: text('created_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});