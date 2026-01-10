const { Server } = require('socket.io');

let io = null;

// Track viewers per product page: { productId: Set<socketId> }
const productViewers = new Map();

// Recent purchase notifications (in-memory ring buffer, max 20)
const recentPurchases = [];
const MAX_RECENT_PURCHASES = 20;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User starts viewing a product page
    socket.on('view-product', (productId) => {
      if (!productId) return;

      // Leave any previous product room
      if (socket.currentProduct) {
        leaveProduct(socket);
      }

      socket.currentProduct = productId;
      socket.join(`product:${productId}`);

      if (!productViewers.has(productId)) {
        productViewers.set(productId, new Set());
      }
      productViewers.get(productId).add(socket.id);

      // Broadcast updated viewer count to everyone on this product page
      const count = productViewers.get(productId).size;
      io.to(`product:${productId}`).emit('viewer-count', {
        productId,
        count,
      });
    });

    // User leaves a product page
    socket.on('leave-product', () => {
      leaveProduct(socket);
    });

    // Send recent purchase notifications to newly connected users
    socket.emit('recent-purchases', recentPurchases.slice(-5));

    socket.on('disconnect', () => {
      leaveProduct(socket);
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function leaveProduct(socket) {
  const productId = socket.currentProduct;
  if (!productId) return;

  socket.leave(`product:${productId}`);

  if (productViewers.has(productId)) {
    productViewers.get(productId).delete(socket.id);
    const count = productViewers.get(productId).size;

    if (count === 0) {
      productViewers.delete(productId);
    } else {
      io.to(`product:${productId}`).emit('viewer-count', {
        productId,
        count,
      });
    }
  }

  socket.currentProduct = null;
}

// Called from order controller when a purchase is completed
function emitPurchaseNotification(purchaseData) {
  if (!io) return;

  const notification = {
    id: `purchase_${Date.now()}`,
    productTitle: purchaseData.productTitle || 'an item',
    city: purchaseData.city || 'somewhere',
    timestamp: new Date().toISOString(),
  };

  recentPurchases.push(notification);
  if (recentPurchases.length > MAX_RECENT_PURCHASES) {
    recentPurchases.shift();
  }

  // Broadcast to all connected clients
  io.emit('purchase-notification', notification);
}

function getIO() {
  return io;
}

module.exports = { initSocket, emitPurchaseNotification, getIO };
