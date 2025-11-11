CREATE TABLE `approval_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`min_amount` real DEFAULT 0 NOT NULL,
	`max_amount` real,
	`required_approvers` integer DEFAULT 0 NOT NULL,
	`auto_approve` integer DEFAULT false,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `approvals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`expense_id` integer NOT NULL,
	`approver_id` integer NOT NULL,
	`status` text NOT NULL,
	`comments` text,
	`approved_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `company_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `company_settings_key_unique` ON `company_settings` (`key`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`receipt_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`submitted_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'employee' NOT NULL,
	`department` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);