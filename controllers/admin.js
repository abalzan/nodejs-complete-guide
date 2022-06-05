const {validationResult} = require('express-validator');
const Product = require('../models/product');
const { render500Error } = require('./error-handler');
const fileHelper = require('../util/file');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
});
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not a supported image. Please upload a JPG, PNG or JPEG file.',
            validationErrors: []
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    const imageUrl = image.path;
    const product = new Product( {title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user});
    product.save().then(() => {
        res.redirect('/admin/products');
    }).catch(err => {
        return render500Error(err, req, res, next);
    });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description,
                _id: id

            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    Product.findById(id).then(product => {
        if(product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = title;
        product.price = price;
        product.description = description;
        if (image) {
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        }
        return product.save().then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        }).catch(err => {
            return render500Error(err, req, res, next);
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id}).then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    }).catch(err => {
        return render500Error(err, req, res, next);
    });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findById(id).then(product => {
        if (!product) {
            return next(new Error('Product not found.'));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({_id: id, userId: req.user._id});
    }).then(() => {
       console.log('DESTROYED PRODUCT');
       res.redirect('/admin/products');
   }).catch(err => {
       return render500Error(err, req, res, next);
   });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: [],
            });
        })
        .catch(err => {
            return render500Error(err, req, res, next);
        });
};

