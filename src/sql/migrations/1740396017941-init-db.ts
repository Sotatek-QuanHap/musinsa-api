import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1740396017941 implements MigrationInterface {
    name = 'InitDb1740396017941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" character varying(255) NOT NULL, "platform" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "url" character varying(1024), "level" integer, "parentCategoryId" character varying(255), "parentPlatform" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_4e05367580fa602a7fc73ed48b8" PRIMARY KEY ("id", "platform"))`);
        await queryRunner.query(`CREATE INDEX "idx_parent_category" ON "categories" ("parentCategoryId") `);
        await queryRunner.query(`CREATE TYPE "public"."products_mappedstatus_enum" AS ENUM('Mapped', 'UnMapped')`);
        await queryRunner.query(`CREATE TABLE "products" ("productId" character varying(255) NOT NULL, "platform" character varying(255) NOT NULL, "sku" character varying(255), "productName" character varying(255), "url" character varying(1024), "categoryId" character varying(255), "categoryName" character varying(255), "brandName" character varying(255), "sellerName" character varying(255), "normalPrice" numeric(10,2), "salePrice" numeric(10,2), "finalPrice" numeric(10,2), "saleRate" integer, "mappedStatus" "public"."products_mappedstatus_enum" NOT NULL DEFAULT 'UnMapped', "coupon" integer, "reviewCount" integer, "stock" integer, "saleInfo" character varying(1024), "extraInfo" json, "extraImages" jsonb NOT NULL DEFAULT '[]', "options" jsonb NOT NULL DEFAULT '[]', "image" character varying(1024), "soldOut" boolean NOT NULL DEFAULT false, "raw" text, "extraCategory" jsonb NOT NULL DEFAULT '[]', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_defe7457134183937a660116b92" PRIMARY KEY ("productId", "platform"))`);
        await queryRunner.query(`CREATE INDEX "idx_category" ON "products" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "product_histories" ("id" SERIAL NOT NULL, "productId" character varying(255) NOT NULL, "platform" character varying(255) NOT NULL, "normalPrice" numeric(10,2), "salePrice" numeric(10,2), "finalPrice" numeric(10,2), "stock" integer, "coupon" numeric(10,2), "reviewCount" integer, "saleRate" integer, "recordedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_044c5e6c6e913fcc761b2bfc914" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6d835cc51447e2d7c672bd21e3" ON "product_histories" ("productId", "platform", "recordedAt") `);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_e447029e347540135ed31c5ec27" FOREIGN KEY ("parentCategoryId", "parentPlatform") REFERENCES "categories"("id","platform") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_f2e022d682b3a7b1e80488fa5ee" FOREIGN KEY ("categoryId", "platform") REFERENCES "categories"("id","platform") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_histories" ADD CONSTRAINT "FK_19010528aa9e8b4fb411aa7de99" FOREIGN KEY ("productId", "platform") REFERENCES "products"("productId","platform") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_histories" DROP CONSTRAINT "FK_19010528aa9e8b4fb411aa7de99"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_f2e022d682b3a7b1e80488fa5ee"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_e447029e347540135ed31c5ec27"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d835cc51447e2d7c672bd21e3"`);
        await queryRunner.query(`DROP TABLE "product_histories"`);
        await queryRunner.query(`DROP INDEX "public"."idx_category"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_mappedstatus_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_parent_category"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }


}
