import { NestFactory } from '@nestjs/core';
import * as faker from 'faker';
import * as moment from 'moment';
import * as Bcryptjs from 'bcryptjs';
import * as _ from 'lodash';


import Bike from './entities/bikes';
import { AppModule } from './app.module';
import User from './entities/users';
import Reservation from './entities/reservations';
import Rating from './entities/ratings';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  await Bike.delete({});
  await User.delete({});
  await Reservation.delete({});
  await Rating.delete({});

  for(let i = 1; i < 50; i++) {
    const bike = new Bike();
    bike.model = `Model ${i}`;
    bike.color = faker.commerce.color();
    bike.location = faker.address.city();
    bike.rating = Math.floor(Math.random() * 6);
    bike.isAvailable = Math.random() > 0.3;
    await bike.save();
  }

  for(let i = 1; i < 50; i++) {
    const user = new User();
    user.name = faker.name.firstName();
    user.email = faker.internet.email().toLowerCase();
    user.password = Bcryptjs.hashSync('1234', 10);
    user.isManager = Math.random() < 0.15;
    await user.save();
  }

  const users = await User.find({});
  const bikes = await Bike.find({});
  const reservations = [];
  for (let i = 0; i < 50; i++) {
    const r = new Reservation();
    r.bikeId = _.sample(bikes).id;
    r.userId = _.sample(users).id;
    const randomDay = Math.ceil(Math.random() * 100);
    const randDate = Math.random() > 0.5 ? moment().subtract(randomDay, "days") : moment().add(randomDay, "days");
    const from = moment(randDate).subtract(Math.ceil(Math.random() * 8), "days").format("YYYY-MM-DD");
    const to = randDate.format("YYYY-MM-DD");
    r.startDate = from;
    r.endDate = to;
    r.status = 'ACTIVE'
    reservations.push(r);
  }
  await Reservation.save(reservations);

  const reser = await Reservation.find({});

  const ratings = [];
  for (let i = 0; i < 50; i++) {
    const reserId = _.sample(reser).id;
    const res = await Reservation.findOne(reserId)
    const bikeId = res.bikeId
    const userId = res.userId
    let rating = await Rating.findOne({ where: { userId, bikeId, reservationId: reserId } });
    if (!rating) {
      rating = new Rating();
      rating.userId = userId;
      rating.bikeId = bikeId;
      rating.reservationId = reserId;
      rating.rating = _.random(1, 5, true);
      ratings.push(rating);
    }
  }
  await Rating.save(ratings);


  await app.close();
}

bootstrap().then();