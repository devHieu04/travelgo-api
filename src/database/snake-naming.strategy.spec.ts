import { SnakeNamingStrategy, toSnakeCase } from './snake-naming.strategy.js';
import { moneyTransformer } from './transformers.js';

describe('toSnakeCase', () => {
  it.each([
    ['startDate', 'start_date'],
    ['paidByMemberId', 'paid_by_member_id'],
    ['estCostPerPerson', 'est_cost_per_person'],
    ['ItineraryTemplateItem', 'itinerary_template_item'],
    ['dayIndex', 'day_index'],
    ['id', 'id'],
  ])('%s -> %s', (input, expected) => {
    expect(toSnakeCase(input)).toBe(expected);
  });
});

describe('SnakeNamingStrategy', () => {
  const strategy = new SnakeNamingStrategy();

  it('giữ tên bảng đặt trong @Entity', () => {
    expect(strategy.tableName('TripMember', 'trip_members')).toBe(
      'trip_members',
    );
  });

  it('cột khoá ngoại trùng tên với cột *Id khai báo riêng', () => {
    expect(strategy.joinColumnName('paidByMember', 'id')).toBe(
      strategy.columnName('paidByMemberId', undefined, []),
    );
  });
});

describe('moneyTransformer', () => {
  it('đổi bigint từ pg (chuỗi) sang number', () => {
    expect(moneyTransformer.from('1200000')).toBe(1_200_000);
    expect(moneyTransformer.from(null)).toBeNull();
  });
});
