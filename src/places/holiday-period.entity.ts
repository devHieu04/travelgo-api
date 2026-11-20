import { Check, Column, Entity, Index } from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';

/**
 * Dịp lễ theo từng năm (Tết, 30/4–1/5, 2/9…) kèm mức tăng giá tham khảo.
 * Dùng cho cảnh báo ngân sách khi chuyến đi rơi vào dịp lễ (backlog #6).
 * Tết đổi ngày mỗi năm nên mỗi năm là một dòng.
 */
@Entity('holiday_periods')
@Index('idx_holiday_periods_range', ['startsOn', 'endsOn'])
@Check('chk_holiday_periods_range', `"ends_on" >= "starts_on"`)
@Check(
  'chk_holiday_periods_surcharge',
  `"surcharge_percent_min" IS NULL OR "surcharge_percent_max" IS NULL OR "surcharge_percent_min" <= "surcharge_percent_max"`,
)
export class HolidayPeriod extends BaseRecord {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'date' })
  startsOn!: string;

  @Column({ type: 'date' })
  endsOn!: string;

  /** Ví dụ phòng tăng 2–3 lần thì min = 100, max = 200. */
  @Column({ type: 'smallint', nullable: true })
  surchargePercentMin!: number | null;

  @Column({ type: 'smallint', nullable: true })
  surchargePercentMax!: number | null;

  /** Mô tả hiển thị cho người dùng, ví dụ "phòng tăng 2–3 lần; tour phụ thu 20–25%". */
  @Column({ type: 'text', nullable: true })
  note!: string | null;

  /** Nguồn của mức tăng tham khảo (bắt buộc hiển thị kèm). */
  @Column({ type: 'text', nullable: true })
  sourceUrl!: string | null;
}
