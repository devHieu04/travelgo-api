import { Column, Entity, OneToMany, type Relation } from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';
import { Region } from '../database/enums.js';
import { Place } from './place.entity.js';

/** Điểm đến (Đà Lạt, Hội An…). Lịch trình mẫu và chuyến đi gắn với đây. */
@Entity('destinations')
export class Destination extends BaseRecord {
  @Column({ type: 'varchar', length: 80, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'enum', enum: Region, enumName: 'region' })
  region!: Region;

  @Column({ type: 'varchar', length: 80 })
  province!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  coverImageUrl!: string | null;

  @Column({ type: 'double precision', nullable: true })
  latitude!: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude!: number | null;

  @OneToMany(() => Place, (place) => place.destination)
  places!: Relation<Place[]>;
}
