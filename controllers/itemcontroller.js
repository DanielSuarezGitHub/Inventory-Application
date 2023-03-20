const Category = require('../models/category')
const async = require('async')
const Item = require('../models/item')
const { body, validationResult } = require("express-validator");
exports.index = async (req, res) => {
   let categories = await Category.find()
    res.render('index', {
        categories: categories
    })
}

exports.createItem_get = (req, res) => {
    async.parallel({
        categories(callback) {
            Category.find().exec(callback)
        },

    },
    function (err, results) {
        if (err) {
            return next(err)
        }
        res.render('createItemForm',{
            categories: results.categories
        })    
    })
}

exports.deleteItem_get = async (req, res) => {
  let item =  await Item.findById(req.params.id)
  res.render('itemDelete', {
    item: item
  })
}

exports.updateItem_get = (req, res, next) => {
    async.parallel({
      categories(callback) {
        Category.find().exec(callback);
      },
      itemInfo(callback) {
        Item.findById(req.params.id).exec(callback);
      }
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('itemUpdateForm', {
        categories: results.categories,
        itemInfo: results.itemInfo
      });
    });
  };
  
exports.readItem_get = (req, res, next) => {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
            .populate("category")
            .exec(callback)
        }
    },
    function (err, results) {
        if (err) {
            return next(err)
        }
        if (results.item == null) {
            let err = new Error('item not found')
            err.status = 404
            return next(err)
        }
        res.render('itemInfo', {
         price: results.item.price,
         name: results.item.name,
         stock: results.item.stock,
         category: results.item.category,
         id: req.params.id  
        })
    }
    )
} 


exports.createItem_post = [
  body('name')
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage('name is required'),

  body('price')
    .trim()
    .isFloat({ min: 0 })
    .withMessage('price is invalid'),

  body('stock')
    .trim()
    .isInt({ min: 0 })
    .withMessage('quantity is invalid'),

  body('category').notEmpty().withMessage('select a category'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Category.find({})
      .then((categories) => {
        res.render('createItemForm', {
            categories: categories,
            errors: errors.errors
        })
      })
    } else {
        const createdItem = new Item({
            price: req.body.price,
            name: req.body.name,
            stock: req.body.stock,
            category: req.body.category,
        })
        createdItem.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect(createdItem.url)
        })
    }
  },
];


exports.deleteItem_post = async (req, res) => {
   let item = await Item.findById(req.params.id)
   .populate('category')
   await Item.deleteOne({ _id: req.params.id })
   res.redirect(item.category.url)
}

exports.updateItem_post = [
    body('name')
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage('name is required'),

  body('price')
    .trim()
    .isFloat({ min: 0 })
    .withMessage('price is invalid'),

  body('stock')
    .trim()
    .isInt({ min: 0 })
    .withMessage('quantity is invalid'),

  body('category').notEmpty().withMessage('select a category'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        async.parallel({
            categories(callback) {
                Category.find().exec(callback)
            },
            itemInfo(callback) {
                Item.findById(req.params.id).exec(callback)
            },
        },
        function (err, results) {
            if (err) {
                return next(err)
            }
            return res.render('itemUpdateForm', {
                categories: results.categories,
                itemInfo: results.itemInfo,
                errors: errors.errors
            })
        });
    } else {
        const item = new Item({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            _id: req.params.id,
          });
    
          Item.updateOne({ _id: req.params.id }, item, {}, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect(item.url);
          });
    }
  }
]
