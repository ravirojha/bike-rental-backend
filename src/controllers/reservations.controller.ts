import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import ReservationsService from '../services/reservations.service';
import * as Joi from 'joi';
import { customValidator, JoiValidate } from '../utils';
import AuthGuard from '../guards/auth.guard';
import AdminGuard from '../guards/admin.guard';

@Controller('reservations')
export default class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(AdminGuard)
  @Get('')
  async get(@Query() query, @Req() req) {
    console.log('*******************');
    return this.reservationsService.get(query.page, req.user);
  }

  @UseGuards(AuthGuard)
  @Get('/users/:id')
  async getReservationByUser(@Query() query,@Param("id") id , @Req() req) {
    return this.reservationsService.getReservationByUser(query.page, id, req.user)
}

  @UseGuards(AuthGuard)
  @Get('/bikes/:id')
  async getReservationByBike(@Query() query,@Param("id") id , @Req() req) {

    return this.reservationsService.getReservationByBike(query.page, id, req.user)
  }

  @UseGuards(AuthGuard)
  @Post('')
  async reserve(@Body() body, @Req() req) {
    const {userId, bikeId, startDate, endDate} = JoiValidate(ReservationSchema, body);
    return this.reservationsService.reserve({userId, bikeId, startDate, endDate}, req.user);
  }

  @UseGuards(AuthGuard)
  @Put("/:id")
  async cancelReservation(@Param("id") id: string,@Body() body, @Req() req) {
    console.log(id,body);
    const { userId, bikeId, startDate, endDate} = JoiValidate(CancelSchema, body);
    return this.reservationsService.cancel( id, {userId, bikeId, startDate, endDate }, req.user);
  }

}

const ReservationSchema = Joi.object({
  userId: Joi.number().required(),
  bikeId: Joi.number().required(),
  startDate: Joi.string().custom(customValidator).required(),
  endDate: Joi.string().custom(customValidator).required(),
})

const CancelSchema = Joi.object({
  userId: Joi.number().required(),
  bikeId: Joi.number().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
})

