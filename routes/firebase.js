// Use the express.Router class to create modular, mountable route handlers. 
// A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
const router = require("express").Router();

// Firebase server validation and connection
const admin = require("firebase-admin");
const serviceAccount = require("../configuration/test-3ad87-bc8cc74b3d08.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// bodyParser.urlencoded(options) Parses the text as URL encoded data 
// (which is how browsers tend to send form data from regular forms set to POST) 
// and exposes the resulting object (containing the keys and values) on req.body
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({extended: true}));

// bodyParser.json(options)Parses the text as JSON and exposes the resulting object on req.body.
router.use(bodyParser.json());


// routes for post request for orders and products
router.post("/collectedOrder", function (req, res) {
  db.collection('orders').doc(req.body.orderId).update({ archived_status: true });
  db.collection('orders').doc(req.body.orderId).update({ order_status: true });
  return res.status(202).send(true);
});

router.post("/acceptedOrder", function (req, res) {
  db.collection('orders').doc(req.body.orderId).update({ order_status: true });
  return res.status(202).send(true);
});

router.post("/canceledOrder", function (req, res) {
  db.collection('orders').doc(req.body.orderId).update({ archived_status: true });
  db.collection('orders').doc(req.body.orderId).update({ order_status: false });
  return res.status(202).send(true);
});

router.post("/deletedProduct", function (req, res) {
  db.collection('coffeeshops/' + req.body.shopId + '/products').doc(req.body.productId).delete();
  return res.status(202).send(true);
});


// sets the current coffeshop
let currentCoffeeshopFirebaseId = "Express Coffee";


// route for fb database orders 
router.get("/orders", (req, res) => {

  let orders = []
  let number_of_orders

  // Getting the snapshot of the order collection
  db.collection('orders')
  .where("archived_status", "==", false)
  .where("coffeeshop_id", "==", currentCoffeeshopFirebaseId)
  .get().then(productSnapshot => {
    
    number_of_orders = productSnapshot.size

    // iterating over the order snapshot
    productSnapshot.forEach(orderDoc => {

      // creating an order object and assigning the ID and the rest of the information from the database
      let order = {
        id: orderDoc.id,
        archived_status: orderDoc.data().archived_status,
        customer_name: orderDoc.data().customer_name,
        coffeeshop_id: orderDoc.data().coffeeshop_id,
        user_id: orderDoc.data().user_id,
        date: orderDoc.data().date,
        comments: orderDoc.data().comments,
        time: orderDoc.data().time,
        total: orderDoc.data().total,
        order_status: orderDoc.data().order_status,
        products: []
      }

      // using the id, to get the products from the subcollection
      db.collection('orders/' + order.id + '/products').get().then(productSnapshot => {

        // iterating over the product snapshot
        productSnapshot.forEach(productDoc => {
          // creating a product object
          let product = {
            name: productDoc.data().name,
            price: productDoc.data().price
          }

          // then we push the product object to the list of products in the order object
          order.products.push(product)

        });

        // we are finished iterating over the productsnapshot and now we can push it to the orders list
        orders.push(order)

        // checks if the list is filled with everything from the database
        if (orders.length == number_of_orders) {
          return res.json(orders)
        }
      });
    });
  });
});


// Adds new product to coffeshop menu
router.post("/newProduct", (req, res) => {
  //console.log(req.body)
  
  let newProduct = {
    name: req.body.itemName,
    price: req.body.itemPrice,
    size: req.body.itemSize,
    quantity: req.body.itemQuantity
  };

  db.collection('coffeeshops').doc(currentCoffeeshopFirebaseId).collection("products").add(newProduct);
  return res.status(202).send(true);
});


// Route for fb products 
router.get("/products", (req, res) => {
  let products = []

  // Getting the snapshot of the order collection
  db.collection('coffeeshops/').doc(currentCoffeeshopFirebaseId).get().then(coffeshopSnapshot => {
    if (!coffeshopSnapshot.exists) {
      console.log('No such document!');
    }
    else {
      // Creating an order object and assigning the ID and the rest of the information from the database
      let coffeeshop = {
        id: coffeshopSnapshot.id,
        coordinates: coffeshopSnapshot.data().coordinates,
        marker_description: coffeshopSnapshot.data().marker_description,
        name: coffeshopSnapshot.data().name,
        products: []
      };

      // Using the id, to get the products from the subcollection
      db.collection('coffeeshops/' + coffeeshop.id + '/products').get().then(productSnapshot => {

        // Iterating over the product snapshot
        productSnapshot.forEach(productDoc => {
          // Creating a product object
          let product = {
            id: productDoc.id,
            name: productDoc.data().name,
            price: productDoc.data().price,
            size: productDoc.data().size,
            quantity: productDoc.data().quantity
          }

          // Then we push the product object to the list of products in the order object
          coffeeshop.products.push(product)

        });

        // We are finished iterating over the productsnapshot and now we can push it to the orders list
        products.push(coffeeshop)

        return res.json(products)
      });
    };
  });
});
  

// route for fb database archive 
router.get("/archive", (req, res) => {

  let orders = []
  let number_of_orders

  // Getting the snapshot of the order collection
  db.collection('orders')
  .where("archived_status", "==", true)
  .where("coffeeshop_id", "==", currentCoffeeshopFirebaseId)
  .get().then(productSnapshot => {
    
    number_of_orders = productSnapshot.size

    // iterating over the order snapshot
    productSnapshot.forEach(orderDoc => {

      // creating an order object and assigning the ID and the rest of the information from the database
      let order = {
        id: orderDoc.id,
        archived_status: orderDoc.data().archived_status,
        customer_name: orderDoc.data().customer_name,
        coffeeshop_id: orderDoc.data().coffeeshop_id,
        user_id: orderDoc.data().user_id,
        date: orderDoc.data().date,
        comments: orderDoc.data().comments,
        time: orderDoc.data().time,
        total: orderDoc.data().total,
        order_status: orderDoc.data().order_status,
        products: []
      }

      // using the id, to get the products from the subcollection
      db.collection('orders/' + order.id + '/products').get().then(productSnapshot => {

        // iterating over the product snapshot
        productSnapshot.forEach(productDoc => {
          // creating a product object
          let product = {
            name: productDoc.data().name,
            price: productDoc.data().price
          }

          // then we push the product object to the list of products in the order object
          order.products.push(product)

        });

        // we are finished iterating over the productsnapshot and now we can push it to the orders list
        orders.push(order)

        // checks if the list is filled with everything from the database
        if (orders.length == number_of_orders) {
          return res.json(orders)
        }
      });
    });
  });
});

// Used to export routes so they are accessible 
module.exports = router