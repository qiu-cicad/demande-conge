const router = require("express").Router();
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

  // verify full names are all legal: 

  const fullNameRegex = /^([A-Za-z]+\s[A-Za-z]+)(;\s[A-Za-z]+\s[A-Za-z]+)*$/;

  if(fullNameRegex.test(requester) && fullNameRegex.test(sub) === false){
    res.render("index",{errorMessage:'Le demandeur et le remplaçant doivent être des noms complets'} )
  }

  if(!fullNameRegex.test(validators)){
    res.render("index",{errorMessage:'Les validateurs doivent être des noms complets séparés par ";"'} )
  }


  let subEmail = sub ? fullNameToEmail(sub) : "" ;
  let requesterEmail = fullNameToEmail(requester);
  let validatorsEmail = "";
  validators.split(";").map((validator) => {
    validatorsEmail += `${fullNameToEmail(validator)};`;
  });
  console.log("all emails:", subEmail, requesterEmail, validatorsEmail);
});

function fullNameToEmail(fullName) {
  let firstName = fullName.split(" ")[0];
  let lastName = fullName.split(" ")[1];
  return `${firstName.charAt(0)}${lastName}@cicad.fr`;
}

module.exports = router;
