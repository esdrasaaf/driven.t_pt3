import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotel(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getManyHotels(userId);

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }

    if (error.name === "PaymentError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { userId } = req;

  try {
    const hotel = await hotelsService.getHotelById(Number(id), userId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }

    if (error.name === "PaymentError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
  }
}
