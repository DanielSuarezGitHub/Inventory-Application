const express = require('express')
const router = express.Router();

const item_Controller = require("../controllers/itemcontroller.js")
const category_Controller = require("../controllers/categorycontroller.js")

/* item routes */

router.get('/', item_Controller.index)

router.get('/item/create', item_Controller.createItem_get)
router.get('/item/:id/update', item_Controller.updateItem_get)
router.get('/item/:id', item_Controller.readItem_get)
router.get('/item/:id/delete', item_Controller.deleteItem_get)
router.post('/item/create', item_Controller.createItem_post)
router.post('/item/:id/update', item_Controller.updateItem_post)
router.post('/item/:id/delete', item_Controller.deleteItem_post)

router.get('/category/create', category_Controller.createCategory_get);
router.get('/category/:id/update', category_Controller.updateCategory_get);
router.get('/category/:id', category_Controller.readCategory_get);
router.get('/category/:id/delete', category_Controller.deleteCategory_get);

// POST requests
router.post('/category/create', category_Controller.createCategory_post);
router.post('/category/:id/update', category_Controller.updateCategory_post);
router.post('/category/:id/delete', category_Controller.deleteCategory_post);

module.exports = router;



module.exports = router