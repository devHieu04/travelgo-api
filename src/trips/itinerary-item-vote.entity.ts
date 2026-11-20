import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';
import { ItineraryItem } from './itinerary-item.entity.js';
import { TripMember } from './trip-member.entity.js';

/**
 * Bình chọn một điểm trong lịch trình (backlog #5): 1 = đồng ý, -1 = không thích.
 * Mỗi thành viên một phiếu cho mỗi điểm; đổi ý thì cập nhật `value`.
 */
@Entity('itinerary_item_votes')
@Index('uq_itinerary_item_votes_item_member', ['itemId', 'memberId'], {
  unique: true,
})
@Check('chk_itinerary_item_votes_value', `"value" IN (-1, 1)`)
export class ItineraryItemVote extends BaseRecord {
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

  @Column({ type: 'smallint' })
  value!: number;
}
