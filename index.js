const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const usersRepo = require("./repos/users");

// using bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const userExists = await usersRepo.getOneBy({ email });
  if (userExists) {
    return res.send("Email already in use.");
  }

  if (password !== passwordConfirmation) {
    return res.send("Both passwords must match!");
  }

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
