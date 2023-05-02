import { Booking } from '.prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/bookings-repositories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelRepository from '@/repositories/hotel-repository';


async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const room = await hotelRepository.findRoomWithBookings(roomId);
  if (!room) throw notFoundError();

  const booking = await bookingRepository.postBooking(userId, roomId);
  return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  const room = await hotelRepository.findRoomWithBookings(roomId);
  if (!room) throw notFoundError();

  const booking = await bookingRepository.updateBooking(userId, roomId, bookingId);
  return booking;
}



export const bookingsService = {
  postBooking,
  getBooking,
  updateBooking,
};
