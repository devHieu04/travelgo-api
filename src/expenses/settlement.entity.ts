import {
  Check,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';
import { MEMBER_MONEY_FK } from '../database/relation-options.js';
import { moneyTransformer } from '../database/transformers.js';
import { TripMember } from '../trips/trip-member.entity.js';
import { Trip } from '../trips/trip.entity.js';

/**
 * Một lần chuyển khoản trả nợ giữa hai thành viên (backlog #3).
 * Số dư mỗi người = đã trả − phần phải chịu ± các lần chuyển khoản;
 * số dư và gợi ý "ít lần chuyển khoản nhất" được tính, không lưu.
 */
@Entity('settlements')
@Index('idx_settlements_trip', ['tripId', 'settledAt'])
@Check('chk_settlements_amount', `"amount" > 0`)
@Check('chk_settlements_parties', `"from_member_id" <> "to_member_id"`)
export class Settlement extends BaseRecord {
  @Column({ type: 'uuid' })
  tripId!: string;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip!: Relation<Trip>;

  @Column({ type: 'uuid' })
  fromMemberId!: string;

  @ManyToOne(() => TripMember, MEMBER_MONEY_FK)
  @JoinColumn()
  fromMember!: Relation<TripMember>;

  @Column({ type: 'uuid' })
  toMemberId!: string;

  @ManyToOne(() => TripMember, MEMBER_MONEY_FK)
  @JoinColumn()
  toMember!: Relation<TripMember>;

  /** Theo đồng. */
  @Column({ type: 'bigint', transformer: moneyTransformer })
  amount!: number;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  settledAt!: Date;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ type: 'uuid', nullable: true })
  createdByMemberId!: string | null;

  @ManyToOne(() => TripMember, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  createdByMember!: Relation<TripMember> | null;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
