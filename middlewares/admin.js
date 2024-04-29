const jwt = require("jsonwebtoken");
const db = require('../DB/dbconnect');

const admin = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" });

    const verified = jwt.verify(token, "passwordKey");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });


        const userid = verified.userid;
        const role = verified.role;
        if (role === "user" ) {
          return res.status(401).json({ msg: "You are not an admin!" });
        }
        next();

        //  const sql = 'SELECT * FROM users WHERE userid = ?';
        // db.query(sql, [userid], (err, result) => {
        //     if (err) {
        //         console.error('Error fetching task:', err);
        //         return res.status(500).json({ error: 'Internal Server Error' });
        //     }
        //     if (result.length === 0) {
        //         return res.status(404).json({ error: 'User not found' });
        //     }


        //     if (result[0].role == "user" ) {
        //         return res.status(401).json({ msg: "You are not an admin!" });
        //       }
        //       req.user = verified.id;
        //       req.token = token;
        //       next();

        //     res.json(result[0]);
        // });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = admin;