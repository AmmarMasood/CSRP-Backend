const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

require("dotenv").config();

// const register = require('./controllers/register.js');
// const signIn = require('./controllers/signIn.js');
// const profile = require('./controllers/profile.js');
// const image = require('./controllers/image.js');
const products = require("./controllers/products");
const sales = require("./controllers/sales");
const customers = require("./controllers/customers");
const claims = require("./controllers/claims");
const auth = require("./controllers/auth");
const employees = require("./controllers/employees");
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("app is working!");
});
// register a new employee
app.post("/register", (req, res) => {
  auth.handleRegister(req, res, db, bcrypt);
});

// login
// register a new employee
app.post("/login", (req, res) => {
  auth.handleSignIn(req, res, db, bcrypt);
});

// cproducts
app.post("/product/create", (req, res) => {
  products.handleProductCreate(req, res, db);
});
app.get("/product/all", (req, res) => {
  products.getAllProducts(req, res, db);
});

app.delete("/products/:id", (req, res) => {
  products.removeProduct(req, res, db);
});

app.get("/soldProducts/saleId/:id", (req, res) => {
  products.soldProductsBySaleId(req, res, db);
});

app.post("/sale/create", (req, res) => {
  sales.handleSaleCreate(req, res, db);
});
app.get("/sale/all", (req, res) => {
  sales.getAllSales(req, res, db);
});

app.delete("/sale/:id", (req, res) => {
  sales.removeSale(req, res, db);
});

app.get("/sale/customer/:id", (req, res) => {
  sales.salesByCustomerId(req, res, db);
});
app.post("/customer/create", (req, res) => {
  customers.handleCustomerCreate(req, res, db);
});
app.get("/customer/all", (req, res) => {
  customers.getAllCustomers(req, res, db);
});

app.post("/customers/sendEmail/:id", (req, res) => {
  customers.sendEmail(req, res, db);
});
app.get("/customers/:id", (req, res) => {
  customers.getCustomerById(req, res, db);
});

app.delete("/customers/:id", (req, res) => {
  customers.removeCustomer(req, res, db, sales.removeSale);
});

app.post("/claim/create", (req, res) => {
  claims.handleClaimrCreate(req, res, db);
});

app.delete("/claims/:id", (req, res) => {
  claims.removeClaim(req, res, db);
});
app.get("/claim/all", (req, res) => {
  claims.getAllClaims(req, res, db);
});

app.put("/claims/update", (req, res) => {
  claims.updateClaim(req, res, db);
});

app.get("/employees/:id", (req, res) => {
  employees.getEmployeeById(req, res, db);
});

app.get("/products/:id", (req, res) => {
  products.getProductById(req, res, db);
});

app.get("/soldProducts/all", (req, res) => {
  products.getAllSoldProducts(req, res, db);
});

// app.post('/register', (req, res) => {
//   register.handleRegister(req, res, db, bcrypt)
// })
// app.get('/profile/:id', (req, res) => {
//   profile.handleProfile(req, res, db)
// })
// app.put('/image', (req, res) => {
//   image.handleImage(req, res, db)
// })
// app.post('/imageUrl', (req, res) => {
//   image.handleApiCalls(req, res)
// })

app.listen(process.env.PORT || 5000, () => {
  console.log(`app is running on ${process.env.PORT}`);
});
