const handleProductCreate = (req, res, db) => {
  const { product_name, product_detail, product_price, created_at } = req.body;
  db.transaction((trx) => {
    trx
      .insert({ product_name, product_detail, product_price, created_at })
      .into("products")
      .returning("id")
      .then((value) => {
        return res.status(200).json(value);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    return res.status(400).json("Unable to create product");
  });
};

const getAllProducts = (req, res, db) => {
  db.select("*")
    .from("products")
    .then((products) => res.status(200).json(products))
    .catch((err) => {
      console.log(err);
      return res.status(400).json("Unable to get all products");
    });
};

const getProductById = (req, res, db) => {
  db("products")
    .select("*")
    .where("id", req.params.id)
    .then((d) => res.status(200).json(d))
    .catch((err) => {
      console.log(err);
      return res.status(400).json("unable to get procuct with given id");
    });
};

const getAllSoldProducts = (req, res, db) => {
  db("sold_products")
    .select("*")
    .then((d) => {
      return res.status(200).json(d);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json("unable to get all sold products");
    });
};

const removeProduct = (req, res, db) => {
  db("products")
    .where("id", req.params.id)
    .del()
    .then((d) => res.status(200).json("Success"))
    .catch((err) => {
      console.log(err);
      return res.status(400).json("unable to delete product");
    });
};

const soldProductsBySaleId = (req, res, db) => {
  db("sold_products")
    .select("*")
    .where("sale_id", req.params.id)
    .then((d) => res.status(200).json(d))
    .catch((err) => {
      console.log(err);
      return res.status(400).json("unable to get products");
    });
};

module.exports = {
  handleProductCreate: handleProductCreate,
  getAllProducts: getAllProducts,
  getProductById,
  getAllSoldProducts,
  removeProduct,
  soldProductsBySaleId,
};
