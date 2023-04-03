const orderModel = require('../model/orderModel');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrorHandler = require('../middleware/catchAyncErrors.js');
const productModel = require('../model/productModel');

const createOrder = catchAsyncErrorHandler(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        oderStatus
    } = req.body;
    const product = await orderModel.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        oderStatus,
        user: req.user._id,
        paidAt: Date.now()
    });
    res.status(201).json(product);
})

// get order details - admin
const getOrderDetails = catchAsyncErrorHandler(async(req, res, next) => {
    // here populate will return name and email of that user from User model
    const order = await orderModel.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json(
        {
            success: true,
            order
        }
    )
})

// get all orders - user
const myOrders = catchAsyncErrorHandler( async(req, res, next) => {
    const orders = await orderModel.find({user:req.user._id});
    if(!orders) return next(new ErrorHandler("You din't place any order","404"));
    res.status(200).json(
        {
            success: true,
            orders
        }
    )
})

// get all orders - admin
const getAllOrders = catchAsyncErrorHandler( async(req, res, next) => {
    const orders = await orderModel.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })
    res.status(200).json(
        {
            success: true,
            totalAmount,
            orders
        }
    )
});

// update order status - admin
const updateOrder = catchAsyncErrorHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    console.log(order.orderStatus);
    console.log(order.orderStatus.toLowerCase());

  
    if (order.orderStatus.toLowerCase() === "delivered") {
      return next(new ErrorHandler("The order is already delivered.", 400));
    }
  
    if (req.body.status.toLowerCase() === "shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }

    order.orderStatus = req.body.status;
  
    if (req.body.status.toLowerCase() === "delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    
    res.status(200).json({
      success: true,
      message: "Order updated successfully"
    });
  });

  async function updateStock(id, quantity) {
    const product = await productModel.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  };

// delete Order -- Admin
const deleteOrder = catchAsyncErrorHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    await order.remove();
  
    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
  });

module.exports = {
    createOrder,
    getOrderDetails,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
};
