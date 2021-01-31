import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doc } from '../docs/doc.entity';
import { User } from '../auth/user.entity';

@Entity({ name: 'approvers' })
export class Approver extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  done: boolean;

  @Column()
  priority: number;

  @ManyToOne(
    type => Doc,
    doc => doc.approvers,
    { eager: false, onDelete: 'CASCADE' },
  )
  doc: Doc;

  @Column()
  docId: number;

  @ManyToOne(
    type => User,
    user => user.approvers,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
