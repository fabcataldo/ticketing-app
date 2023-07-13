import { Subjects, Publisher, ExpirationCompleteEvent } from "@fcatatickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}