const Product = require('../models/product');
const Order = require('../models/order');
const {render500Error} = require("./error-handler");
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
            });
        })
        .catch(err => {
            return render500Error(err, req, res, next);
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            return render500Error(err, req, res, next);
        });
}

exports.getIndex = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(err => {
        return render500Error(err, req, res, next)
    });
}

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        }).catch(err => {
        return render500Error(err, req, res, next)
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            req.user.addToCart(product);
            res.redirect('/cart');
        }).catch(err => {
        return render500Error(err, req, res, next)
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(() => {
            res.redirect('/cart');
        }).catch(err => {
        return render500Error(err, req, res, next)
    });
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(item => {
                return { quantity: item.quantity, product: { ...item.productId } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
        return order.save();
    }).then(() => {
        return req.user.clearCart();
    }).then(() => {
        res.redirect('/orders');
    }).catch(err => {
        return render500Error(err, req, res, next)
    });
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
            });
        }).catch(err => {
            return render500Error(err, req, res, next)
    });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName); // path /data/invoices/invoice-orderId.pdf

            const pdfDoc = new pdfDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('---------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price);
            });
            pdfDoc.text('---');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
            pdfDoc.end();

        }).catch(err => {
        return render500Error(err, req, res, next)
    });
};

