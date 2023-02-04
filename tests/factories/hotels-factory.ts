import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.lorem.word(),
      image: faker.image.imageUrl(),
      Rooms: {
        create: [
          { name: faker.lorem.word(), capacity: faker.datatype.number() }
        ]
      }
    },
    include: {
      Rooms: true
    }
  });
}
