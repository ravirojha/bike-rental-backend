import { Injectable } from '@nestjs/common';
import Bike from '../entities/bikes';
import Rating from '../entities/ratings';

@Injectable()
export default class RatingsService {

  async getRating({resId, userId, bikeId}, authUser) {
    return await Rating.findOne({
      where: {
        reservationId: resId,
        userId: userId,
        bikeId: bikeId
      }
    });
  }



  async addRating({rating, resId, userId, bikeId}, authUser) {
    const bike = await Bike.findOne({
      where: {
        id: bikeId
      }
    });

    const rate = new Rating();
    rate.userId = userId;
    rate.bikeId = bikeId;
    rate.rating = rating;
    rate.reservationId = resId;
    await rate.save();

    const allRatings = await Rating.find({
      where: {
        bikeId
      }
    });

    const totalRating = allRatings.reduce((prev, curr) => curr.rating + prev, 0)
    if(bike) {
      bike.rating = totalRating/allRatings.length;
      await bike.save();
    }
    return rate;
  }

}