const express = require('express');
const bodyParser = require('body-parser');
const { Product, Order, OrderItem } = require('./models');
const app = express();

app.use(bodyParser.json());

// Get product list
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View order list with filter by customer name and order date, pagination
app.get('/orders', async (req, res) => {
  const { customerName, orderDate, page = 1, limit = 10 } = req.query;

  try {
    const whereClause = {};

    if (customerName) {
      whereClause.customerName = customerName;
    }

    if (orderDate) {
      whereClause.orderDate = new Date(orderDate);
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ],
      limit,
      offset: (page - 1) * limit,
    });

    res.json({
      total: orders.count,
      pages: Math.ceil(orders.count / limit),
      orders: orders.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
app.post('/orders', async (req, res) => {
  const { customerName, orderDate, items } = req.body;

  try {
    const order = await Order.create({ customerName, orderDate });

    const orderItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity
    }));

    await OrderItem.bulkCreate(orderItems);

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit an order (can't change customer name)
app.put('/orders/:id', async (req, res) => {  
  const { orderDate, items } = req.body;

  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.update({ orderDate });

    await OrderItem.destroy({ where: { orderId: order.id } });

    const newOrderItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity
    }));

    await OrderItem.bulkCreate(newOrderItems);

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an order
app.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.destroy();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View order detail
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
