const productModel = require('../model/productModel.js');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrorHandler = require('../middleware/catchAyncErrors.js')


// Create product ==> admin
exports.createProduct = catchAsyncErrorHandler(async (req, res, next) => {
    const product = await productModel.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
})

// Get all products
exports.getAllProducts = catchAsyncErrorHandler( async (req, res, next) => {
    const products = await productModel.find();
    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
})

// Update product ==> admin
exports.updateProduct = catchAsyncErrorHandler( async (req, res, next) => {
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
exports.deleteProduct = catchAsyncErrorHandler( async (req, res, next) => {
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
exports.getProductdetails = catchAsyncErrorHandler( async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    })
})