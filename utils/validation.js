var emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
  if (!email || email.length > 254) return false;
  if (!emailRegex.test(email)) return false;

  const [local, domain] = email.split("@");
  if (local.length > 64 || domain.split(".").some((part) => part.length > 63))
    return false;

  return true;
}

module.exports = { isEmailValid };
