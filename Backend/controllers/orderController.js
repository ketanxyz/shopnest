const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatAddress = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;

  return `${address.fullName}\n${address.street}\n${address.city}, ${address.state} ${address.zipCode}\n${address.country}`;
};

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items || items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      address,
      paymentId,
    });
    await order.save();

    const shippingText = formatAddress(address);
    const shippingHtml = typeof address === 'string'
      ? address.replace(/\n/g, '<br/>')
      : `${address.fullName}<br/>${address.street}<br/>${address.city}, ${address.state} ${address.zipCode}<br/>${address.country}`;

    const itemRows = items.map((item) => {
      const name = item.product?.name || item.productName || 'Item';
      const qty = item.qty;
      const price = formatCurrency(item.price);
      const lineTotal = formatCurrency(item.price * qty);
      return `<tr><td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">${name}</td><td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align:center;">${qty}</td><td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align:right;">${price}</td><td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align:right;">${lineTotal}</td></tr>`;
    }).join('');

    const text = `Hi ${req.user.name},\n\nThank you for your order from ShopNest. Your order has been confirmed and is being processed.\n\nOrder ID: ${order._id}\nPayment ID: ${paymentId}\nTotal Amount: ${formatCurrency(totalAmount)}\n\nShipping Address:\n${shippingText}\n\nItems:\n${items.map((item) => {
      const name = item.product?.name || item.productName || 'Item';
      return `- ${name} x${item.qty} @ ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.qty)}`;
    }).join('\n')}\n\nIf you have any questions, reply to this email and our support team will help you.\n\nThank you for choosing ShopNest.\nThe ShopNest Team`;

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.6;">
      <h2 style="color:#1d4ed8;">Order Confirmation</h2>
      <p>Hi ${req.user.name},</p>
      <p>Thank you for shopping with <strong>ShopNest</strong>. Your order has been confirmed and is now being processed.</p>
      <div style="margin:24px 0;padding:18px;background:#f8fafc;border-radius:14px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;"><strong>Order ID:</strong> ${order._id}</p>
        <p style="margin:0 0 8px;"><strong>Payment ID:</strong> ${paymentId}</p>
        <p style="margin:0;"><strong>Order Total:</strong> ${formatCurrency(totalAmount)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:12px 8px;border-bottom:2px solid #e5e7eb;">Item</th>
            <th style="text-align:center;padding:12px 8px;border-bottom:2px solid #e5e7eb;">Qty</th>
            <th style="text-align:right;padding:12px 8px;border-bottom:2px solid #e5e7eb;">Unit Price</th>
            <th style="text-align:right;padding:12px 8px;border-bottom:2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
      <div style="margin-bottom:24px;">
        <h3 style="margin-bottom:8px;color:#0f172a;">Shipping Address</h3>
        <p style="margin:0;line-height:1.6;">${shippingHtml}</p>
      </div>
      <p>If you have any questions about your order, please reply to this email and our team will assist you.</p>
      <p>Thanks again for choosing <strong>ShopNest</strong>!</p>
      <p><strong>The ShopNest Team</strong></p>
    </div>`;

    await sendEmail(req.user.email, "ShopNest Order Confirmation", text, html);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.productId', 'name price');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      await order.save();
      res.status(200).json({ message: "Order status updated successfully", order });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
};
