const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const handleCustomerCreate = (req, res, db) => {
  const { name, email, phone } = req.body;
  db.transaction((trx) => {
    trx
      .insert({ name, email, phone })
      .into("customers")
      .returning("id")
      .then((value) => {
        return res.status(200).json(value);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    console.log(err);
    return res.status(400).json("Unable to create customer");
  });
};
const getAllCustomers = (req, res, db) => {
  db.select("*")
    .from("customers")
    .then((c) => res.status(200).json(c))
    .catch((err) => {
      return res.status(400).json("Unable to get all customers");
    });
};

const getCustomerById = (req, res, db) => {
  db("customers")
    .select("*")
    .where("id", req.params.id)
    .then((d) => res.status(200).json(d))
    .catch((err) => {
      console.log(err);
      return res.status(400).json("unable to get customer with given id");
    });
};

const sendEmail = (req, res, db) => {
  db("customers")
    .select("email")
    .where("id", req.params.id)
    .then(async (d) => {
      console.log(d);
      if (d.length > 0) {
        const mailOption = {
          from: `"${req.body.employeeName}@CSRP 😀" <${process.env.EMAIL}>`,
          to: d[0].email,
          subject: req.body.subject,
          text: req.body.emailBody,
        };
        transporter.sendMail(mailOption, function (err, success) {
          if (err) {
            return res
              .status(400)
              .json("unable to send email to customer with given id");
          } else {
            return res.status(200).json("email sent!");
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json("unable to send email to customer with given id");
    });
};

const removeCustomer = (req, res, db, removeSale) => {
  db("claims")
    .where("customer_id", req.params.id)
    .returning("*")
    .del()
    .then((d) => {
      if (d.length <= 0) {
        console.log(d);
        d[0] = { sale_id: -1 };
      }
      db("sold_products")
        .where("sale_id", d[0].sale_id)
        .del()
        .then((d) => {
          db("sales")
            .where("id", d[0].sale_id)
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
      console.log(err);
      return res.status(400).json("unable to delete customer");
    });
};
module.exports = {
  handleCustomerCreate,
  getAllCustomers,
  getCustomerById,
  sendEmail,
  removeCustomer,
};
