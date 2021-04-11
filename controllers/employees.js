const getEmployeeById = (req, res, db) => {
  db("employees")
    .select("email", "id", "name", "role")
    .where("id", req.params.id)
    .then((d) => res.status(200).json(d))
    .catch((err) => {
      console.log(err);
      return res.status(400).json("unable to get employee with given id");
    });
};
module.exports = {
  getEmployeeById,
};
