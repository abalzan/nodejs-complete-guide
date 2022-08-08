const authController = require('../../controllers/auth');
const User = require('../../models/user');
const { render500Error } = require('../../controllers/error-handler');
const bcrypt = require("bcryptjs");

jest.mock('bcryptjs');

describe('Error Handler', () => {
    it('should render 500 error', () => {
        const err = new Error('Error');
        const req = {};
        const res = {};
        const next = jest.fn('Error');
        next.mockReturnValue('Error')
        render500Error(err, req, res, next);
        expect(() => render500Error(err, req, res, next))
    });

    it('should get the login page', () => {
        const req = {
            flash: jest.fn().mockReturnValue({
                error: 'Error'
            })
        };
        const res = {
            render: jest.fn()
        };
        authController.getLogin(req, res);
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: undefined,
            oldInput: {
                email: '',
                password: ''
            },
            validationErrors: []
        });
    });

    it('should get the signup page', () => {
        const req = {
            flash: jest.fn().mockReturnValue({
                error: 'Error'
            })
        };
        const res = {
            render: jest.fn()
        };
        authController.getSignup(req, res);
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: undefined,
            oldInput: {
                email: '',
                password: '',
                confirmPassword: ''
            },
            validationErrors: []
        });
    });

    it('should post the login page', async () => {

        bcrypt.compare.mockReturnValue(true);

        User.findOne = jest.fn().mockImplementationOnce(async () => {
            return {
                email: 'test@test.com',
                password: '12345678',
                cart: { items: [] }
            };
        });
        const req = {
            session: {
                isLoggedIn: false,
                user: {
                    email: 'test@test.com',
                    password: '12345678'
                }

            },
            body: {
                email: 'test@test.com',
                password: '12345678'
            },
        }
        req.session.save = jest.fn().mockImplementation(() => {
            return true;
        });
        const res = {
            redirect: jest.fn()
        }
        await authController.postLogin(req, res, () => {});
        // expect(res.redirect).toHaveBeenCalledTimes(1);
        // expect(res.redirect).toHaveBeenCalledWith('/');

    });
});
