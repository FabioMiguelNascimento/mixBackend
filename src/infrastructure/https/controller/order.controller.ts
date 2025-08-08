import { Request, Response, NextFunction } from 'express';
import OrderRepository from '@/infrastructure/database/order.repository.js';
import makeCreateOrder from '@/use-cases/order/createOrder.js';
import makeFindAllOrders from '@/use-cases/order/findAllOrders.js';
import makeFindOrderById from '@/use-cases/order/findOrderById.js';
import { CreateOrderInput, ListOrderInput } from '@/schema/order.schema.js';

const orderRepository = new OrderRepository();

export async function handleCreateOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const order: CreateOrderInput = req.validatedData;

        const createOrder = makeCreateOrder(orderRepository);
        const createdOrder = await createOrder(order);
        
        res.status(201).json({ code: 201, message: 'Pedido criado com sucesso', data: createdOrder });
    } catch (error) {
        next(error);
    }
}

export async function handleFindAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const params: ListOrderInput = req.validatedData;

        const findAllOrders = makeFindAllOrders(orderRepository);
        const result = await findAllOrders(params);

        res.status(200).json({ code: 200, message: 'Pedidos encontrados com sucesso', data: result });
    } catch (error) {
        next(error);
    }
}

export async function handleFindOrderById(req: Request, res: Response, next: NextFunction) {
    try {
        const orderId = req.params.id;

        const findOrderById = makeFindOrderById(orderRepository);
        const order = await findOrderById(orderId);

        res.status(200).json({ code: 200, message: 'Pedido encontrado com sucesso', data: order });
    } catch (error) {
        next(error);
    }
}
