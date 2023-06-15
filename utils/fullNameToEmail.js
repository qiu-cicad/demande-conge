function fullNameToEmail(fullName) {
  const names = fullName.trim().split(" ");
  const firstName = names[0].toLowerCase();
  const lastName = names.slice(1).join("").toLowerCase();
  return `${firstName.charAt(0)}${lastName}@cicad.fr`;
}

module.exports = fullNameToEmail;