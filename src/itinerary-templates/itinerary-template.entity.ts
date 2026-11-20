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
import { TemplateStatus } from '../database/enums.js';
import { moneyTransformer } from '../database/transformers.js';
import { Destination } from '../places/destination.entity.js';
import { User } from '../users/user.entity.js';
import { ItineraryTemplateItem } from './itinerary-template-item.entity.js';

/**
 * Lịch trình mẫu do team biên soạn theo điểm đến và số ngày (backlog #4,
 * giả định a2). Người dùng chọn mẫu thì chuyến nhận một bản sao riêng;
 * sửa chuyến không đổi mẫu gốc.
 */
@Entity('itinerary_templates')
@Index('idx_itinerary_templates_published', ['destinationId', 'daysCount'], {
  where: `"status" = 'published'`,
})
@Check('chk_itinerary_templates_days', `"days_count" BETWEEN 1 AND 30`)
export class ItineraryTemplate extends BaseRecord {
  @Column({ type: 'uuid' })
  destinationId!: string;

  @ManyToOne(() => Destination, { onDelete: 'RESTRICT' })
  @JoinColumn()
  destination!: Relation<Destination>;

  @Column({ type: 'varchar', length: 120, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'smallint' })
  daysCount!: number;

  @Column({ type: 'text', nullable: true })
  summary!: string | null;

  /** Chi phí ước tính mỗi người cho cả mẫu, theo đồng. */
  @Column({ type: 'bigint', nullable: true, transformer: moneyTransformer })
  estCostPerPerson!: number | null;

  @Column({
    type: 'enum',
    enum: TemplateStatus,
    enumName: 'template_status',
    default: TemplateStatus.Draft,
  })
  status!: TemplateStatus;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt!: Date | null;

  /** "Ngày cập nhật" hiển thị cho người dùng: lần cuối team rà lại nội dung mẫu. */
  @Column({ type: 'timestamptz', nullable: true })
  lastReviewedAt!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  createdById!: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  createdBy!: Relation<User> | null;

  @OneToMany(() => ItineraryTemplateItem, (item) => item.template)
  items!: Relation<ItineraryTemplateItem[]>;
}
