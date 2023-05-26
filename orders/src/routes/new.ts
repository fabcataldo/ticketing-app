import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@fcatatickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        //the call of below is optional
        //because we are coupling this service to the ticket service
        //ticket service can change its database, and... its id structure
        //but is a thing to think about...
        //but for now... well, fué
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))

        .withMessage('ticketId must be provided')
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket the user is trying to order in the db
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }
    
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved');
    }
    // calclate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the db
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    // publish an event saying that an order was created


    res.status(201).send(order);
});

export { router as newOrderRouter };