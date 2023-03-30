const userModel = require('../model/userModel');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrorHandler = require('../middleware/catchAyncErrors.js');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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

        const isPasswordMatched = await user.comparePassword(password);

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

// Forgot Password
exports.forgotPassword = catchAsyncErrorHandler(
    async (req, res, next) => {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Get reset password token
        const resetToken = user.getResetPasswordToken();

        // save the resetPasswordToken and resetPasswordExpire to db 
        await user.save({ validateBeforeSave: false })

        const resetPasswordUrl = `${req.protocal}//:${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const message = `Your reset password token is :- \n\n${resetPasswordUrl} \n\nIf you have not rquested this mail, please ignore it. `

        try {
            await sendEmail(
                {
                    email: user.email,
                    subject: "Ecommerce Password Recovery",
                    message
                }
            );
            res.send({
                success: true,
                message: `Email sent to ${user.email} successfully`
            })

        } catch (error) {
            // remove saved data from DB
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new ErrorHandler(error.message, 500));
        }
    }
)

// Reset Password
exports.resetPassword = catchAsyncErrorHandler(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrorHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// change User password
exports.changePassword = catchAsyncErrorHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrorHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    // if (req.body.avatar !== "") {
    //     const user = await userModel.findById(req.user.id);

    //     const imageId = user.avatar.public_id;

    //     await cloudinary.v2.uploader.destroy(imageId);

    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //         folder: "avatars",
    //         width: 150,
    //         crop: "scale",
    //     });

    //     newUserData.avatar = {
    //         public_id: myCloud.public_id,
    //         url: myCloud.secure_url,
    //     };
    // }

    const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user
    });
});

// Get all users (admin)
exports.getAllUser = catchAsyncErrorHandler(async (req, res, next) => {
    const users = await userModel.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrorHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrorHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    await userModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrorHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }

    // const imageId = user.avatar.public_id;

    // await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});
