import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_histories' })
@Index(['productId', 'platform', 'recordedAt'])
export class ProductHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  productId: string;

  @Column({ type: 'varchar', length: 255 })
  platform: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  normalPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalPrice?: number;

  @Column({ type: 'int', nullable: true })
  stock?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coupon?: number;

  @Column({ type: 'int', nullable: true })
  reviewCount?: number;

  @Column({ type: 'int', nullable: true })
  saleRate?: number;

  @CreateDateColumn({ type: 'timestamp' })
  recordedAt: Date;

  @ManyToOne(() => Product, (product) => product.histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'productId', referencedColumnName: 'productId' },
    { name: 'platform', referencedColumnName: 'platform' },
  ])
  product?: Product;
}
