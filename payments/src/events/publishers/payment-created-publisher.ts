import { Publisher, Subjects, PaymentCreatedEvent } from "@fcatatickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    
}