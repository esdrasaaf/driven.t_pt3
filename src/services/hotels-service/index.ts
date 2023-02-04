import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel } from "@prisma/client";
import { HotelAndRooms } from "@/repositories/hotel-repository";

async function getManyHotels(userId: number): Promise<Hotel[]> {
  const enrollmentWithTicket = await enrollmentRepository.findWithTicketByUserId(userId);

  //Se o usuário não possui inscrição
  if (!enrollmentWithTicket) throw notFoundError();

  //Se o usuário possui incrição mas não possui ticket
  if (enrollmentWithTicket.Ticket.length === 0) throw notFoundError();

  //Se o ticket não foi pago
  if (enrollmentWithTicket.Ticket[0].status === "RESERVED")
    throw { name: "PaymentError", message: "Finish the payment before" };

  const ticketWithType = await ticketRepository.findTickeWithTypeById(enrollmentWithTicket.Ticket[0].id);

  //Se o ticket é remoto
  if (ticketWithType.TicketType.isRemote) throw { name: "PaymentError", message: "Finish the payment before" };

  //Se o ticket não tem hotel
  if (!ticketWithType.TicketType.includesHotel) throw { name: "PaymentError", message: "Finish the payment before" };

  const hotels = await hotelRepository.findHotel();

  //Se não houver hotéis cadastrados
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelById(hotelId: number, userId: number): Promise<HotelAndRooms> {
  const enrollmentWithTicket = await enrollmentRepository.findWithTicketByUserId(userId);

  //Se o usuário não possui inscrição
  if (!enrollmentWithTicket) throw notFoundError();

  //Se o usuário possui incrição mas não possui ticket
  if (enrollmentWithTicket.Ticket.length === 0) throw notFoundError();

  //Se o ticket não foi pago
  if (enrollmentWithTicket.Ticket[0].status === "RESERVED")
    throw { name: "PaymentError", message: "Finish the payment before" };

  const ticketWithType = await ticketRepository.findTickeWithTypeById(enrollmentWithTicket.Ticket[0].id);

  //Se o ticket é remoto
  if (ticketWithType.TicketType.isRemote) throw { name: "PaymentError", message: "Finish the payment before" };

  //Se o ticket não tem hotel
  if (!ticketWithType.TicketType.includesHotel) throw { name: "PaymentError", message: "Finish the payment before" };

  const hotel = await hotelRepository.findHotelById(hotelId);

  //Se não houver hotel cadastrado
  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = {
  getManyHotels,
  getHotelById,
};

export default hotelsService;
