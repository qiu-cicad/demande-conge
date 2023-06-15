function fullNameToEmail(fullName) {
  if (!fullName) {
    return "";
  }

  let trimmedFullName = fullName.trim();

  if (!trimmedFullName) {
    return "";
  }

  const names = trimmedFullName.split(" ");
  const firstName = names[0].toLowerCase();
  const lastName = names.slice(1).join("").toLowerCase();
  return `${firstName.charAt(0)}${lastName}@cicad.fr`;
}

module.exports = fullNameToEmail;
