export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

/** Miền theo cách người dùng lọc điểm đến trong demo. */
export enum Region {
  North = 'north',
  Central = 'central',
  South = 'south',
}

export enum PlaceKind {
  Attraction = 'attraction',
  Restaurant = 'restaurant',
  Cafe = 'cafe',
  Lodging = 'lodging',
  Other = 'other',
}

export enum TemplateStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export enum TripStatus {
  Planning = 'planning',
  Finalized = 'finalized',
  Cancelled = 'cancelled',
}

export enum TripMemberRole {
  Owner = 'owner',
  Member = 'member',
}

export enum ExpenseCategory {
  Food = 'food',
  Lodging = 'lodging',
  Transport = 'transport',
  Activity = 'activity',
  Shopping = 'shopping',
  Other = 'other',
}

export enum SplitMethod {
  /** Chia đều cho các thành viên được chọn. */
  Equal = 'equal',
  /** Nhập số tiền riêng cho từng người. */
  Exact = 'exact',
}
