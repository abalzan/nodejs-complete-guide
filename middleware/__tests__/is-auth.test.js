const authMiddleware = require('../../middleware/is-auth');

describe('isAuth middleware', () => {
    it('should return 401 if user is not logged in', () => {
        const req = {
            session: {
                isLoggedIn: false
            }
        };
        const res = {
            isLoggedIn: false,
            redirect: jest.fn()
        };
        authMiddleware(req, res, () => {});
        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(res.isLoggedIn).toBe(false);
    });

    it('should call next if user is logged in', () => {
        const req = {
            session: {
                isLoggedIn: true
            }
        };
        const res = {
            isLoggedIn: true,
            json: jest.fn().mockReturnThis(),
        };

        authMiddleware(req, res, () => {});
        expect(res.isLoggedIn).toBe(true);
    });
});
