CREATE TYPE "motorcycle_status" AS ENUM('in_transit', 'delayed', 'arrived');--> statement-breakpoint
CREATE TABLE "motorcycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"model" text NOT NULL,
	"chassis" text NOT NULL UNIQUE,
	"estimated_arrival" date,
	"status" "motorcycle_status" DEFAULT 'in_transit'::"motorcycle_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
