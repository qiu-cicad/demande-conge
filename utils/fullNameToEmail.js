function fullNameToEmail(fullName) {
    let firstName = fullName.split(" ")[0].toLowerCase();
    let lastName = fullName.split(" ")[1].toLowerCase();
    return `${firstName.charAt(0)}${lastName}@cicad.fr`;
  }

 module.exports = fullNameToEmail