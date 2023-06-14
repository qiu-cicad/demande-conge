const router = require("express").Router();
const Request = require("../models/Request.model");
const differenceInBusinessDays = require("date-fns/differenceInBusinessDays");

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
  if (fullNameRegex.test(requester) && fullNameRegex.test(sub) === false) {
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

  let subEmail = sub ? fullNameToEmail(sub) : "";
  let requesterEmail = fullNameToEmail(requester);
  let validatorsEmail = "";
  validators.split(";").map((validator) => {
    validatorsEmail += `${fullNameToEmail(validator)};`;
  });

  let duration = differenceInBusinessDays(new Date(startDate), new Date(endDate))+1;
  if (!startWholeDay) duration -= 0.5;
  if (!endWholeDay) duration -= 0.5;

  // create request in the data base for log purpose

  Request.create({
    title,
    type,
    duration,
    startDate,
    startWholeDay,
    endDate,
    endWholeDay,
    requester:requesterEmail,
    validators:validatorsEmail,
    hr: "vbavoux@cicad.fr",
    sub:subEmail,
    comments,
  })
  .then((request)=> res.json(request))
  .catch(err=>console.log("error in request creation", err))

  // send axios request here: 


  console.log(newRequest)
});

function fullNameToEmail(fullName) {
  let firstName = fullName.split(" ")[0];
  let lastName = fullName.split(" ")[1];
  return `${firstName.charAt(0)}${lastName}@cicad.fr`;
}

module.exports = router;
