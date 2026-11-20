import type { RelationOptions } from 'typeorm';

/**
 * Khoá ngoại từ dữ liệu tiền (khoản chi, phần chia, chuyển khoản) tới
 * `trip_members`.
 *
 * - Không cho xoá một thành viên khi họ còn dính tới tiền: số dư của cả
 *   nhóm sẽ sai. Rời chuyến thì đặt `trip_members.removed_at`.
 * - Nhưng xoá cả chuyến thì phải được: `trips` cascade xuống cả
 *   `trip_members` lẫn `expenses → expense_shares`. Postgres chạy từng nhánh
 *   cascade như một câu lệnh riêng, nên RESTRICT hay NO ACTION thường đều
 *   báo lỗi khi nhánh `trip_members` chạy trước. Kiểm tra lúc commit
 *   (DEFERRABLE INITIALLY DEFERRED) thì đến lúc đó các phần chia đã bị xoá.
 */
export const MEMBER_MONEY_FK: RelationOptions = {
  onDelete: 'NO ACTION',
  deferrable: 'INITIALLY DEFERRED',
};
