const jwt = require("jsonwebtoken");
const db = require('../DB/dbconnect');

const admin = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" });

    const verified = jwt.verify(token, "mytokenkey");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

        console.log("Verified:", verified);

        const role = verified.user.role;
        if (role === "user" ) {
          return res.status(401).json({ msg: "You are not an admin!" });
        }

        req.user = verified.id;
        req.token = token;
       
       
        next();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = admin;