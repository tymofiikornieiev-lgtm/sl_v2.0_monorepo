import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1780254279862 implements MigrationInterface {
  name = 'InitSchema1780254279862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "models" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "make_id" integer NOT NULL, CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_062b509656755dbcafa8afbef7" ON "models" ("make_id", "id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0bf1cd566eddf891d6e3175cb2" ON "models" ("make_id", "name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "makes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_daf82f2b6bffcb458f78c6bd964" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d59cb129eb7b945050392c649c" ON "makes" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ignition_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_a7c879b49dcf74557c4de8b283d" UNIQUE ("name"), CONSTRAINT "PK_1081cd6c0de946d2c0c70e7f7a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "key_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_c0821e8f2327e8d747ea9de4e02" UNIQUE ("name"), CONSTRAINT "PK_4da24dee77cba3749301634ace7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle_configurations" ("id" SERIAL NOT NULL, "year" smallint NOT NULL, "make_id" integer NOT NULL, "model_id" integer NOT NULL, "ignition_type_id" integer NOT NULL, "key_type_id" integer NOT NULL, "buttons_count" smallint NOT NULL, CONSTRAINT "PK_4cd4d9203d1a8a0470f641f9bc0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b769f5a4932ecee15662025c1a" ON "vehicle_configurations" ("year", "make_id", "model_id", "ignition_type_id", "key_type_id", "buttons_count") `,
    );
    await queryRunner.query(
      `CREATE TABLE "dealers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying, "address" text, CONSTRAINT "UQ_63a4c43e7a706d279cf1f911793" UNIQUE ("name"), CONSTRAINT "PK_4d0d8be9eac6e1822ad16d21194" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "current_prices" ("id" SERIAL NOT NULL, "vehicle_configuration_id" integer NOT NULL, "dealer_id" integer NOT NULL, "price_secure_locks_akl" numeric(10,2), "price_secure_locks_add_key" numeric(10,2), "price_secure_locks_program_only" numeric(10,2), "price_secure_locks_parts" numeric(10,2), "price_dealer_transmitter" numeric(10,2), "price_dealer_program" numeric(10,2), "price_dealer_blade" numeric(10,2), "vin" text, "part_number" text, "link" text, "comments" text, "date_called" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_user_id" integer NOT NULL, "updated_by_user_id" integer NOT NULL, CONSTRAINT "PK_5e70d5eee32af8c70c256c2e36f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_af07087b00f36546834311647b" ON "current_prices" ("vehicle_configuration_id", "dealer_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'manager', 'viewer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "password_hash" text NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'viewer', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "models" ADD CONSTRAINT "FK_d5ec5d397dc2d36135f61c16652" FOREIGN KEY ("make_id") REFERENCES "makes"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_configurations" ADD CONSTRAINT "FK_8c19ac83ddc2d15925f22662524" FOREIGN KEY ("make_id") REFERENCES "makes"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_configurations" ADD CONSTRAINT "FK_64ec3d9a38a8ec117757765df12" FOREIGN KEY ("make_id", "model_id") REFERENCES "models"("make_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_configurations" ADD CONSTRAINT "FK_2ced4090831566c4adb00f738d3" FOREIGN KEY ("ignition_type_id") REFERENCES "ignition_types"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_configurations" ADD CONSTRAINT "FK_3ab381ae7bea9d51de8e0457094" FOREIGN KEY ("key_type_id") REFERENCES "key_types"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" ADD CONSTRAINT "FK_278271744b997436399f3bd4cc4" FOREIGN KEY ("vehicle_configuration_id") REFERENCES "vehicle_configurations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" ADD CONSTRAINT "FK_973098a2752c5a037c38ed3dccc" FOREIGN KEY ("dealer_id") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" ADD CONSTRAINT "FK_45f60d3c98bfa2aef899b849696" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" ADD CONSTRAINT "FK_c60c10b0ca83d4e600e3d8a9f8b" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "current_prices" DROP CONSTRAINT "FK_c60c10b0ca83d4e600e3d8a9f8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" DROP CONSTRAINT "FK_45f60d3c98bfa2aef899b849696"`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" DROP CONSTRAINT "FK_973098a2752c5a037c38ed3dccc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" DROP CONSTRAINT "FK_278271744b997436399f3bd4cc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_configurations" DROP CONSTRAINT "FK_3ab381ae7bea9d51de8e0457094"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_configurations" DROP CONSTRAINT "FK_2ced4090831566c4adb00f738d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_configurations" DROP CONSTRAINT "FK_64ec3d9a38a8ec117757765df12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle_configurations" DROP CONSTRAINT "FK_8c19ac83ddc2d15925f22662524"`,
    );
    await queryRunner.query(
      `ALTER TABLE "models" DROP CONSTRAINT "FK_d5ec5d397dc2d36135f61c16652"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_af07087b00f36546834311647b"`,
    );
    await queryRunner.query(`DROP TABLE "current_prices"`);
    await queryRunner.query(`DROP TABLE "dealers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b769f5a4932ecee15662025c1a"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle_configurations"`);
    await queryRunner.query(`DROP TABLE "key_types"`);
    await queryRunner.query(`DROP TABLE "ignition_types"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d59cb129eb7b945050392c649c"`,
    );
    await queryRunner.query(`DROP TABLE "makes"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0bf1cd566eddf891d6e3175cb2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_062b509656755dbcafa8afbef7"`,
    );
    await queryRunner.query(`DROP TABLE "models"`);
  }
}
