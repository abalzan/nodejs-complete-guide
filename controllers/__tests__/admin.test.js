const adminController = require('../admin');

describe('Admin Controller', () => {
    it('should get the add product page', () => {
        const req = {};
        const res = {
            render: jest.fn()
        };
        adminController.getAddProduct(req, res);
        expect(res.render).toHaveBeenCalled();
    });
});
