import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './users';
import Bike from './bikes';

@Entity({name: 'rating'})
export default class Rating extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() userId: number;
  @Column() bikeId: number;
  @Column() rating: number;
  @Column() reservationId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Bike)
  @JoinColumn({ name: 'bikeId', referencedColumnName: 'id' })
  bike: Bike;

}