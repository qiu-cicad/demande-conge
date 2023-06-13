const express = require("express");
const router = express.Router();
const Request = require("../models/Request.model");

router.post("/send-request", (req, res, next) => {
  const {
    title,
    type,
    startDate,
    startFromMorning,
    endDate,
    endInTheAfternoon,
    requester,
    sub,
    validators,
    comments,
  } = req.body;
  console.log(req.body)
/*   let subEmail = "";
  let requesterEmail = fullNameToEmail(requester);
  let validatorsEmail = "";
  if (sub !== undefined) subEmail = fullNameToEmail(sub);
  validators.split(";").map((validator) => {
    validatorsEmail += fullNameToEmail(validator) & ";";
  });
  console.log("all emails:", subEmail, requesterEmail, validatorsEmail);
  res.render("/", { errorMessage: "error" }); */
});

function fullNameToEmail(fullName) {
  let firstName = fullName.split(" ")[0];
  let lastName = fullName.split(" ")[1];
  return `${firstName.charAt(0)}${lastName}@cicad.fr`;
}

module.exports = router;
