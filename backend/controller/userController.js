const userModel = require('../model/userModel');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrorHandler = require('../middleware/catchAyncErrors.js');
const sendToken = require('../utils/jwtToken');

// Register a user
exports.register = catchAsyncErrorHandler(
    async (req, res, next) => {
        const { name, email, password } = req.body;

        const user = await userModel.create({
            name, email, password,
            avatar: {
                public_id: "sanple public id",
                url: "sample avatar url"
            }
        });

        sendToken(user, 201, res);

    }
)

// Login user
exports.loginUser = catchAsyncErrorHandler(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        const isPasswordMatched = user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        sendToken(user, 200, res);

    }
);

// Logout User
exports.logoutUser = catchAsyncErrorHandler(
    async (req, res, next) => {
        res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
        res.status(200).json(
            {
                success: true,
                message: "Logged out successfully"
            }
        )
    }
);