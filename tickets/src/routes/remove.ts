import express, {Request, Response} from 'express';
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError
} from '@fcatatickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.delete('/api/tickets/:id', requireAuth, async(req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    await ticket.deleteOne();
    res.status(200).send(ticket);
});

export { router as removeTicketRouter };