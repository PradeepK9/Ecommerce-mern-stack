const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductdetails } = require('../controller/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route('/products').get(getAllProducts);
router.route('/product/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
    .get(getProductdetails);


module.exports = router;