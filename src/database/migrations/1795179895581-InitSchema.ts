import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1795179895581 implements MigrationInterface {
  name = 'InitSchema1795179895581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "display_name" character varying(100) NOT NULL, "phone" character varying(20), "email" character varying(254), "avatar_url" text, "role" "public"."user_role" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "chk_users_contact" CHECK ("phone" IS NOT NULL OR "email" IS NOT NULL), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "place_opening_hours" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "place_id" uuid NOT NULL, "weekday" smallint NOT NULL, "opens_at" TIME NOT NULL, "closes_at" TIME NOT NULL, CONSTRAINT "chk_place_opening_hours_weekday" CHECK ("weekday" BETWEEN 1 AND 7), CONSTRAINT "PK_aaf801cabdf89d81c2aeb715d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_place_opening_hours_place_weekday" ON "place_opening_hours"  ("place_id", "weekday") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."place_kind" AS ENUM('attraction', 'restaurant', 'cafe', 'lodging', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "places" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "destination_id" uuid NOT NULL, "kind" "public"."place_kind" NOT NULL, "name" character varying(200) NOT NULL, "address" character varying(300), "latitude" double precision, "longitude" double precision, "price_min" bigint, "price_max" bigint, "typical_duration_minutes" smallint, "image_url" text, "source_url" text, "data_verified_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "chk_places_duration" CHECK ("typical_duration_minutes" IS NULL OR "typical_duration_minutes" > 0), CONSTRAINT "chk_places_price_range" CHECK ("price_min" IS NULL OR "price_max" IS NULL OR "price_min" <= "price_max"), CONSTRAINT "PK_1afab86e226b4c3bc9a74465c12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_places_destination_kind" ON "places"  ("destination_id", "kind") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."region" AS ENUM('north', 'central', 'south')`,
    );
    await queryRunner.query(
      `CREATE TABLE "destinations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying(80) NOT NULL, "name" character varying(120) NOT NULL, "region" "public"."region" NOT NULL, "province" character varying(80) NOT NULL, "description" text, "cover_image_url" text, "latitude" double precision, "longitude" double precision, CONSTRAINT "UQ_30864aeaf404f4a6d3f816bd8c5" UNIQUE ("slug"), CONSTRAINT "PK_69c5e8db964dcb83d3a0640f3c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "itinerary_template_items" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "template_id" uuid NOT NULL, "day_index" smallint NOT NULL, "position" integer NOT NULL, "place_id" uuid, "title" character varying(200) NOT NULL, "start_time" TIME, "duration_minutes" smallint, "est_cost_per_person" bigint, "note" text, CONSTRAINT "chk_itinerary_template_items_duration" CHECK ("duration_minutes" IS NULL OR "duration_minutes" > 0), CONSTRAINT "chk_itinerary_template_items_day" CHECK ("day_index" >= 1), CONSTRAINT "PK_9c88f014a61842617813042651b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_itinerary_template_items_order" ON "itinerary_template_items"  ("template_id", "day_index", "position") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."template_status" AS ENUM('draft', 'published', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "itinerary_templates" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "destination_id" uuid NOT NULL, "slug" character varying(120) NOT NULL, "title" character varying(200) NOT NULL, "days_count" smallint NOT NULL, "summary" text, "est_cost_per_person" bigint, "status" "public"."template_status" NOT NULL DEFAULT 'draft', "published_at" TIMESTAMP WITH TIME ZONE, "last_reviewed_at" TIMESTAMP WITH TIME ZONE, "created_by_id" uuid, CONSTRAINT "UQ_afbd4b94662566fc54c3a5d3c5b" UNIQUE ("slug"), CONSTRAINT "chk_itinerary_templates_days" CHECK ("days_count" BETWEEN 1 AND 30), CONSTRAINT "PK_d48d23293e94f9c888683c390e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_itinerary_templates_published" ON "itinerary_templates"  ("destination_id", "days_count") WHERE "status" = 'published'`,
    );
    await queryRunner.query(
      `CREATE TABLE "itinerary_items" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "trip_id" uuid NOT NULL, "day_index" smallint NOT NULL, "position" integer NOT NULL, "place_id" uuid, "title" character varying(200) NOT NULL, "start_time" TIME, "duration_minutes" smallint, "est_cost_per_person" bigint, "note" text, "source_template_item_id" uuid, "created_by_member_id" uuid, CONSTRAINT "chk_itinerary_items_cost" CHECK ("est_cost_per_person" IS NULL OR "est_cost_per_person" >= 0), CONSTRAINT "chk_itinerary_items_duration" CHECK ("duration_minutes" IS NULL OR "duration_minutes" > 0), CONSTRAINT "chk_itinerary_items_day" CHECK ("day_index" >= 1), CONSTRAINT "PK_f37a39ff959ce329ccbb0d98e24" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_itinerary_items_order" ON "itinerary_items"  ("trip_id", "day_index", "position") `,
    );
    await queryRunner.query(
      `CREATE TABLE "packing_items" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "trip_id" uuid NOT NULL, "title" character varying(200) NOT NULL, "assignee_member_id" uuid, "is_packed" boolean NOT NULL DEFAULT false, "position" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_8d4b004c4edf13f2320883926dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_packing_items_trip" ON "packing_items"  ("trip_id", "position") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."trip_status" AS ENUM('planning', 'finalized', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "trips" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(200) NOT NULL, "destination_id" uuid, "start_date" date, "days_count" smallint NOT NULL, "budget_per_person" bigint, "currency" character(3) NOT NULL DEFAULT 'VND', "status" "public"."trip_status" NOT NULL DEFAULT 'planning', "finalized_at" TIMESTAMP WITH TIME ZONE, "source_template_id" uuid, "source_trip_id" uuid, CONSTRAINT "chk_trips_finalized" CHECK ("status" <> 'finalized' OR "finalized_at" IS NOT NULL), CONSTRAINT "chk_trips_single_source" CHECK ("source_template_id" IS NULL OR "source_trip_id" IS NULL), CONSTRAINT "chk_trips_budget" CHECK ("budget_per_person" IS NULL OR "budget_per_person" >= 0), CONSTRAINT "chk_trips_days" CHECK ("days_count" BETWEEN 1 AND 30), CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."trip_member_role" AS ENUM('owner', 'member')`,
    );
    await queryRunner.query(
      `CREATE TABLE "trip_members" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "trip_id" uuid NOT NULL, "user_id" uuid, "display_name" character varying(100) NOT NULL, "role" "public"."trip_member_role" NOT NULL DEFAULT 'member', "joined_at" TIMESTAMP WITH TIME ZONE, "removed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "chk_trip_members_owner_has_user" CHECK ("role" <> 'owner' OR "user_id" IS NOT NULL), CONSTRAINT "PK_d0368bd704fcb6883af326d8285" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_trip_members_user" ON "trip_members"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_trip_members_trip" ON "trip_members"  ("trip_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_trip_members_one_owner" ON "trip_members"  ("trip_id") WHERE "role" = 'owner'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_trip_members_trip_user" ON "trip_members"  ("trip_id", "user_id") WHERE "user_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "expense_shares" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "expense_id" uuid NOT NULL, "member_id" uuid NOT NULL, "amount" bigint NOT NULL, CONSTRAINT "chk_expense_shares_amount" CHECK ("amount" >= 0), CONSTRAINT "PK_6797467a312af7a82082f86dc91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_expense_shares_member" ON "expense_shares"  ("member_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_expense_shares_expense_member" ON "expense_shares"  ("expense_id", "member_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expense_category" AS ENUM('food', 'lodging', 'transport', 'activity', 'shopping', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."split_method" AS ENUM('equal', 'exact')`,
    );
    await queryRunner.query(
      `CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "trip_id" uuid NOT NULL, "paid_by_member_id" uuid NOT NULL, "title" character varying(200) NOT NULL, "amount" bigint NOT NULL, "currency" character(3) NOT NULL DEFAULT 'VND', "category" "public"."expense_category" NOT NULL DEFAULT 'other', "split_method" "public"."split_method" NOT NULL DEFAULT 'equal', "spent_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "note" text, "created_by_member_id" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "chk_expenses_amount" CHECK ("amount" > 0), CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_expenses_trip_spent" ON "expenses"  ("trip_id", "spent_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "settlements" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "trip_id" uuid NOT NULL, "from_member_id" uuid NOT NULL, "to_member_id" uuid NOT NULL, "amount" bigint NOT NULL, "settled_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "note" text, "created_by_member_id" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "chk_settlements_parties" CHECK ("from_member_id" <> "to_member_id"), CONSTRAINT "chk_settlements_amount" CHECK ("amount" > 0), CONSTRAINT "PK_5f523ce152b84e818bff9467aab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_settlements_trip" ON "settlements"  ("trip_id", "settled_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "holiday_periods" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "starts_on" date NOT NULL, "ends_on" date NOT NULL, "surcharge_percent_min" smallint, "surcharge_percent_max" smallint, "note" text, "source_url" text, CONSTRAINT "chk_holiday_periods_surcharge" CHECK ("surcharge_percent_min" IS NULL OR "surcharge_percent_max" IS NULL OR "surcharge_percent_min" <= "surcharge_percent_max"), CONSTRAINT "chk_holiday_periods_range" CHECK ("ends_on" >= "starts_on"), CONSTRAINT "PK_5cd694afcce876f0fe0a19cb16f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_holiday_periods_range" ON "holiday_periods"  ("starts_on", "ends_on") `,
    );
    await queryRunner.query(
      `CREATE TABLE "itinerary_item_comments" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "item_id" uuid NOT NULL, "member_id" uuid NOT NULL, "body" text NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "chk_itinerary_item_comments_body" CHECK (length(btrim("body")) > 0), CONSTRAINT "PK_c4b8e730bc292fd52ad3c389699" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_itinerary_item_comments_item" ON "itinerary_item_comments"  ("item_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "itinerary_item_votes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "item_id" uuid NOT NULL, "member_id" uuid NOT NULL, "value" smallint NOT NULL, CONSTRAINT "chk_itinerary_item_votes_value" CHECK ("value" IN (-1, 1)), CONSTRAINT "PK_545f2a8990313e0b1b401cb0086" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_itinerary_item_votes_item_member" ON "itinerary_item_votes"  ("item_id", "member_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "trip_invites" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "trip_id" uuid NOT NULL, "token" character varying(64) NOT NULL, "created_by_member_id" uuid, "expires_at" TIMESTAMP WITH TIME ZONE, "revoked_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_7a8a34aedfbdf000d13616ad1b6" UNIQUE ("token"), CONSTRAINT "PK_68cd0fc607010211aea94ff8641" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_trip_invites_trip" ON "trip_invites"  ("trip_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "place_opening_hours" ADD CONSTRAINT "FK_e9ae6016cf7072f669ba2a5cf8c" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "places" ADD CONSTRAINT "FK_94bc707c40954df872b02dcd727" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_template_items" ADD CONSTRAINT "FK_ccc76368d74ab7fee538c8781ca" FOREIGN KEY ("template_id") REFERENCES "itinerary_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_template_items" ADD CONSTRAINT "FK_6d7707401e9543765eb3c951fcd" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_templates" ADD CONSTRAINT "FK_c24f0e67a7bfa6236af79501bea" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_templates" ADD CONSTRAINT "FK_725c8dc844859964e347ae0df45" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_items" ADD CONSTRAINT "FK_01b015337d117861e6aec9784e5" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_items" ADD CONSTRAINT "FK_16f91039dbf805dd91dfefc0e92" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_items" ADD CONSTRAINT "FK_e2acd470a3a682d9d7dfa80defb" FOREIGN KEY ("source_template_item_id") REFERENCES "itinerary_template_items"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_items" ADD CONSTRAINT "FK_6d7d5f7d21bca2c15602cc9649b" FOREIGN KEY ("created_by_member_id") REFERENCES "trip_members"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "packing_items" ADD CONSTRAINT "FK_b0ecfdf828645da879147cff9ec" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "packing_items" ADD CONSTRAINT "FK_8230a6c15e89f54d944a3d2094a" FOREIGN KEY ("assignee_member_id") REFERENCES "trip_members"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" ADD CONSTRAINT "FK_a1a75a97ae7388c662bc76bb621" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" ADD CONSTRAINT "FK_9f307f9823ad269c2d3e4ca3554" FOREIGN KEY ("source_template_id") REFERENCES "itinerary_templates"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" ADD CONSTRAINT "FK_d4cd355133cd0d8640dab78ff33" FOREIGN KEY ("source_trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_members" ADD CONSTRAINT "FK_2bc25d7b7dd3984a649d49bb9a7" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_members" ADD CONSTRAINT "FK_f5221f69b9fa76f6ac5396f030d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense_shares" ADD CONSTRAINT "FK_07f2ba1f3ce16fa4bf7cb10231e" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense_shares" ADD CONSTRAINT "FK_e5ade6f521d8eed1727f49808c4" FOREIGN KEY ("member_id") REFERENCES "trip_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_bf6ee0000d1ba3f09285986e14e" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_f42b9705d932fe502e3cedafca5" FOREIGN KEY ("paid_by_member_id") REFERENCES "trip_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_0c4196887e02d9191e6e750d72b" FOREIGN KEY ("created_by_member_id") REFERENCES "trip_members"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "settlements" ADD CONSTRAINT "FK_3f869d17db9f16ed7074d038d1f" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "settlements" ADD CONSTRAINT "FK_4f7a06d2a2dc519eddb8e1fed61" FOREIGN KEY ("from_member_id") REFERENCES "trip_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`,
    );
    await queryRunner.query(
      `ALTER TABLE "settlements" ADD CONSTRAINT "FK_89e9568c9b534e7bf6c616c626f" FOREIGN KEY ("to_member_id") REFERENCES "trip_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`,
    );
    await queryRunner.query(
      `ALTER TABLE "settlements" ADD CONSTRAINT "FK_74e413c2a925259ac5e9cdf5cc1" FOREIGN KEY ("created_by_member_id") REFERENCES "trip_members"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_item_comments" ADD CONSTRAINT "FK_e81f2fbd867164d1790b5187074" FOREIGN KEY ("item_id") REFERENCES "itinerary_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_item_comments" ADD CONSTRAINT "FK_f8bae7e61902220744511034f1e" FOREIGN KEY ("member_id") REFERENCES "trip_members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_item_votes" ADD CONSTRAINT "FK_113545011a2b276db0b08c17a14" FOREIGN KEY ("item_id") REFERENCES "itinerary_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_item_votes" ADD CONSTRAINT "FK_677124305705b73c80c45c2f649" FOREIGN KEY ("member_id") REFERENCES "trip_members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_invites" ADD CONSTRAINT "FK_2f16ca5ca3b0d5390b72253a5fe" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_invites" ADD CONSTRAINT "FK_b5014e474b2d43bdc9e334ba720" FOREIGN KEY ("created_by_member_id") REFERENCES "trip_members"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trip_invites" DROP CONSTRAINT "FK_b5014e474b2d43bdc9e334ba720"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_invites" DROP CONSTRAINT "FK_2f16ca5ca3b0d5390b72253a5fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_item_votes" DROP CONSTRAINT "FK_677124305705b73c80c45c2f649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_item_votes" DROP CONSTRAINT "FK_113545011a2b276db0b08c17a14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_item_comments" DROP CONSTRAINT "FK_f8bae7e61902220744511034f1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_item_comments" DROP CONSTRAINT "FK_e81f2fbd867164d1790b5187074"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settlements" DROP CONSTRAINT "FK_74e413c2a925259ac5e9cdf5cc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settlements" DROP CONSTRAINT "FK_89e9568c9b534e7bf6c616c626f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settlements" DROP CONSTRAINT "FK_4f7a06d2a2dc519eddb8e1fed61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settlements" DROP CONSTRAINT "FK_3f869d17db9f16ed7074d038d1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_0c4196887e02d9191e6e750d72b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_f42b9705d932fe502e3cedafca5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_bf6ee0000d1ba3f09285986e14e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense_shares" DROP CONSTRAINT "FK_e5ade6f521d8eed1727f49808c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense_shares" DROP CONSTRAINT "FK_07f2ba1f3ce16fa4bf7cb10231e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_members" DROP CONSTRAINT "FK_f5221f69b9fa76f6ac5396f030d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_members" DROP CONSTRAINT "FK_2bc25d7b7dd3984a649d49bb9a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" DROP CONSTRAINT "FK_d4cd355133cd0d8640dab78ff33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" DROP CONSTRAINT "FK_9f307f9823ad269c2d3e4ca3554"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trips" DROP CONSTRAINT "FK_a1a75a97ae7388c662bc76bb621"`,
    );
    await queryRunner.query(
      `ALTER TABLE "packing_items" DROP CONSTRAINT "FK_8230a6c15e89f54d944a3d2094a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "packing_items" DROP CONSTRAINT "FK_b0ecfdf828645da879147cff9ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_items" DROP CONSTRAINT "FK_6d7d5f7d21bca2c15602cc9649b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_items" DROP CONSTRAINT "FK_e2acd470a3a682d9d7dfa80defb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_items" DROP CONSTRAINT "FK_16f91039dbf805dd91dfefc0e92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_items" DROP CONSTRAINT "FK_01b015337d117861e6aec9784e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_templates" DROP CONSTRAINT "FK_725c8dc844859964e347ae0df45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_templates" DROP CONSTRAINT "FK_c24f0e67a7bfa6236af79501bea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_template_items" DROP CONSTRAINT "FK_6d7707401e9543765eb3c951fcd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_template_items" DROP CONSTRAINT "FK_ccc76368d74ab7fee538c8781ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "places" DROP CONSTRAINT "FK_94bc707c40954df872b02dcd727"`,
    );
    await queryRunner.query(
      `ALTER TABLE "place_opening_hours" DROP CONSTRAINT "FK_e9ae6016cf7072f669ba2a5cf8c"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_trip_invites_trip"`);
    await queryRunner.query(`DROP TABLE "trip_invites"`);
    await queryRunner.query(
      `DROP INDEX "public"."uq_itinerary_item_votes_item_member"`,
    );
    await queryRunner.query(`DROP TABLE "itinerary_item_votes"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_itinerary_item_comments_item"`,
    );
    await queryRunner.query(`DROP TABLE "itinerary_item_comments"`);
    await queryRunner.query(`DROP INDEX "public"."idx_holiday_periods_range"`);
    await queryRunner.query(`DROP TABLE "holiday_periods"`);
    await queryRunner.query(`DROP INDEX "public"."idx_settlements_trip"`);
    await queryRunner.query(`DROP TABLE "settlements"`);
    await queryRunner.query(`DROP INDEX "public"."idx_expenses_trip_spent"`);
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(`DROP TYPE "public"."split_method"`);
    await queryRunner.query(`DROP TYPE "public"."expense_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."uq_expense_shares_expense_member"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_expense_shares_member"`);
    await queryRunner.query(`DROP TABLE "expense_shares"`);
    await queryRunner.query(`DROP INDEX "public"."uq_trip_members_trip_user"`);
    await queryRunner.query(`DROP INDEX "public"."uq_trip_members_one_owner"`);
    await queryRunner.query(`DROP INDEX "public"."idx_trip_members_trip"`);
    await queryRunner.query(`DROP INDEX "public"."idx_trip_members_user"`);
    await queryRunner.query(`DROP TABLE "trip_members"`);
    await queryRunner.query(`DROP TYPE "public"."trip_member_role"`);
    await queryRunner.query(`DROP TABLE "trips"`);
    await queryRunner.query(`DROP TYPE "public"."trip_status"`);
    await queryRunner.query(`DROP INDEX "public"."idx_packing_items_trip"`);
    await queryRunner.query(`DROP TABLE "packing_items"`);
    await queryRunner.query(`DROP INDEX "public"."idx_itinerary_items_order"`);
    await queryRunner.query(`DROP TABLE "itinerary_items"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_itinerary_templates_published"`,
    );
    await queryRunner.query(`DROP TABLE "itinerary_templates"`);
    await queryRunner.query(`DROP TYPE "public"."template_status"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_itinerary_template_items_order"`,
    );
    await queryRunner.query(`DROP TABLE "itinerary_template_items"`);
    await queryRunner.query(`DROP TABLE "destinations"`);
    await queryRunner.query(`DROP TYPE "public"."region"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_places_destination_kind"`,
    );
    await queryRunner.query(`DROP TABLE "places"`);
    await queryRunner.query(`DROP TYPE "public"."place_kind"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_place_opening_hours_place_weekday"`,
    );
    await queryRunner.query(`DROP TABLE "place_opening_hours"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."user_role"`);
  }
}
