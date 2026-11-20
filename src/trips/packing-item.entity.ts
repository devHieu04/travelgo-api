import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';
import { TripMember } from './trip-member.entity.js';
import { Trip } from './trip.entity.js';

/** Danh sách đồ mang theo của chuyến (phần "đóng gói" trong Smart Trip Planner). */
@Entity('packing_items')
@Index('idx_packing_items_trip', ['tripId', 'position'])
export class PackingItem extends BaseRecord {
  @Column({ type: 'uuid' })
  tripId!: string;

  @ManyToOne(() => Trip, (trip) => trip.packingItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip!: Relation<Trip>;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  /** Ai mang món này; trống là đồ chung chưa phân công. */
  @Column({ type: 'uuid', nullable: true })
  assigneeMemberId!: string | null;

  @ManyToOne(() => TripMember, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  assigneeMember!: Relation<TripMember> | null;

  @Column({ type: 'boolean', default: false })
  isPacked!: boolean;

  @Column({ type: 'integer', default: 0 })
  position!: number;
}
