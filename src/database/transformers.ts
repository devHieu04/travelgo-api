import { ValueTransformer } from 'typeorm';

/**
 * Tiền lưu bằng `bigint` theo đồng (VND không có phần lẻ).
 * Driver `pg` trả `bigint` về dạng chuỗi; số tiền của một chuyến đi
 * luôn nhỏ hơn Number.MAX_SAFE_INTEGER nên đổi sang number là an toàn.
 */
export const moneyTransformer: ValueTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};
