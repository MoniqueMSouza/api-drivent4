import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services/bookings-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const id = req.userId;

    try {
        const booking = await bookingsService.getBooking(id)

        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        next(error);
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const { roomId } = req.body as { roomId: number }

    try {
        
        const bookings = await bookingsService.postBooking(userId, roomId);
    
        return res.status(httpStatus.OK).send({ bookingId: bookings });
    } catch (error) {
        next(error);
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
const { userId } = req;
    const { bookingId } = req.params as { bookingId: string };
    const { roomId } = req.body as { roomId: number };


    try {
        if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);

        const booking = await bookingsService.updateBooking(userId, parseInt(bookingId), roomId);
        

        return res.status(httpStatus.OK).send({ bookingId: bookingId });
    } catch (error) {
        next(error);
    }

}

