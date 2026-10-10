import { Router } from 'express';
import { CafeService } from './services/cafeServices';

const router = Router();

// GET /productos -> Muestra una lista de todos los productos
router.get('/productos', (req, res) => {
    const lista = CafeService.obtenerProductos();
  // Mapeamos para mostrar también el precio calculado si se desea
    const resultado = lista.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precioBase: p.precioBase,
        precioFinal: p.calcularPrecio()
    }));
    res.json(resultado);
});

// GET /productos/:id -> Devuelve el producto pedido según id
router.get('/productos/:id', (req, res) => {
    const producto = CafeService.obtenerProductoPorId(req.params.id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({
        ...producto,
        precioFinal: producto.calcularPrecio()
    });
});

// POST /pedidos -> Devuelve el pedido con su total calculado
router.post('/pedidos', (req, res) => {
    const { items } = req.body; // Espera un array de { productoId, cantidad }
        if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Items inválidos' });
    }

    const nuevoPedido = CafeService.crearPedido(items);
    const total = CafeService.calcularTotalPedido(nuevoPedido);

    res.status(201).json({
        id: nuevoPedido.id,
        items: nuevoPedido.items,
        estado: nuevoPedido.estado,
        totalPedido: total
    });
});

// GET /pedidos -> Lista de pedidos de todas las mesas
router.get('/pedidos', (req, res) => {
    const todos = CafeService.obtenerPedidos().map(p => ({
        ...p,
        total: CafeService.calcularTotalPedido(p)
    }));
    res.json(todos);
});

// GET /pedidos/:id -> Pedido de tal mesa (por ID)
router.get('/pedidos/:id', (req, res) => {
    const pedido = CafeService.obtenerPedidoPorId(req.params.id);
    if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({
        ...pedido,
        total: CafeService.calcularTotalPedido(pedido)
    });
});

// GET /reportes/facturacion -> Devuelve cuánto se facturó
router.get('/reportes/facturacion', (req, res) => {
    const facturacionTotal = CafeService.obtenerFacturacionTotal();
    res.json({ facturacionTotal });
});

// GET /reportes/mas-vendido -> Devuelve el producto más vendido
router.get('/reportes/mas-vendido', (req, res) => {
    const masVendido = CafeService.obtenerProductoMasVendido();
    res.json(masVendido);
});

export default router;