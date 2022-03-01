import BikeService from '../services/bikes.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import * as Joi from 'joi'
import AuthGuard from '../guards/auth.guard';


import { customValidator, JoiValidate } from '../utils';
import AdminGuard from '../guards/admin.guard';

@Controller('bikes')
export default class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @UseGuards(AuthGuard)
  @Get('')
  async get(@Query() query, @Req() req) {
    const tempQuery = { ...query };
    delete tempQuery["page"];
    const obj = JoiValidate(FilterSchema, tempQuery);
    return this.bikeService.get(query.page, obj, req.user);
  }

  @UseGuards(AdminGuard)
  @Post('')
  async add(@Body() body,@Req() req) {
    const {model, color, location, isAvailable} = JoiValidate(BikeSchema, body);
    return this.bikeService.add({model, color, location, isAvailable}, req.user);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
   async delete(@Param("id") id: string, @Req() req) {
    return this.bikeService.delete(id, req.user);
   }

  @UseGuards(AdminGuard)
   @Put("/:id")
  async update(@Param("id") id: string, @Body() body, @Req() req) {
      const { model, color, location, isAvailable } = JoiValidate(BikeSchema, body);
      return this.bikeService.update(id, { model, color, location, isAvailable }, req.user);
   }
}

const FilterSchema = Joi.object({
  startDate: Joi.string().custom(customValidator).allow(''),
  endDate: Joi.string().custom(customValidator).allow(''),
  model: Joi.string().min(2).allow(''),
  color: Joi.string().min(2).allow(''),
  location: Joi.string().min(2).allow(''),
  rating: Joi.number().min(0).max(5),
});

const ratingSchema = Joi.object({
  rating: Joi.number().min(0).max(5).required(),
})

const BikeSchema = Joi.object(({
  model: Joi.string().min(1).required(),
  color: Joi.string().min(1).required(),
  location: Joi.string().min(1).required(),
  isAvailable: Joi.boolean().required(),
}))


