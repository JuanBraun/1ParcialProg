export interface ItemPedido {
    productoId: string;
    cantidad: number;
}

export type EstadoPedido = 'pendiente' | 'entregado' | 'cancelado';

export class Pedido {
    constructor(
        public id: string,
        public items: ItemPedido[],
        public estado: EstadoPedido = 'pendiente'
    ) {}
}