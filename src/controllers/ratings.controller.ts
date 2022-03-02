import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import RatingsService from '../services/ratings.service';
import * as Joi from 'joi'
import { JoiValidate } from '../utils';

@Controller('ratings')
export default class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get('')
  async getRating(@Query() query, @Req() req) {
    const {resId, userId, bikeId} = JoiValidate(RatingSchema, query);
    return this.ratingsService.getRating({resId, userId, bikeId}, req.user);
  }

  @Post('')
  async add(@Body() body, @Req() req) {
    const {resId, userId, bikeId, rating} = JoiValidate(RatingSchema, body);
    return this.ratingsService.addRating({resId, userId, bikeId, rating}, req.user);
  }
}

const RatingSchema = Joi.object({
  resId: Joi.number().required(),
  bikeId: Joi.number().required(),
  userId: Joi.number().required(),
  rating: Joi.number(),
})