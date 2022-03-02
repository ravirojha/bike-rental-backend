import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './users';
import Bike from './bikes';

@Entity({ name: 'reservations' })
export default class Reservation extends BaseEntity {
@PrimaryGeneratedColumn() id: number;
@Column() userId: number;
@Column() bikeId: number;
@Column() startDate: string;
@Column() endDate: string;
@Column({ default: 'ACTIVE' }) status: 'ACTIVE' | 'INACTIVE';

  @ManyToOne(() => User, {
    onDelete: 'CASCADE'
  })
@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

@ManyToOne(() => Bike, {
  onDelete: 'CASCADE'
})
@JoinColumn({ name: 'bikeId', referencedColumnName: 'id' })
  bike: Bike;
}
