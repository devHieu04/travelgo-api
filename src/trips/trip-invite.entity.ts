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

/**
 * Link mời vào chuyến (backlog #1), gửi qua Zalo/Messenger.
 * Link mở được trên điện thoại chưa cài app; vào chuyến cần đăng nhập.
 * Thu hồi link bằng `revoked_at`.
 */
@Entity('trip_invites')
@Index('idx_trip_invites_trip', ['tripId'])
export class TripInvite extends BaseRecord {
  @Column({ type: 'uuid' })
  tripId!: string;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip!: Relation<Trip>;

  /** Chuỗi ngẫu nhiên đặt trong URL, không đoán được. */
  @Column({ type: 'varchar', length: 64, unique: true })
  token!: string;

  @Column({ type: 'uuid', nullable: true })
  createdByMemberId!: string | null;

  @ManyToOne(() => TripMember, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  createdByMember!: Relation<TripMember> | null;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;
}
