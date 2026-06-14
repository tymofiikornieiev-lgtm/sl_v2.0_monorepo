import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableDealerIdOnCurrentPrices1780254279863 implements MigrationInterface {
  name = 'NullableDealerIdOnCurrentPrices1780254279863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "current_prices" DROP CONSTRAINT "FK_973098a2752c5a037c38ed3dccc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" ALTER COLUMN "dealer_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" ADD CONSTRAINT "FK_973098a2752c5a037c38ed3dccc" FOREIGN KEY ("dealer_id") REFERENCES "dealers"("id") ON DELETE SET NULL ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "current_prices" DROP CONSTRAINT "FK_973098a2752c5a037c38ed3dccc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" ALTER COLUMN "dealer_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "current_prices" ADD CONSTRAINT "FK_973098a2752c5a037c38ed3dccc" FOREIGN KEY ("dealer_id") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }
}
