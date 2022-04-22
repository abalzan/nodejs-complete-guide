const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.findByPk(id).then(product => {
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        return product.save();
    }).then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
    //find the products created by the logged user
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl
    }).then(result => {
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findByPk(id).then(product => {
        return product.destroy();
    }).then(() => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findByPk(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

