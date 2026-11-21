import { Producto } from '../modelos/producto';
import { Expreso } from '../modelos/expreso';
import { Filtrado } from '../modelos/filtrado';
import { Pasteleria } from '../modelos/pasteleria';
import { Pedido, ItemPedido } from '../modelos/pedido';
import { Te } from '../modelos/te'

let productos: Producto[] = [
    new Expreso('1', 'Café Expreso Brasil', 2500, 'Mediano', 27, 'Brasil', 140),
    new Expreso('2', 'Café Expreso Colombia', 2500, 'Mediano', 27, 'Colombia', 180),
    new Filtrado('3', 'Café Filtrado Etiopía', 3200, 'Taza grande', 25, 'Etiopía', 240),
    new Pasteleria('4', 'Muffin de chocolate', 2500),
    new Pasteleria('5', 'Torta selva negra', 4200),
    new Te('6', 'Té en hebras rojo', 1500)
];

let pedidos: Pedido[] = [];

const calcularVentasPorProducto = () => {
    const ventas: { [nombreProducto: string]: number } = {};

    pedidos
        .filter(pedido => pedido.estado !== 'cancelado')
        .forEach(pedido => {
            pedido.items.forEach(item => {
                const producto = productos.find(p => p.id === item.productoId);
                if (producto) {
                    ventas[producto.nombre] = (ventas[producto.nombre] || 0) + item.cantidad;
                }
            });
        });

    return ventas;
};

export const CafeService = {
    obtenerProductos: () => productos,
    obtenerProductoPorId: (id: string) => productos.find(p => p.id === id),

    crearPedido: (items: ItemPedido[]) => {
        const nuevoId = crypto.randomUUID(); //refactoring
        const pedido = new Pedido(nuevoId, items, 'pendiente');
        pedidos.push(pedido);
        return pedido;
    },

    obtenerPedidos: () => pedidos,

    obtenerPedidoPorId: (id: string) => pedidos.find(p => p.id === id),

    cancelarPedido: (id: string): Pedido => {
       const pedido = pedidos.find(p => p.id === id);

        if (!pedido) {
          throw new Error('Pedido no encontrado');
      }

        if (pedido.estado !== 'pendiente') {
          throw new Error('Solo se pueden cancelar pedidos pendientes');
      }

        pedido.estado = 'cancelado';
        return pedido;
    },

    calcularTotalPedido: (pedido: Pedido): number => {
        return pedido.items.reduce((acumulado, item) => {
            const producto = productos.find(p => p.id === item.productoId);
            if (!producto) return acumulado;
            return acumulado + (producto.calcularPrecio() * item.cantidad);
        }, 0);
    },

    obtenerFacturacionTotal: (): number => {
    return pedidos
        .filter(pedido => pedido.estado !== 'cancelado')
        .reduce((total, pedido) => {
            return total + CafeService.calcularTotalPedido(pedido);
        }, 0);
    },

    obtenerCantidadVendidaPorProducto: calcularVentasPorProducto,

    obtenerProductoMasVendido: () => {
        const ventas = calcularVentasPorProducto();
        let productoMasVendido = 'Ninguno';
        let maxCantidad = 0;

        for (const [nombre, cant] of Object.entries(ventas)) {
            const cantidad = cant as number;
            if (cantidad > maxCantidad) {
                maxCantidad = cantidad;
                productoMasVendido = nombre;
            }
        }
        return { producto: productoMasVendido, cantidad: maxCantidad };
    }
};
