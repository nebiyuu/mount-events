const express = require('express');
const router = express.Router();
const discountController = require('../../controller/discountController');

router.post('/create', discountController.createDiscount);

module.exports = router;