const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const { Product } = require("../models/product");
const Order = require("../models/order");
//add product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const { name, price, description, category, images, quantity } = req.body;
    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
    });
    product = await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/admin/get-products", admin, async (req, res) => {
  try {
    const products = await Product.find({});

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//delete the product
adminRouter.post("/admin/delete-product", admin, async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findByIdAndDelete(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/admin/get-orders", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ eror: err.message });
  }
});

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try{
    const {id, status} = req.body;
    let order = await Order.findById(id) ;
    order.status = status;
    order = await order.save();
    res.json(order);
  }
catch(errorcito){
    res.status(500).json({errorcito: errorcito.message});
  }
});

adminRouter.get("/admin/analytics", admin, async (req, res) => {
  try{
    const orders = await Order.find({});
    let totalEarnings = 0;

    for(let i = 0; i< orders.length; i++){
      for(let j =0; j<orders[i].products.length; j++){
        totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product
      }
    }
    //category wise order fetching
    let acadeicEarnings =  await fetchCategoryWiseProduct('Academic');
    let companyEarnings = await fetchCategoryWiseProduct('Company');
    let purposeEarnings =  await fetchCategoryWiseProduct('Purpose');
    let enviromentalEarnings = await fetchCategoryWiseProduct('Enviromental');
    let carrerEarnings = await fetchCategoryWiseProduct('Carrer');

    let earnings = {
      totalEarnings,
      acadeicEarnings,
      companyEarnings,
      purposeEarnings,
      enviromentalEarnings,
      carrerEarnings,
    }

    res.json(earnings);
  }catch(errorcito){
    res.status(500).json({errorcito: errorcito.message});
  }
});

async function fetchCategoryWiseProduct(category){
  let earnings = 0;
  let catgoryOrders = await Order.find({
    'products.product.category': category,
  });
  for(let i = 0; i< catgoryOrders.length; i++){
    for(let j =0; j<catgoryOrders[i].products.length; j++){
      totalEarnings += catgoryOrders[i].products[j].quantity * catgoryOrders[i].products[j].product
    }
  }
  return earnings;
}

module.exports = adminRouter;
