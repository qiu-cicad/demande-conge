const router = require("express").Router();
const Request = require("../models/Request.model");
const User = require("../models/User.model");
const differenceInBusinessDays = require("date-fns/differenceInBusinessDays");
const fullNameToEmail = require("../utils/fullNameToEmail");
const axios = require("axios").default;

router.post("/send-request", (req, res, next) => {
  //console.log(req.body)
  
  
  const {
    title,
    type,
    startDate,
    startInTheMorning,
    startInTheAfternoon,
    endDate,
    endInTheMorning,
    endInTheAfternoon,
    requestor,
    sub,
    validators,
    comments,
  } = req.body;

  //console.log("validators:", validators);

  //translate the form data into request properties.
  let startWholeDay = startInTheMorning ? true : false;
  let endWholeDay = endInTheAfternoon ? true : false;

  // verify full names are all legal:
  const fullNameRegex = /^([A-Za-z]+\s[A-Za-z]+)(;\s[A-Za-z]+\s[A-Za-z]+)*$/;
  if (
    fullNameRegex.test(requestor) && sub
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

  let requestorEmail = fullNameToEmail(requestor);
  let emailList = [requestorEmail];
  //console.log("emailList:", emailList)
  let subEmail = "";
  if (sub) {
    subEmail = fullNameToEmail(sub);
    emailList.push(subEmail);
  }

  let validatorsEmail = "";
  let validatorEmail = "";

  if (validators.indexOf(";") !== -1) {
    validators.split(";").map((validator) => {
      validatorEmail = fullNameToEmail(validator);
      //console.log("email index:", emailList.indexOf(validatorEmail));
      if (emailList.indexOf(validatorEmail) === -1)
        emailList.push(validatorEmail);
      validatorsEmail += `${validatorEmail};`;
    });
  } else {
    validatorsEmail = fullNameToEmail(validators);
    emailList.push(validatorsEmail);
  }

  let duration =
    differenceInBusinessDays(new Date(startDate), new Date(endDate)) + 1;
  if (!startWholeDay) duration -= 0.5;
  if (!endWholeDay) duration -= 0.5;

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
        requestor: requestorEmail,
        validators: validatorsEmail,
        hr: "vbavoux@cicad.fr",
        sub: subEmail,
        comments,
      })
        .then((request) => {
          // send axios request here:
          axios
            .post(process.env.HTTPS_TRIGGER, request)
            .then(() => res.render("index"))
            .catch((err) => console.log("axios error:", err));
        })
        .catch((err) => console.log("error in request creation", err));
    } else {
      //console.log("email list: ", emailList);
      console.log("some emails do not exist");
      res.render("index", { errorMessage: "Il faut bien vérifier les noms." });
    }
  });
});

module.exports = router;
