import { HttpException, Injectable, NotFoundException, Res } from '@nestjs/common';
import Reservation from '../entities/reservations';
import { PageSize } from '../utils';
import { getRepository } from 'typeorm';
import Bike from '../entities/bikes';

@Injectable()
export default class ReservationsService {
  async get(p: string, authUser) {
    const page = Math.max(Number(p) || 1, 1);
    const reservations = await Reservation.find({
      take: PageSize,
      skip: (page - 1) * PageSize,
      order: { startDate: "DESC" },
    });
    const totalReservationCount = await Reservation.count({});
    const pageCount = Math.ceil(totalReservationCount / PageSize);
    return {reservations, page, pageCount}
  }

  async getReservationByUser(p: string, id, authUser) {
    const page = Math.max(Number(p) || 1, 1);
    const reservations =  await Reservation.find({
      where: {
        userId: id
      },
      take: PageSize,
      skip: (page - 1) * PageSize,
      order: { endDate: "DESC" },
    });
    const totalReservationCount = await Reservation.count({where: {userId: id}});
    const pageCount = Math.ceil(totalReservationCount / PageSize);
    return {reservations, page, pageCount}
  }

  async getReservationByBike(p: string, id, authUser) {
    const page = Math.max(Number(p) || 1, 1);
    const reservations =  await Reservation.find({
      where: {
        bikeId: id
      },
      take: PageSize,
      skip: (page - 1) * PageSize,
      order: { startDate: "DESC" },
    });
    const totalReservationCount = await Reservation.count({where: {bikeId: id}});
    const pageCount = Math.ceil(totalReservationCount / PageSize);
    return {reservations, page, pageCount}
  }

  async reserve({userId, bikeId, startDate, endDate}, authUser) {
    let nonBookedBikes = await this.getNonBookedBikes({ startDate, endDate });
    if(!nonBookedBikes.includes(bikeId)) {
      throw new HttpException('Bike is already booked for this date', 400)
    }
    const bike = await Bike.findOne(bikeId);
    if(bike) {
      const reservation = new Reservation();
      reservation.userId = userId;
      reservation.bikeId = bikeId;
      reservation.startDate = startDate;
      reservation.endDate = endDate;
      await reservation.save();
      return reservation;
    } else throw new NotFoundException();
  }

  async cancel( id, {userId, bikeId, startDate, endDate }, authUser) {
    const reservation = await Reservation.findOne(id);
    if (reservation) {
      reservation.userId = userId;
      reservation.bikeId = bikeId;
      reservation.startDate = startDate;
      reservation.endDate = endDate;
      reservation.status = "CANCELLED"
      await reservation.save();
      return reservation;
    } else throw new NotFoundException();
  }

  private async getNonBookedBikes({ startDate, endDate, }): Promise<number[]> {
    const reservations = await getRepository(Reservation)
      .createQueryBuilder('res')
      .where(
        'res.status = :status and ((res.endDate between :startDate and :endDate) or ' +
        '(res.startDate between :startDate and :endDate) or ' +
        '(res.startDate < :startDate and res.endDate > :endDate))',
        { startDate, endDate, status: 'ACTIVE' },
      )
      .getMany();
    const reservedBikeIds = reservations.map((r) => r.bikeId);
    const allBikes = await Bike.find({});
    const notBookedBikes = allBikes
      .filter((b) => !reservedBikeIds.includes(b.id))
      .map((b) => b.id);
    return notBookedBikes;
  }
}