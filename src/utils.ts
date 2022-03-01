import { HttpException } from '@nestjs/common';
import * as moment from 'moment';
import * as Jwt from "jsonwebtoken";

import User from './entities/users';

export const PageSize = 10;

export const JwtSecret = 'asdkjhad23984u98qwerh2873rtw87';

export const JoiValidate = (schema, data) => {
  const { value, error } = schema.validate(data);
  if (error) throw new HttpException(error.message, 400);
  return value;
}

export function customValidator(val, handler) {
  const date = moment(val).format('YYYY-MM-DD');
  if (date) {
    return date
  } else {
    throw new HttpException('Invalid Date',400)
  }
}


export function validateDate(startDate, endDate) {
  if(startDate > moment().add(1, 'day').format('YYYY-MM-DD') || endDate > moment().add(1, 'day').format('YYYY-MM-DD')) {
    throw new HttpException("Date cannot start after present day", 400);
  } else if(startDate > endDate) {
    throw new HttpException("End date cannot be greater than start date", 400);
  } else return {startDate, endDate};
}


export const verifyJwtToken = async (token: string) => {
  try {
    const decoded = Jwt.verify(token, JwtSecret);
    const { id } = decoded;
    const user = await User.findOne(id);
    return user;
  } catch (e) {
    return null;
  }
}
