import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Place } from './place.entity.js';

/**
 * Một khung giờ mở cửa trong một ngày. Một ngày có thể có nhiều khung
 * (nghỉ trưa). Không có dòng nào cho một ngày nghĩa là chưa biết giờ.
 * `closes_at <= opens_at` nghĩa là đóng cửa sau nửa đêm; 00:00–00:00 là mở 24 giờ.
 */
@Entity('place_opening_hours')
@Index('idx_place_opening_hours_place_weekday', ['placeId', 'weekday'])
@Check('chk_place_opening_hours_weekday', `"weekday" BETWEEN 1 AND 7`)
export class PlaceOpeningHour {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  placeId!: string;

  @ManyToOne(() => Place, (place) => place.openingHours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  place!: Relation<Place>;

  /** ISO: 1 = thứ Hai … 7 = Chủ nhật. */
  @Column({ type: 'smallint' })
  weekday!: number;

  @Column({ type: 'time' })
  opensAt!: string;

  @Column({ type: 'time' })
  closesAt!: string;
}
