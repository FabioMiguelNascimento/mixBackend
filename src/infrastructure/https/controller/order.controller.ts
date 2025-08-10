import { Request, Response, NextFunction } from 'express';
import OrderRepository from '@/infrastructure/database/order.repository.js';
import makeCreateOrder from '@/use-cases/order/createOrder.js';
import makeFindAllOrders from '@/use-cases/order/findAllOrders.js';
import makeFindOrderById from '@/use-cases/order/findOrderById.js';
import makeUpdateOrderStatus from '@/use-cases/order/updateOrderStatus.js';
import makeUpdateOrder from '@/use-cases/order/updateOrder.js';
import makeFindMyOrders from '@/use-cases/order/findMyOrders.js';
import { CreateOrderInput, ListOrderInput } from '@/schema/order.schema.js';

const orderRepository = new OrderRepository();

export async function handleCreateOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const orderData: CreateOrderInput = req.validatedData;
        const userId = req.userId;

        const createOrder = makeCreateOrder(orderRepository);
        const createdOrder = await createOrder({ ...orderData, userId });
        
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

export async function handleUpdateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { status } = req.validatedData;
        const { id } = req.validatedData;

        const updateOrderStatus = makeUpdateOrderStatus(orderRepository);
        const updatedOrder = await updateOrderStatus(id, status);
        
        res.status(200).json({ code: 200, message: 'Status do pedido atualizado com sucesso', data: updatedOrder });
    } catch (error) {
        next(error);
    }
}

export async function handleUpdateOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const data = req.validatedData;

        const updateOrder = makeUpdateOrder(orderRepository);
        const updatedOrder = await updateOrder(id, data);

        res.status(200).json({ code: 200, message: 'Pedido atualizado com sucesso', data: updatedOrder });
    } catch (error) {
        next(error);
    }
}

export async function handleFindMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const params: ListOrderInput = req.validatedData;

        const findMyOrders = makeFindMyOrders(orderRepository);
        const result = await findMyOrders(userId, params);

        res.status(200).json({ code: 200, message: 'Meus pedidos encontrados com sucesso', data: result });
    } catch (error) {
        next(error);
    }
}