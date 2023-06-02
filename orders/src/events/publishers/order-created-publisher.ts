import { Publisher, OrderCreatedEvent, Subjects } from "@fcatatickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}