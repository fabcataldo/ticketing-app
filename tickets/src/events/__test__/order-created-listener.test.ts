import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper"
import { OrderCreatedListener } from "../listeners/order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@fcatatickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    // create an instnace of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save a ticket 
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'it-doesnt-matter',
    });
    await ticket.save();

    // create a fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'it-doesnt-matter-x-two',
        expiresAt: 'fake-value',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
}

it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('calls the ack msg', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedEventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedEventData.orderId);
});