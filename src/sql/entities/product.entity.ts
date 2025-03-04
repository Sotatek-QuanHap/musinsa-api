import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductHistory } from './product_history.entity';

type MappedStatus = 'UnMapped' | 'Mapped';

@Entity({ name: 'products' })
@Index('idx_category', ['categoryId'])
export class Product extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  productId: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  platform: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  productName?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  url?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoryId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoryName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brandName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sellerName?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  normalPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalPrice?: number;

  @Column({ type: 'int', nullable: true })
  saleRate?: number;

  @Column({
    type: 'enum',
    enum: ['Mapped', 'UnMapped'],
    default: 'UnMapped',
  })
  mappedStatus: MappedStatus;

  @Column({ type: 'int', nullable: true })
  coupon?: number;

  @Column({ type: 'int', nullable: true })
  reviewCount?: number;

  @Column({ type: 'int', nullable: true })
  stock?: number;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  saleInfo?: string;

  @Column({ type: 'json', nullable: true })
  extraInfo?: Record<string, any>;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: () => "'[]'",
  })
  extraImages?: Array<string>;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: () => "'[]'",
  })
  options?: Array<{ option: string; image: string }>;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  image?: string;

  @Column({ type: 'boolean', default: false })
  soldOut: boolean;

  @Column({ type: 'text', nullable: true })
  raw?: string;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: () => "'[]'",
  })
  extraCategory?: Array<{ id: string; level: number; title: string }>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'categoryId', referencedColumnName: 'id' },
    { name: 'platform', referencedColumnName: 'platform' },
  ])
  category?: Category;

  @OneToMany(() => ProductHistory, (productHistory) => productHistory.id, {
    nullable: true,
  })
  histories?: ProductHistory[];
}
