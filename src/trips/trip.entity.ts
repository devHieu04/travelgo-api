import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';
import { TripStatus } from '../database/enums.js';
import { moneyTransformer } from '../database/transformers.js';
import { ItineraryTemplate } from '../itinerary-templates/itinerary-template.entity.js';
import { Destination } from '../places/destination.entity.js';
import { ItineraryItem } from './itinerary-item.entity.js';
import { PackingItem } from './packing-item.entity.js';
import { TripMember } from './trip-member.entity.js';

/**
 * Một chuyến đi của nhóm. Chủ chuyến là thành viên có `role = 'owner'`
 * trong `trip_members`, không lưu trùng ở đây.
 *
 * Lịch trình dùng `day_index` (ngày 1, 2, 3…) thay vì ngày cụ thể, nên khi
 * đổi `start_date` hoặc sao chép sang chuyến khác, các ngày tự dời theo.
 */
@Entity('trips')
@Check('chk_trips_days', `"days_count" BETWEEN 1 AND 30`)
@Check(
  'chk_trips_budget',
  `"budget_per_person" IS NULL OR "budget_per_person" >= 0`,
)
@Check(
  'chk_trips_single_source',
  `"source_template_id" IS NULL OR "source_trip_id" IS NULL`,
)
@Check(
  'chk_trips_finalized',
  `"status" <> 'finalized' OR "finalized_at" IS NOT NULL`,
)
export class Trip extends BaseRecord {
  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'uuid', nullable: true })
  destinationId!: string | null;

  @ManyToOne(() => Destination, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  destination!: Relation<Destination> | null;

  /** Có thể chưa chốt ngày khi mới lên ý tưởng. */
  @Column({ type: 'date', nullable: true })
  startDate!: string | null;

  @Column({ type: 'smallint' })
  daysCount!: number;

  /** Người dùng nghĩ ngân sách theo "mỗi người bao nhiêu", theo đồng. */
  @Column({ type: 'bigint', nullable: true, transformer: moneyTransformer })
  budgetPerPerson!: number | null;

  @Column({ type: 'char', length: 3, default: 'VND' })
  currency!: string;

  @Column({
    type: 'enum',
    enum: TripStatus,
    enumName: 'trip_status',
    default: TripStatus.Planning,
  })
  status!: TripStatus;

  /** Lúc chốt lịch trình; đo "thời gian từ tạo chuyến tới chốt lịch trình". */
  @Column({ type: 'timestamptz', nullable: true })
  finalizedAt!: Date | null;

  /** Chuyến tạo từ lịch trình mẫu nào (đo giả định a2). */
  @Column({ type: 'uuid', nullable: true })
  sourceTemplateId!: string | null;

  @ManyToOne(() => ItineraryTemplate, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  sourceTemplate!: Relation<ItineraryTemplate> | null;

  /** Chuyến sao chép từ chuyến nào (backlog #8). */
  @Column({ type: 'uuid', nullable: true })
  sourceTripId!: string | null;

  @ManyToOne(() => Trip, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  sourceTrip!: Relation<Trip> | null;

  @OneToMany(() => TripMember, (member) => member.trip)
  members!: Relation<TripMember[]>;

  @OneToMany(() => ItineraryItem, (item) => item.trip)
  itineraryItems!: Relation<ItineraryItem[]>;

  @OneToMany(() => PackingItem, (item) => item.trip)
  packingItems!: Relation<PackingItem[]>;
}
