import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

// interfaces for SAVING a ticket in the orders db
interface TicketAttrs {
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};
ticketSchema.methods.isReserved = async function() {
    //this===the ticket document that we just called 'isReserved' before, the ticket that we found, if we call this method

    // make sure that this ticket is not already reserved
    // run query to look at all orders. find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // if we fnd an order from that means the ticket *is* reserved
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });
    
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };