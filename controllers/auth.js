const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
        name: name,
        role: role,
        joined: new Date(),
      })
      .into("employees")
      .returning(["role", "name", "email", "id"])
      .then((v) => {
        console.log(v);
        return res.status(200).json(v);
      })
      .catch((err) => res.status(400).json("email already exist"))
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    console.log(err);
    return res.status(400).json("Unable to register");
  });
};

const handleLogIn = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "hash")
    .from("employees")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select(["role", "name", "email", "id"])
          .from("employees")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleRegister: handleRegister,
  handleSignIn: handleLogIn,
};
