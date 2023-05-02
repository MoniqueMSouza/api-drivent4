import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}
async function findRoomWithBookings(id: number) {
  return prisma.room.findUnique({
    where: { id },
    include: { Booking: true },
    
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomWithBookings
};

export default hotelRepository;
