import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';
import { PlaceKind } from '../database/enums.js';
import { moneyTransformer } from '../database/transformers.js';
import { Destination } from './destination.entity.js';
import { PlaceOpeningHour } from './place-opening-hour.entity.js';

/**
 * Một điểm có thể thêm vào lịch trình: điểm tham quan, quán ăn, quán cà phê,
 * chỗ ở. Toạ độ, giờ mở cửa, giá và thời lượng là đầu vào cho gợi ý theo
 * quy tắc cố định (khoảng cách, giờ mở cửa, ngân sách).
 */
@Entity('places')
@Index('idx_places_destination_kind', ['destinationId', 'kind'])
@Check(
  'chk_places_price_range',
  `"price_min" IS NULL OR "price_max" IS NULL OR "price_min" <= "price_max"`,
)
@Check(
  'chk_places_duration',
  `"typical_duration_minutes" IS NULL OR "typical_duration_minutes" > 0`,
)
export class Place extends BaseRecord {
  @Column({ type: 'uuid' })
  destinationId!: string;

  @ManyToOne(() => Destination, (destination) => destination.places, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  destination!: Relation<Destination>;

  @Column({ type: 'enum', enum: PlaceKind, enumName: 'place_kind' })
  kind!: PlaceKind;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  address!: string | null;

  @Column({ type: 'double precision', nullable: true })
  latitude!: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude!: number | null;

  /** Giá tham khảo mỗi người, theo đồng. */
  @Column({ type: 'bigint', nullable: true, transformer: moneyTransformer })
  priceMin!: number | null;

  @Column({ type: 'bigint', nullable: true, transformer: moneyTransformer })
  priceMax!: number | null;

  /** Thời gian ở lại thường gặp, dùng để xếp giờ trong lịch trình. */
  @Column({ type: 'smallint', nullable: true })
  typicalDurationMinutes!: number | null;

  @Column({ type: 'text', nullable: true })
  imageUrl!: string | null;

  /** Nơi lấy dữ liệu (Google Maps, fanpage, khảo sát thực địa…). */
  @Column({ type: 'text', nullable: true })
  sourceUrl!: string | null;

  /** Lần cuối team kiểm tra lại giá, giờ mở cửa (giả định a10). */
  @Column({ type: 'timestamptz', nullable: true })
  dataVerifiedAt!: Date | null;

  @OneToMany(() => PlaceOpeningHour, (hour) => hour.place)
  openingHours!: Relation<PlaceOpeningHour[]>;
}
