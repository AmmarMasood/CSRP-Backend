const addItemsToSold = (product, saleId, db) => {
  console.log(product, saleId);
  db.transaction((trx) => {
    trx
      .insert({
        sale_id: saleId,
        product_id: product.productId,
        product_quantity: product.quantity,
        product_name: product.productName,
      })
      .into("sold_products")
      .returning("sale_id", "product_id", "product_name")
      .then((d) => {
        // console.log("d", d);
        return d;
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

const handleSaleCreate = (req, res, db) => {
  const { total_price, customerId, products } = req.body;
  db.transaction((trx) => {
    trx
      .insert({ total_price, customer_id: customerId, created_at: new Date() })
      .into("sales")
      .returning("id")
      .then(async (id) => {
        try {
          var soldProducts = products.map(
            async (p) => await addItemsToSold(p, id[0], db)
          );
          soldProducts = await Promise.all(soldProducts);
          return res.status(200).json("success");
        } catch (err) {
          return res.status(400).json("error");
        }
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    return res.status(400).json("Unable to create sale");
  });
};

const getAllSales = (req, res, db) => {
  db.select("*")
    .from("sales")
    .then((sales) => res.status(200).json(sales))
    .catch((err) => {
      return res.status(400).json("Unable to get all sales");
    });
};

const salesByCustomerId = (req, res, db) => {
  db.select("*")
    .from("sales")
    .where("customer_id", req.params.id)
    .then((sales) => res.status(200).json(sales))
    .catch((err) => {
      return res.status(400).json("Unable to get all sales by customer");
    });
};

const removeSale = (req, res, db) => {
  db("claims")
    .where("sale_id", req.params.id)
    .del()
    .then((d) => {
      db("sold_products")
        .where("sale_id", req.params.id)
        .del()
        .then((d) => {
          db("sales")
            .where("id", req.params.id)
            .del()
            .then((r) => {
              console.log("sale", r);
              res.status(200).json("successfully deleted the sale");
            })
            .catch((err) => {
              console.log("sale", err);
              res.status(400).json("unable to delete stuff");
            });
        })
        .catch((err) => {
          console.log("sale product", err);
          return res.status(400).json("unable to delete sale");
        });
    })
    .catch((err) => {
      console.log("claim", err);
      return res.status(400).json("unable to delete claim");
    });
};

module.exports = {
  handleSaleCreate,
  getAllSales,
  salesByCustomerId,
  removeSale,
};
