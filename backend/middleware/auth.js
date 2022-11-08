const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("./catchAyncErrors");
const jwt = require('jsonwebtoken');
const userModel = require("../model/userModel");

// Check whether login or not
exports.isAuthenticatedUser = catchAyncErrors(
    async (req, res, next) => {
        const { token } = req.cookies;
        if (!token) return next(new ErrorHandler("Please login to access the resource", 401));

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("decodde data ", decodedData);

        // Save the user to req obj if logged in successfully
        req.user = await userModel.findById(decodedData.id);
        next();
    }
);

// Check whether admin or not
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("roles ", roles);
        console.log("role ", req.user.role);
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access the resource`, 403));
        }
        next();
    }
}