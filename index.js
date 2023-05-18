const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// using bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Account created!");
});

app.get("/", (req, res) => {
  res.send(`
    <div>
    <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password"/>
        <input name="passwordConfirmation" placeholder="confirm password" />
        <button>Sign Up</button>
    </form>
    </div>
    `);
});

app.listen(3000, () => {
  console.log("Listening at port 3000!");
});
