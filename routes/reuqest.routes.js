const router = require("express").Router();
const Request = require("../models/Request.model");
const User = require("../models/User.model");
const differenceInBusinessDays = require("date-fns/differenceInBusinessDays");
const fullNameToEmail = require("../utils/fullNameToEmail");

router.post("/send-request", (req, res, next) => {
  const {
    title,
    type,
    startDate,
    startInTheMorning,
    startInTheAfternoon,
    endDate,
    endInTheMorning,
    endInTheAfternoon,
    requester,
    sub,
    validators,
    comments,
  } = req.body;

  //translate the form data into request properties.
  let startWholeDay = startInTheMorning ? true : false;
  let endWholeDay = endInTheAfternoon ? true : false;
  // verify full names are all legal:
  const fullNameRegex = /^([A-Za-z]+\s[A-Za-z]+)(;\s[A-Za-z]+\s[A-Za-z]+)*$/;
  if (
    fullNameRegex.test(requester) && sub
      ? fullNameRegex.test(sub)
      : true === false
  ) {
    res.render("index", {
      errorMessage:
        "Le demandeur et le remplaçant doivent être des noms complets",
    });
  }
  if (!fullNameRegex.test(validators)) {
    res.render("index", {
      errorMessage:
        'Les validateurs doivent être des noms complets séparés par ";"',
    });
  }

  let requesterEmail = fullNameToEmail(requester);
  let emailList = [requesterEmail];
  let subEmail = "";
  if (sub) {
    subEmail = fullNameToEmail(sub);
    emailList.push(subEmail);
  }
  
  let validatorsEmail = "";
  let validatorEmail = ""
  validators.split(";").map((validator) => {
    validatorEmail = fullNameToEmail(validator)
    console.log("email index:", emailList.indexOf(validatorEmail))
    if(emailList.indexOf(validatorEmail)) emailList.push(validatorEmail);
    validatorsEmail += `${validatorEmail};`;
  });

  // verify if the names are in our annuair.
  User.find({ email: { $in: emailList } }).then((users) => {
    if (users.length === emailList.length) {
      console.log("all emails exist");
      Request.create({
        title,
        type,
        duration,
        startDate,
        startWholeDay,
        endDate,
        endWholeDay,
        requester: requesterEmail,
        validators: validatorsEmail,
        hr: "vbavoux@cicad.fr",
        sub: subEmail,
        comments,
      })
        .then((request) => res.render("index"))
        .catch((err) => console.log("error in request creation", err));
    } else {
      console.log("email list: ", emailList);
      console.log("some emails do not exist");
      res.render("index", { errorMessage: "Type all names correctly." });
    }
  });

  let duration =
    differenceInBusinessDays(new Date(startDate), new Date(endDate)) + 1;
  if (!startWholeDay) duration -= 0.5;
  if (!endWholeDay) duration -= 0.5;

  // create request in the data base for log purpose

  // send axios request here:
});

module.exports = router;
