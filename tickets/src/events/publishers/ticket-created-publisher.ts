import { Publisher, Subjects, TicketCreatedEvent } from "@fcatatickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
