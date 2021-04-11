const handleClaimrCreate = (req, res, db) => {
  const {
    product_id,
    sale_id,
    customer_id,
    created_at,
    employee_id,
  } = req.body;
  db.transaction((trx) => {
    trx
      .insert({ product_id, sale_id, customer_id, created_at, employee_id })
      .into("claims")
      .returning("id")
      .then((value) => {
        return res.status(200).json(value);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    console.log(err);
    return res.status(400).json("Unable to create claim");
  });
};
const getAllClaims = (req, res, db) => {
  db("claims")
    .join("customers", "claims.customer_id", "=", "customers.id")
    .join("products", "claims.product_id", "=", "products.id")
    .join("sales", "claims.sale_id", "=", "sales.id")
    .select(
      "claims.id",
      "claims.customer_id",
      "claims.employee_id",
      "customers.name",
      "products.product_name",
      "claims.sale_id",
      "claims.created_at",
      "claims.reviewed",
      "claims.product_id",
      "claims.warranty_status",
      "claims.status",
      "claims.claimResolved"
    )
    .then((c) => res.status(200).json(c))
    .catch((err) => {
      console.log(err);
      return res.status(400).json("Unable to get all claims");
    });
};

const removeClaim = (req, res, db) => {
  db("claims")
    .where("id", req.params.id)
    .del()
    .then((d) => res.status(200).json("Success"))
    .catch((err) => {
      console.log(err);
      return res.status(400).json("unable to delete claim");
    });
};

const updateClaim = (req, res, db) => {
  // console.log(req.body);
  db("claims")
    .where("id", req.body.id)
    .update({
      claimResolved: req.body.claimResolved,
      status: req.body.status,
      warranty_status: req.body.warranty_status,
      reviewed: req.body.reviewed,
    })
    .then((re) => res.status(200).json("success"))
    .catch((err) => {
      console.log(err);
      res.status(400).json("error");
    });
};

module.exports = {
  handleClaimrCreate,
  getAllClaims,
  removeClaim,
  updateClaim,
};
