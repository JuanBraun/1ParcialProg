import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';
import { CafeService } from '../services/cafeServices';

describe('Endpoint POST /api/pedidos/:id/cancelar', () => {

    it('Debe cancelar un pedido pendiente y responder con estado 200', async () => {
        const pedido = CafeService.crearPedido([
            { productoId: '1', cantidad: 1 }
        ]);

        const response = await request(app)
            .post(`/api/pedidos/${pedido.id}/cancelar`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(pedido.id);
        expect(response.body.estado).toBe('cancelado');
    });

    it('Debe responder 404 al intentar cancelar un pedido inexistente', async () => {
        const response = await request(app)
            .post('/api/pedidos/pedido-inexistente/cancelar');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Pedido no encontrado');
    });

    it('Debe responder 400 al intentar cancelar un pedido que ya fue cancelado', async () => {
        const pedido = CafeService.crearPedido([
            { productoId: '1', cantidad: 1 }
        ]);

        CafeService.cancelarPedido(pedido.id);

        const response = await request(app)
            .post(`/api/pedidos/${pedido.id}/cancelar`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            'Solo se pueden cancelar pedidos pendientes'
        );
    });

});