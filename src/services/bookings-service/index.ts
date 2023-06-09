import { Booking } from '.prisma/client';
import { forbiddenError, notFoundError, unauthorizedError } from '@/errors';
import bookingRepository from '@/repositories/bookings-repositories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelRepository from '@/repositories/hotel-repository';
import { forbidden } from 'joi';
import httpStatus from 'http-status';

async function check(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') throw forbiddenError();
  return;

}
async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();
  return booking;
}
async function postBooking(userId: number, roomId: number) {
  await check(userId);
  const room = await hotelRepository.findRoomWithBookings(roomId);
  if (!room) throw notFoundError();
  if(room.Booking.length === room.capacity) throw forbiddenError();


  const booking = await bookingRepository.postBooking(userId, roomId);
  return booking;
}
async function updateBooking(userId: number, bookingId: number, roomId: number) {
  const room = await hotelRepository.findRoomWithBookings(roomId);
  if (!room) throw notFoundError();

  if(room.Booking.length === room.capacity) throw forbiddenError();

  const hasBooking = await bookingRepository.getBooking(userId);
  if (!hasBooking) throw forbiddenError();

  const booking = await bookingRepository.updateBooking(userId, roomId, bookingId);
  return booking;
}



export const bookingsService = {
  postBooking,
  getBooking,
  updateBooking,
};
