import { Module } from '@nestjs/common';
import Bike from './entities/bikes';
import { TypeOrmModule } from '@nestjs/typeorm';
import BikeController from './controllers/bikes.controller';
import BikeService from './services/bikes.service';
import User from './entities/users';
import UsersController from './controllers/users.controller';
import UsersService from './services/users.service';
import Reservation from './entities/reservations';
import ReservationsController from './controllers/reservations.controller';
import ReservationsService from './services/reservations.service';
import Rating from './entities/ratings';
import RatingsController from './controllers/ratings.controller';
import RatingsService from './services/ratings.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      synchronize: true,
      entities: [Bike, User,Reservation,Rating],
      logging: true,
    }),
  ],
  controllers: [BikeController, UsersController, ReservationsController,RatingsController],
  providers: [BikeService, UsersService, ReservationsService, RatingsService],
})
export class AppModule {}
