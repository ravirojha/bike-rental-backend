import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'bike'})
export default class Bike extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() model: string;
  @Column() color: string;
  @Column() location: string;
  @Column({ default: 0 }) rating: number;
  @Column({default: true}) isAvailable: boolean;
}