var router = require("express").Router();
var Request = require("../models/Request.model");
router.post("/send-request", function (req, res, next) {
    var _a = req.body, title = _a.title, type = _a.type, startDate = _a.startDate, startFromMorning = _a.startFromMorning, endDate = _a.endDate, endInTheAfternoon = _a.endInTheAfternoon, requester = _a.requester, sub = _a.sub, validators = _a.validators, comments = _a.comments;
    var subEmail = "";
    var requesterEmail = fullNameToEmail(requester);
    var validatorsEmail = "";
    if (sub !== undefined)
        subEmail = fullNameToEmail(sub);
    validators.split(";").map(function (validator) {
        validatorsEmail += "".concat(fullNameToEmail(validator), ";");
    });
    console.log("all emails:", subEmail, requesterEmail, validatorsEmail);
});
function fullNameToEmail(fullName) {
    var firstName = fullName.split(" ")[0];
    var lastName = fullName.split(" ")[1];
    return "".concat(firstName.charAt(0)).concat(lastName, "@cicad.fr");
}
module.exports = router;
