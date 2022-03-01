import { Injectable, NotFoundException } from '@nestjs/common';
import Bike from '../entities/bikes';
import { FindCondition, getRepository, MoreThanOrEqual } from 'typeorm';
import { PageSize } from '../utils';
import Reservation from '../entities/reservations';

@Injectable()
export default class BikeService {
  async get(p: string, { startDate, endDate, model, color, location, rating }, authUser) {
    const query: FindCondition<Bike> = {};
    const page = Math.max(Number(p) || 1, 1);

    if (model) {
      query.model = model
    }
    if (color) {
      query.color = color
    }
    if (location) {
      query.location = location
    }
    if (rating) {
      query.rating = MoreThanOrEqual(rating)
    }

    let bikeData = await Bike.find(
      {
        where: query,
        take: PageSize,
        skip: (page - 1) * PageSize,
      }
    );


    if (startDate && endDate) {
      const resData = await getRepository(Reservation)
        .createQueryBuilder("res")
        .select("res.bikeId")
        .where("res.startDate > :startDate AND res.startDate < :endDate", {
          startDate: `${startDate}`,
          endDate: `${endDate}`
        })
        .orWhere("res.startDate < :startDate AND (res.startDate > :startDate AND res.endDate < :endDate)", {
          startDate: `${startDate}`,
          endDate: `${endDate}`
        })
        .orWhere("res.startDate < :startDate AND res.endDate > :endDate", {
          startDate: `${startDate}`,
          endDate: `${endDate}`
        })
        .getMany();

      const ids = resData.map((bikeId) => bikeId.bikeId);

      bikeData = bikeData.filter((bike) => {
        let flag = false;
        ids.forEach((id) => {
          if (bike.id === id) {
            flag = true;
          }
        })
        if (flag == false)
          return bike;
      })
    }

    const totalBikeCount = await Bike.count({ where: query });

    const pageCount = Math.ceil(totalBikeCount / PageSize);
    return { bikeData, page, pageCount };
  }

  async add({ model, color, location, isAvailable }, authUser) {
    const bike = new Bike();
    bike.model = model;
    bike.color = color;
    bike.location = location;
    bike.isAvailable = isAvailable;
    await bike.save();
    return bike;
  }

  async delete(id: string, authUser) {
    const bike = await Bike.findOne(id);
    if (bike) {
      await Bike.delete(id);
      return {};
    } else throw new NotFoundException();
  }

  async update(id: string, { model, color, location, isAvailable }, authUser) {
    const bike = await Bike.findOne(id);
    if (bike) {
      bike.model = model;
      bike.color = color;
      bike.location = location;
      bike.isAvailable = isAvailable;
      await bike.save();
      return bike;
    } else throw new NotFoundException();
  }
}


