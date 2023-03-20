#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Item = require('./models/item')
const Category = require('./models/category')



const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const categorys = []
const items = []

function categoryCreate(name, description, cb) {
  const category = new Category({
    name: name,
    description: description
  });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categorys.push(category);
    cb(null, category);
  });
}

function itemCreate(price, name, stock, category, cb) {
  const item = new Item({
    price: price,
    name: name,
    stock: stock,
    category: category
  });

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  });
}
function createItemCategories(cb) {
  async.series([
    function(callback) {
      categoryCreate("Electronics", "Electronic devices and accessories.", callback);
    },
    function(callback) {
      categoryCreate("Clothing", "Clothing items and accessories.", callback);
    },
    function(callback) {
      categoryCreate("Books", "Novels and non-fiction books.",callback);
    },
    function(callback) {
      itemCreate(25, "Apple AirPods Pro", 10, categorys[0], callback);
    },
    function(callback) {
      itemCreate(1999, "Dell XPS 13", 3, categorys[0], callback);
    },
    function(callback) {
      itemCreate(129, "Nike Air Jordan 1", 5, categorys[1], callback);
    },
    function(callback) {
      itemCreate(49, "Zara Men's Shirt", 8, categorys[1], callback);
    },
    function(callback) {
      itemCreate(15, "To Kill a Mockingbird", 12, categorys[2], callback);
    },
    function(callback) {
      itemCreate(22, "The Lord of the Rings", 18, categorys[2], callback);
    }
  ],
  // optional callback
  cb);
}


async.series([
    createItemCategories
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('sucess');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
