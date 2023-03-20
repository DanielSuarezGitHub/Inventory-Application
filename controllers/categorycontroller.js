const Category = require('../models/category')
const Item = require('../models/item')
const async = require('async')
const { body, validationResult } = require("express-validator");

exports.createCategory_get = (req, res) => {
    res.render('createCategoryForm')
}

exports.updateCategory_get = (req, res) => {
    async.parallel({
        categoryInfo(callback) {
          Category.findById(req.params.id).exec(callback);
        }
      }, function (err, results) {
        if (err) {
          return next(err);
        }
        console.log(results.categoryInfo)
        res.render('categoryUpdateForm', {
          categoryInfo: results.categoryInfo
        });
      });
}

exports.readCategory_get = (req, res, next) => {
    async.parallel({
        category(callback) {
            Category.findById(req.params.id)
                .exec(callback)
        },
        category_results(callback) {
            Item.find({ category: req.params.id })
                .exec(callback)
        }
    },
    function(err, results) {
        if (err) {
            return next(err)
        }
        if(!results.category || !results.category_results) {
            let err = new Error('Category not found')
            err.status = 404
            return next(err)
        }
        res.render('CategoryInfo', {
            title: 'Category Information',
            category: results.category,
            item_list: results.category_results,
            id: req.params.id
        })
    })
}

exports.deleteCategory_get = async (req, res) => {
    let category = await Category.findById(req.params.id)
    res.render('categoryDelete', {
        category: category
    })
}

exports.createCategory_post = [
    body('name')
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage('Category Name is not valid'),

        body('description')
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage('Category Description is not valid'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('createCategoryForm', {
                errors: errors.errors
            })
        } else {
            const createdCategory = new Category({
                name: req.body.name,
                description: req.body.description
            })
            createdCategory.save((err) => {
                if (err) {
                    return next(err)
                }
                res.redirect(createdCategory.url)
            })
        }
    }
]

exports.updateCategory_post = [
        body('name')
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage('Category Name is not valid'),

        body('description')
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage('Category Description is not valid'),

       async (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
             const categoryInfo = await Category.findById(req.params.id)
             res.render('categoryUpdateForm', {
                errors: errors.errors,
                categoryInfo: categoryInfo
             })
            } else {
                const category = new Category({
                    name: req.body.name,
                    description: req.body.description,
                    _id: req.params.id
                })

                Category.updateOne({ _id: req.params.id}, category, {}, (err) => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(category.url)
                })
            }
        }
]
exports.deleteCategory_post = async (req, res) => {
    await Item.deleteMany({ category: req.params.id })
    await Category.deleteOne({ _id: req.params.id })
    res.redirect('/')
}
