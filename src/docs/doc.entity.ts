import { Approver } from '../approvers/approver.entity';
import { User } from '../auth/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocStatus } from './enum/doc-status.enum';

@Entity({ name: 'docs' })
export class Doc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  status: DocStatus;

  @ManyToOne(
    type => User,
    user => user.docs,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  @OneToMany(
    type => Approver,
    approver => approver.doc,
    { eager: true },
  )
  approvers: Approver[];

  @Column()
  totalApprovers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
