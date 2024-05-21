import { NextFunction, Response, Request } from 'express';
import Stripe from 'stripe';
import Restaurant, { MenuItemType } from '../../database/models/restaurant';
import Order from '../../database/models/order';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const CLIENT_URL = process.env.CLIENT_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (menuItem) => menuItem._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      const err = new Error(`Menu item not found ${cartItem.menuItemId}`);
      Object.assign(err, { statusCode: 404 });
      throw err;
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'inr',
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Delivery',
          type: 'fixed_amount',
          fixed_amount: {
            amount: deliveryPrice,
            currency: 'inr',
          },
        },
      },
    ],
    mode: 'payment',
    metadata: {
      orderId: orderId,
      restaurantId: restaurantId,
    },
    success_url: `${CLIENT_URL}/order-status?success=true`,
    cancel_url: `${CLIENT_URL}/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};

const stripeWebhookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let event;

  try {
    const sig = req.headers['stripe-signature'];

    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);

    const err = new Error(`Webhook error : ${error.message}`);
    Object.assign(err, { statusCode: 400 });

    return next(err);
  }

  if (event.type === 'checkout.session.completed') {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      const err = new Error('Order not found');
      Object.assign(err, { statusCode: 404 });
      return next(err);
    }

    order.status = 'paid';
    order.totalAmount = event.data.object.amount_total as number;

    await order.save();
  }

  return res.status(200).send();
};

const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      const err = new Error('Restaurant not found');
      Object.assign(err, { statusCode: 404 });
      return next(err);
    }

    const newOrder = new Order({
      restaurant: restaurant._id,
      user: req.userId,
      status: 'placed',
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      const err = new Error('Error creating stripe session');
      return next(err);
    }

    await newOrder.save();

    return res.json({ status: true, data: { url: session.url } });
  } catch (error: any) {
    console.log(error);
    next(new Error(error.raw.message));
  }
};

const getMyOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .select('-__v')
      .populate('restaurant')
      .populate('user');

    return res.json({ status: true, data: orders });
  } catch (error) {
    console.log(error);
    next(new Error('Error fetching order status'));
  }
};

const orderController = {
  createCheckoutSession,
  stripeWebhookHandler,
  getMyOrder,
};

export default orderController;
