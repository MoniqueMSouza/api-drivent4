import { Booking } from '.prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/bookings-repositories';
import hotelsService from '../hotels-service';

async function freeRooms(userId: number) {
    const rooms = await bookingRepository.findById(userId);
    if (!rooms) throw notFoundError();
  
    const spotsReserved = await bookingRepository.countSpots(userId);
  
    if (spotsReserved >= rooms.capacity) throw forbiddenError();
  
    return rooms;
}

async function getBooking(userId: number) {
  
    const booking = await bookingRepository.getBooking(userId);
    if (!booking) throw notFoundError();
  
    return booking;
  }

async function postBooking(userId: number, roomId: number) {
    await hotelsService.listHotels(userId);
    await freeRooms(roomId);
  
    return await bookingRepository.postBooking(userId, roomId);
}



async function updateBooking(userId: number, bookingId: number, roomId: number) {
    const hasBooking = await bookingRepository.getBooking(userId);
    if (!hasBooking) throw forbiddenError();
  
    await freeRooms(roomId);
  
    const booking = await bookingRepository.updateBooking(userId, roomId, bookingId);
    return booking;
}



export const bookingsService = {
  postBooking,
  getBooking,
  updateBooking,
};
