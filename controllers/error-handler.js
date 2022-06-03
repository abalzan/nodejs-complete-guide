function render500Error(err, req, res, next) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
}
exports.render500Error = render500Error;
