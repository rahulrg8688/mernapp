const jwt = require("jsonwebtoken");

module.exports = function (request, response, next) {
  try {
    let Token = request.header("x-token");
    if (!Token) {
      return response.send("No Token");
    }
    const Decode = jwt.verify(Token, "jwtToken");
    request.user = Decode.user;
    next();
  } catch (e) {
    response.send(e);
  }
};
