import {
  Check,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from 'typeorm';
import { BaseRecord } from '../database/base.entity.js';
import { ExpenseCategory, SplitMethod } from '../database/enums.js';
import { MEMBER_MONEY_FK } from '../database/relation-options.js';
import { moneyTransformer } from '../database/transformers.js';
import { TripMember } from '../trips/trip-member.entity.js';
import { Trip } from '../trips/trip.entity.js';
import { ExpenseShare } from './expense-share.entity.js';

/**
 * Một khoản chi của nhóm (backlog #2): ai trả, bao nhiêu, chia cho ai.
 * Phần chia luôn được ghi ra `expense_shares`, kể cả khi chia đều.
 * Bất biến: tổng `expense_shares.amount` = `expenses.amount` (kiểm trong
 * cùng transaction ở service). Xoá mềm để số dư tính lại đúng.
 */
@Entity('expenses')
@Index('idx_expenses_trip_spent', ['tripId', 'spentAt'])
@Check('chk_expenses_amount', `"amount" > 0`)
export class Expense extends BaseRecord {
  @Column({ type: 'uuid' })
  tripId!: string;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip!: Relation<Trip>;

  @Column({ type: 'uuid' })
  paidByMemberId!: string;

  @ManyToOne(() => TripMember, MEMBER_MONEY_FK)
  @JoinColumn()
  paidByMember!: Relation<TripMember>;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  /** Theo đồng. */
  @Column({ type: 'bigint', transformer: moneyTransformer })
  amount!: number;

  @Column({ type: 'char', length: 3, default: 'VND' })
  currency!: string;

  @Column({
    type: 'enum',
    enum: ExpenseCategory,
    enumName: 'expense_category',
    default: ExpenseCategory.Other,
  })
  category!: ExpenseCategory;

  @Column({
    type: 'enum',
    enum: SplitMethod,
    enumName: 'split_method',
    default: SplitMethod.Equal,
  })
  splitMethod!: SplitMethod;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  spentAt!: Date;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ type: 'uuid', nullable: true })
  createdByMemberId!: string | null;

  @ManyToOne(() => TripMember, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  createdByMember!: Relation<TripMember> | null;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => ExpenseShare, (share) => share.expense)
  shares!: Relation<ExpenseShare[]>;
}
