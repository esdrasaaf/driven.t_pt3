import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

async function findHotel(): Promise<Hotel[]> {
  return prisma.hotel.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

async function findHotelById(hotelId: number): Promise<HotelAndRooms> {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export type HotelAndRooms = Hotel & { Rooms: Room[] };

const hotelRepository = {
  findHotel,
  findHotelById,
};

export default hotelRepository;
