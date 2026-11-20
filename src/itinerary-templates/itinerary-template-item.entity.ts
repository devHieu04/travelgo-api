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
import { Place } from '../places/place.entity.js';
import { ItineraryTemplate } from './itinerary-template.entity.js';

/** Một điểm trong lịch trình mẫu, cùng cấu trúc với `itinerary_items` của chuyến. */
@Entity('itinerary_template_items')
@Index('idx_itinerary_template_items_order', [
  'templateId',
  'dayIndex',
  'position',
])
@Check('chk_itinerary_template_items_day', `"day_index" >= 1`)
@Check(
  'chk_itinerary_template_items_duration',
  `"duration_minutes" IS NULL OR "duration_minutes" > 0`,
)
export class ItineraryTemplateItem extends BaseRecord {
  @Column({ type: 'uuid' })
  templateId!: string;

  @ManyToOne(() => ItineraryTemplate, (template) => template.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  template!: Relation<ItineraryTemplate>;

  /** Ngày thứ mấy của chuyến, bắt đầu từ 1. */
  @Column({ type: 'smallint' })
  dayIndex!: number;

  @Column({ type: 'integer' })
  position!: number;

  @Column({ type: 'uuid', nullable: true })
  placeId!: string | null;

  @ManyToOne(() => Place, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  place!: Relation<Place> | null;

  /** Luôn có tiêu đề, kể cả khi gắn với một `place`, để mẫu không vỡ khi place bị xoá. */
  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'time', nullable: true })
  startTime!: string | null;

  @Column({ type: 'smallint', nullable: true })
  durationMinutes!: number | null;

  @Column({ type: 'bigint', nullable: true, transformer: moneyTransformer })
  estCostPerPerson!: number | null;

  @Column({ type: 'text', nullable: true })
  note!: string | null;
}
