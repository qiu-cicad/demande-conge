const router = require("express").Router();
const User = require("../models/User.model");
const fullNameToEmail = require("../utils/fullNameToEmail");

router.get("/users", (req, res, next) => {
  User.find()
    .sort({ lastName: 1 })
    .then((users) => {
      res.render("users", { users });
    })
    .catch((err) => console.log("problem in getting users from mongoDB", err));
});

router.post("/delete-user/:id", (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then((user) => {
      console.log("This user is deleted from MongoDB:", user);
      return User.find().sort({ lastName: 1 });
    })
    .then((users) => {
      res.render("users", { users });
    })
    .catch((err) => {
      console.log("Error while deleting a user by ID:", err);
      res.status(500).send("Error deleting user");
    });
});

router.post("/create-user", (req, res, next) => {
  console.log("Started to create user");
  const { fullName } = req.body;
  let firstName = "";
  let lastName = "";
  let email = "";
  
  if (fullName.trim().split(" ").length !== 2) {
    User.find()
      .sort({ lastName: 1 })
      .then((users) => {
        res.render("users", {
          users,
          errorMessage:
            "Veuillez entrer un nom complet. Dans le cas de plusieurs prénoms, mettez un seul",
        });
      })
      .catch((err) => {
        console.log("Problem in getting users from MongoDB", err);
        res.status(500).send("Error getting users");
      });
  } else {
    email = fullNameToEmail(fullName);
    firstName = fullName.trim().split(" ")[0].toLowerCase();
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    lastName = fullName.trim().split(" ")[1].toUpperCase();

    User.findOne({ firstName, lastName })
      .then((user) => {
        if (user) {
          throw new Error("La personne existe déjà dans notre annuaire");
        } else {
          return User.create({ firstName, lastName, email });
        }
      })
      .then((newUser) => {
        console.log("New user is added:", newUser);
        return User.find().sort({ lastName: 1 });
      })
      .then((users) => {
        res.render("users", { users });
      })
      .catch((err) => {
        console.log("Error creating user:", err);
        res.status(500).render("users", {
          errorMessage: err.message,
        });
      });
  }
});


module.exports = router;
