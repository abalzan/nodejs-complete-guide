const adminController = require('../admin');
const Product = require('../../models/product');

jest.mock('../../models/product');

describe('Admin Controller', () => {
    it('should get the add product page', () => {
        const req = {};
        const res = {
            render: jest.fn()
        };
        adminController.getAddProduct(req, res);
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('admin/edit-product', {
            editing:  false,
            hasError: false,
            errorMessage: null,
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            validationErrors: []
        });
    });

    it('should get the edit product page', async() => {
        Product.findById = jest.fn().mockImplementationOnce(async() => {
            return {
                title: 'test',
                price: '10',
                description: 'test',
                imageUrl: 'test',
            }
        });
       const req = {
            params: {
                productId: '1',
            },
            query: {
                edit: 'true'
            }
        };
        const res = {
            render: jest.fn()
        };
        await adminController.getEditProduct(req, res, () => {});
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('admin/edit-product', {
            editing:  'true',
            hasError: false,
            errorMessage: null,
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: {
                description: 'test',
                imageUrl: 'test',
                price: '10',
                title: 'test',
            },
            validationErrors: []
        });
    });

    it('should get the products page', async() => {
        Product.find = jest.fn().mockImplementationOnce(async() => {
            return [{
                title: 'test',
                price: '10',
                description: 'test',
                imageUrl: 'test',
            }]
        });
        const req = {
            user: {
                _id: '1',
            }
        };
        const res = {
            render: jest.fn()
        };
        await adminController.getProducts(req, res, () => {});
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('admin/products', {
            prods: [
                {
                    description: 'test',
                    imageUrl: 'test',
                    price: '10',
                    title: 'test',
                }
            ],
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });

    it('should get the post edit product page', async() => {
        Product.save = jest.fn().mockImplementationOnce(async() => {
            return {
                title: 'test',
                price: '10',
                description: 'test',
                imageUrl: 'test',
            }
        });
        Product.findById = jest.fn().mockImplementationOnce(async() => {
            return {
                title: 'test',
                price: '10',
                description: 'test',
                imageUrl: 'test',
                userId: '1',
            }
        });

        const req = {
            user: {
                _id: '1',
            },
            body: {
                productId: '1',
                title: 'test',
                price: '10',
                description: 'test',
                imageUrl: 'test',
            },
        };
        const res = {
            redirect: jest.fn()
        };
        // save = jest.fn().mockResolvedValue(this.data);
        await adminController.postEditProduct(req, res, () => {});

        // expect(res.redirect).toHaveBeenCalledTimes(1);
        // expect(res.redirect).toHaveBeenCalledWith('/admin/products');
    });


    it('should delete product', async() => {
        Product.findById = jest.fn().mockImplementationOnce(async() => {
            return {
                title: 'test',
                price: '10',
                description: 'test',
                imageUrl: 'test',
                userId: '1',
            }
        });
        Product.deleteOne = jest.fn().mockResolvedValue();
        const req = {
            params: {
                productId: '1',
            },
            user: {
                _id: '1',
            }
        };
        const res = {
            status: jest.fn().mockReturnValueOnce({
                json: jest.fn().mockReturnValueOnce({})
            })
        }
        await adminController.deleteProduct(req, res, () => {});
        // expect(res.status.jso).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    // it('should add a product', async() => {
    //     Product.save = jest.fn().mockImplementationOnce(async() => {
    //         return {
    //             title: 'test',
    //             price: '10',
    //             description: 'test',
    //             imageUrl: 'test',
    //         }
    //     });
    //     const req = {
    //         body: {
    //             title: 'test',
    //             price: '10',
    //             description: 'test',
    //         },
    //         file: {
    //             path: 'test',
    //             filename: 'test',
    //             mimetype: 'test',
    //         },
    //     }
    //     const res = {
    //         redirect: jest.fn()
    //     }
    //     await adminController.postAddProduct(req, res, () => {});
    //     expect(res.redirect).toHaveBeenCalledTimes(1);
    //     expect(res.redirect).toHaveBeenCalledWith('/admin/products');
    // });

    it('should throw an error if there is no image in add product', async() => {
        Product.save = jest.fn().mockImplementationOnce(async() => {
            return {
                title: 'test',
                price: '10',
                description: 'test',
                imageUrl: 'test',
            }
        });
        const req = {
            body: {
                title: 'test',
                price: '10',
                description: 'test',
            },
        }
        const res = {
            status: jest.fn().mockReturnValue({
                render: jest.fn()
            })
        }
        await adminController.postAddProduct(req, res, () => {});
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.status().render).toHaveBeenCalledWith('admin/edit-product', {
            editing:  false,
            hasError: true,
            errorMessage: 'Attached file is not a supported image. Please upload a JPG, PNG or JPEG file.',
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: {
                description: 'test',
                price: '10',
                title: 'test',
            },
            validationErrors: [],
        });
    });
});
