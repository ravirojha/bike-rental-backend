import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'user'})
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column() email: string;
  @Column({select: false}) password: string;
  @Column({default: false}) isManager: boolean;
}