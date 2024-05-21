import { Application } from 'express';
import { jwtCheck, jwtParse } from '../../middlewares/auth';
import orderController from './order.server.controller';

export default function (app: Application): void {
  //create checkout session and save order details
  app.post(
    '/api/order/checkout/create-checkout-session',
    jwtCheck,
    jwtParse,
    orderController.createCheckoutSession
  );

  //webhook events from stripe
  app.post('/api/order/checkout/webhook', orderController.stripeWebhookHandler);

  //get order status
  app.get('/api/order', jwtCheck, jwtParse, orderController.getMyOrder);
}
