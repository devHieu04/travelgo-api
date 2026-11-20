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
import { ItineraryItem } from './itinerary-item.entity.js';
import { TripMember } from './trip-member.entity.js';

/** Góp ý cho một điểm trong lịch trình, để khỏi phải nhắn riêng (backlog #5). */
@Entity('itinerary_item_comments')
@Index('idx_itinerary_item_comments_item', ['itemId', 'createdAt'])
@Check('chk_itinerary_item_comments_body', `length(btrim("body")) > 0`)
export class ItineraryItemComment extends BaseRecord {
  @Column({ type: 'uuid' })
  itemId!: string;

  @ManyToOne(() => ItineraryItem, { onDelete: 'CASCADE' })
  @JoinColumn()
  item!: Relation<ItineraryItem>;

  @Column({ type: 'uuid' })
  memberId!: string;

  @ManyToOne(() => TripMember, { onDelete: 'CASCADE' })
  @JoinColumn()
  member!: Relation<TripMember>;

  @Column({ type: 'text' })
  body!: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
