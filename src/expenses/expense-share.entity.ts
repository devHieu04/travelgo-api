import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { MEMBER_MONEY_FK } from '../database/relation-options.js';
import { moneyTransformer } from '../database/transformers.js';
import { TripMember } from '../trips/trip-member.entity.js';
import { Expense } from './expense.entity.js';

/** Phần của một thành viên trong một khoản chi, theo đồng. */
@Entity('expense_shares')
@Index('uq_expense_shares_expense_member', ['expenseId', 'memberId'], {
  unique: true,
})
@Index('idx_expense_shares_member', ['memberId'])
@Check('chk_expense_shares_amount', `"amount" >= 0`)
export class ExpenseShare {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  expenseId!: string;

  @ManyToOne(() => Expense, (expense) => expense.shares, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  expense!: Relation<Expense>;

  @Column({ type: 'uuid' })
  memberId!: string;

  @ManyToOne(() => TripMember, MEMBER_MONEY_FK)
  @JoinColumn()
  member!: Relation<TripMember>;

  @Column({ type: 'bigint', transformer: moneyTransformer })
  amount!: number;
}
