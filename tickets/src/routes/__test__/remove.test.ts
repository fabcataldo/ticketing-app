import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('removes the ticket provided', async () => {
    const cookie = global.signin();
    const newTicketResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'new concert holla',
            price: 30
        })
        .expect(201)

    const deleteTicketResponse = await request(app)
        .delete(`/api/tickets/${newTicketResponse.body.id}`)
        .set('Cookie', cookie)
        .expect(200)
    
    expect(deleteTicketResponse.body.title).toEqual('new concert holla');
});

it('returns a 404 if the ticket provided does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .expect(404)
});

it('return a 401 if the user does not own the ticket', async () => {
    const newTicketResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'new concert holla',
            price: 30
        })
        .expect(201)

    await request(app)
        .delete(`/api/tickets/${newTicketResponse.body.id}`)
        .set('Cookie', global.signin())
        .expect(401)
});


