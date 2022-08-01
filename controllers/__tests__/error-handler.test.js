const errorHandler = require('../../controllers/error-handler');
const { render500Error } = errorHandler;

describe('Error Handler', () => {

    it('should render 500 error', () => {
        const err = new Error('Error');
        const req = {};
        const res = {};
        const next = jest.fn('Error');
        next.mockReturnValue('Error')
        render500Error(err, req, res, next);
        expect(() => render500Error(err, req, res, next))
    }
    );
});
