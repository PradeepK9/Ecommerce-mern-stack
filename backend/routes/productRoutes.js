const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductdetails, createProductReview, getAllReviews, deleteReview } = require('../controller/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route('/admin/products').get(getAllProducts);
router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
router.route('/product/:id').get(getProductdetails);
router.route('/review').put(isAuthenticatedUser, createProductReview).delete(deleteReview);
router.route('/reviews').get(getAllReviews);


module.exports = router;