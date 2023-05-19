const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const authRouter = require("./routes/admin/auth");

// using bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["afdasfasf"],
  })
);

app.use(authRouter);

app.listen(3000, () => {
  console.log("Listening at port 3000!");
});
