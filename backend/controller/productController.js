const productModel = require('../model/productModel.js');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrorHandler = require('../middleware/catchAyncErrors.js');
const APIFeatures = require('../utils/apiFeatures.js');


// Create product ==> admin
exports.createProduct = catchAsyncErrorHandler(async (req, res, next) => {

    // Save the user id who is rating the product
    req.body.user = req.user.id;    // During user auth we added user in req

    const product = await productModel.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
})

// Get all products
exports.getAllProducts = catchAsyncErrorHandler(async (req, res, next) => {
    const productsCount = await productModel.countDocuments();
    const resultPerPage = 5;
    const apiFeature = new APIFeatures(productModel.find(), req.query)
        .search()
        .filter()

    let products = await apiFeature.query;
    const filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage);
    // products = await apiFeature.query;

    res.status(200).json({
        success: true,
        productsCount,
        products,
        resultPerPage,
        filteredProductsCount
    });
})

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrorHandler(async (req, res, next) => {
    const products = await productModel.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// Update product ==> admin
exports.updateProduct = catchAsyncErrorHandler(async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        updatedProduct
    });
})

// Delete a product ==> admin
exports.deleteProduct = catchAsyncErrorHandler(async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return res.status(400).json(
            {
                success: false,
                message: "Product not found"
            }
        )
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });

})

// Get product details
exports.getProductdetails = catchAsyncErrorHandler(async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    })
})

// Create new review or Update review
exports.createProductReview = catchAsyncErrorHandler(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await productModel.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const isReviewed = product.reviews.length > 0 ? product.reviews.find(review => review.user && review.user.toString() == req.user._id.toString()) : false;
    // If already reviewd then update that review
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.ratings = product.reviews.forEach(rev => {
        avg += rev.rating;
    })
    product.reviews = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        product
    })
})

// Get all reviews of a product
exports.getAllReviews = catchAsyncErrorHandler(async (req, res, next) => {
    const product = await productModel.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete a review
exports.deleteReview = catchAsyncErrorHandler(async (req, res, next) => {
    const product = await productModel.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.reviewId.toString());
    const noOfReviews = reviews.length;
    let avg = 0;
    product.reviews.forEach(rev => avg += rev.rating);
    const ratings = avg / noOfReviews;

    await productModel.findByIdAndUpdate(
        req.query.id,
        {
            reviews,
            noOfReviews,
            ratings
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

    res.status(200).json({
        success: true,
        product
    })
})