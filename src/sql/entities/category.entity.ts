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
import { Product } from './product.entity';

@Entity({ name: 'categories' })
@Index('idx_parent_category', ['parentCategoryId'])
export class Category extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  platform: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  url?: string;

  @Column({ type: 'int', nullable: true })
  level?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  parentCategoryId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  parentPlatform?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([
    { name: 'parentCategoryId', referencedColumnName: 'id' },
    { name: 'parentPlatform', referencedColumnName: 'platform' },
  ])
  parentCategory?: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subcategories?: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];
}
