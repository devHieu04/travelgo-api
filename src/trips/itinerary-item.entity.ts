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
import { moneyTransformer } from '../database/transformers.js';
import { ItineraryTemplateItem } from '../itinerary-templates/itinerary-template-item.entity.js';
import { Place } from '../places/place.entity.js';
import { TripMember } from './trip-member.entity.js';
import { Trip } from './trip.entity.js';

/** Một điểm trong lịch trình của chuyến. */
@Entity('itinerary_items')
@Index('idx_itinerary_items_order', ['tripId', 'dayIndex', 'position'])
@Check('chk_itinerary_items_day', `"day_index" >= 1`)
@Check(
  'chk_itinerary_items_duration',
  `"duration_minutes" IS NULL OR "duration_minutes" > 0`,
)
@Check(
  'chk_itinerary_items_cost',
  `"est_cost_per_person" IS NULL OR "est_cost_per_person" >= 0`,
)
export class ItineraryItem extends BaseRecord {
  @Column({ type: 'uuid' })
  tripId!: string;

  @ManyToOne(() => Trip, (trip) => trip.itineraryItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip!: Relation<Trip>;

  /** Ngày thứ mấy của chuyến, bắt đầu từ 1; không vượt `trips.days_count` (kiểm ở service). */
  @Column({ type: 'smallint' })
  dayIndex!: number;

  /** Thứ tự trong ngày; đổi thứ tự thì cập nhật lại các số này. */
  @Column({ type: 'integer' })
  position!: number;

  @Column({ type: 'uuid', nullable: true })
  placeId!: string | null;

  @ManyToOne(() => Place, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  place!: Relation<Place> | null;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'time', nullable: true })
  startTime!: string | null;

  @Column({ type: 'smallint', nullable: true })
  durationMinutes!: number | null;

  /** Chi phí dự kiến mỗi người, theo đồng; cộng lại ra ngân sách dự kiến. */
  @Column({ type: 'bigint', nullable: true, transformer: moneyTransformer })
  estCostPerPerson!: number | null;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  /** Điểm này lấy từ mục nào của lịch trình mẫu; dùng để đếm điểm người dùng giữ / sửa / bỏ (a2). */
  @Column({ type: 'uuid', nullable: true })
  sourceTemplateItemId!: string | null;

  @ManyToOne(() => ItineraryTemplateItem, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  sourceTemplateItem!: Relation<ItineraryTemplateItem> | null;

  @Column({ type: 'uuid', nullable: true })
  createdByMemberId!: string | null;

  @ManyToOne(() => TripMember, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  createdByMember!: Relation<TripMember> | null;
}
