import { Publisher, Subjects, OrderCancelledEvent } from "@fcatatickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

