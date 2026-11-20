import { Check, Column, Entity } from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';
import { UserRole } from '../database/enums.js';

/**
 * Tài khoản đăng nhập. Demo hiện đăng nhập bằng OTP số điện thoại nên
 * `phone` là định danh chính; `email` để dành cho cách đăng nhập khác.
 * Bảng OTP / phiên đăng nhập sẽ thêm ở PR auth.
 */
@Entity('users')
@Check('chk_users_contact', `"phone" IS NOT NULL OR "email" IS NOT NULL`)
export class User extends BaseRecord {
  @Column({ type: 'varchar', length: 100 })
  displayName!: string;

  /** Số điện thoại dạng E.164, ví dụ +84901234567. */
  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone!: string | null;

  /** Lưu chữ thường; ứng dụng chuẩn hoá trước khi ghi. */
  @Column({ type: 'varchar', length: 254, unique: true, nullable: true })
  email!: string | null;

  @Column({ type: 'text', nullable: true })
  avatarUrl!: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role',
    default: UserRole.User,
  })
  role!: UserRole;
}
