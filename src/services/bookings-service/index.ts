import { Booking } from '.prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/bookings-repositories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelRepository from '@/repositories/hotel-repository';


async function freeRooms(userId: number) {
  const rooms = await bookingRepository.findById(userId);
  if (!rooms) throw notFoundError();

  const spotsReserved = await bookingRepository.countSpots(userId);

  if (spotsReserved >= rooms.capacity) throw forbiddenError();

  return rooms;
}

async function check(userId:number) {
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
  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.postBooking(userId, roomId);
  return booking;

}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findById(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw forbiddenError();

  const room = await hotelRepository.findRoomWithBookings(roomId);
  if (!room) throw notFoundError();
  if (room.capacity <= room.Booking.length) throw forbiddenError();

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
