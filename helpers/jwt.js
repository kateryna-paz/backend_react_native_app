const { expressjwt: expressJwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;
  if (!secret || !api) {
    throw new Error("JWT secret or api url is missing or invalid");
  }

  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      `${api}/users/login`,
      `${api}/users/register`,
      `${api}/panels`,
      `${api}/locations`,
      `${api}/regions`,
      `${api}/paneltypes`,
    ],
  });
}

module.exports = authJwt;
