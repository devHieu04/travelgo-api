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
import { TripMemberRole } from '../database/enums.js';
import { User } from '../users/user.entity.js';
import { Trip } from './trip.entity.js';

/**
 * Thành viên của chuyến. `user_id` để trống nghĩa là người gánh team đã thêm
 * tên bạn để chia tiền nhưng bạn đó chưa vào app; khi bạn mở link mời và
 * đăng nhập, dòng này được gắn `user_id` thay vì tạo dòng mới.
 *
 * Chi tiêu, bình chọn, bình luận đều trỏ tới `trip_members` chứ không trỏ
 * thẳng tới `users`, để chia tiền được cả cho người chưa có tài khoản.
 * Rời chuyến thì đặt `removed_at`, không xoá, để giữ lịch sử chi tiêu.
 */
@Entity('trip_members')
@Index('uq_trip_members_trip_user', ['tripId', 'userId'], {
  unique: true,
  where: `"user_id" IS NOT NULL`,
})
@Index('uq_trip_members_one_owner', ['tripId'], {
  unique: true,
  where: `"role" = 'owner'`,
})
@Index('idx_trip_members_trip', ['tripId'])
@Index('idx_trip_members_user', ['userId'])
@Check(
  'chk_trip_members_owner_has_user',
  `"role" <> 'owner' OR "user_id" IS NOT NULL`,
)
export class TripMember extends BaseRecord {
  @Column({ type: 'uuid' })
  tripId!: string;

  @ManyToOne(() => Trip, (trip) => trip.members, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip!: Relation<Trip>;

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  user!: Relation<User> | null;

  /** Tên hiển thị trong chuyến (có thể khác tên tài khoản, ví dụ "Linh béo"). */
  @Column({ type: 'varchar', length: 100 })
  displayName!: string;

  @Column({
    type: 'enum',
    enum: TripMemberRole,
    enumName: 'trip_member_role',
    default: TripMemberRole.Member,
  })
  role!: TripMemberRole;

  /** Lúc người này vào chuyến bằng tài khoản; trống nếu chỉ là tên do người khác thêm. */
  @Column({ type: 'timestamptz', nullable: true })
  joinedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  removedAt!: Date | null;
}
