
import { describe, it, expect } from 'vitest';
import { Expreso } from '../modelos/expreso';
import { Filtrado } from '../modelos/filtrado';
import { Pasteleria } from '../modelos/pasteleria';
import { CafeService } from '../services/cafeServices';
import { Te } from "../modelos/te";

describe('Cafetería Origen - Pruebas Unitarias y de Negocio', () => {
    it('Debe calcular correctamente el precio de un Expreso', () => {
        // Expreso Mediano con 27g de café Colombia a $180 el gramo, precio base $2500
        // Costo café = 27 * 180 = 4860. Precio final = 2500 + 4860 = 7360
        const expreso = new Expreso(
            '1',
            'Expreso Colombia',
            2500,
            'Mediano',
            27,
            'Colombia',
            180
        );

        expect(expreso.calcularPrecio()).toBe(7360);
    });

    it('Debe calcular correctamente el precio de un Filtrado', () => {
        // Filtrado Taza grande con 25g de Etiopía a $240 el gramo, precio base $3200
        // Costo café = 25 * 240 = 6000. Precio final = 3200 + 6000 = 9200
        const filtrado = new Filtrado(
            '2',
            'Filtrado Etiopía',
            3200,
            'Taza grande',
            25,
            'Etiopía',
            240
        );

        expect(filtrado.calcularPrecio()).toBe(9200);
    });

    it('Debe devolver el precio base para la Pastelería', () => {
        const muffin = new Pasteleria(
            '4',
            'Muffin de chocolate',
            2500
        );

        expect(muffin.calcularPrecio()).toBe(2500);
    });

    it('Debe registrar un pedido y calcular correctamente el total y reportes', () => {
        const pedido = CafeService.crearPedido([
            { productoId: '1', cantidad: 2 }
        ]);

        const totalPedido = CafeService.calcularTotalPedido(pedido);
        expect(totalPedido).toBe(6280 * 2);

        const facturacion = CafeService.obtenerFacturacionTotal();
        expect(facturacion).toBe(6280 * 2);

        const masVendido = CafeService.obtenerProductoMasVendido();
        expect(masVendido.cantidad).toBe(2);
    });

    it('Debe calcular correctamente el precio de un Té en hebras', () => {
        const te = new Te(
            '6',
            'Té en hebras rojo',
            1500
        );

        expect(te.calcularPrecio()).toBe(1500);
    });

    it('Debe cancelar correctamente un pedido pendiente', () => {
        const pedido = CafeService.crearPedido([
            { productoId: '1', cantidad: 1 }
        ]);

        const pedidoCancelado = CafeService.cancelarPedido(pedido.id);

        expect(pedidoCancelado.estado).toBe('cancelado');
    });

    it('No debe contar los pedidos cancelados en la facturación ni en las ventas', () => {
        const facturacionAntes = CafeService.obtenerFacturacionTotal();
        const ventasAntes = { ...CafeService.obtenerCantidadVendidaPorProducto() };
        const masVendidoAntes = CafeService.obtenerProductoMasVendido();

        const pedido = CafeService.crearPedido([
            { productoId: '1', cantidad: 1 }
        ]);

        CafeService.cancelarPedido(pedido.id);

        expect(CafeService.obtenerFacturacionTotal()).toBe(facturacionAntes);
        expect(CafeService.obtenerCantidadVendidaPorProducto()).toEqual(ventasAntes);
        expect(CafeService.obtenerProductoMasVendido()).toEqual(masVendidoAntes);
    });
});
