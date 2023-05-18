const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();

const usersRepo = require("./repos/users");

// using bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["afdasfasf"],
  })
);

app.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const userExists = await usersRepo.getOneBy({ email });
  if (userExists) {
    return res.send("Email already in use.");
  }

  if (password !== passwordConfirmation) {
    return res.send("Both passwords must match!");
  }

  const user = await usersRepo.create({ email, password });

  req.session.userId = user.id;

  res.send("Account created!");
});

app.get("/signup", (req, res) => {
  res.send(`
    <div>
     Your user id is ${req.session.userId}
    <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password"/>
        <input name="passwordConfirmation" placeholder="confirm password" />
        <button>Sign Up</button>
    </form>
    </div>
    `);
});

app.get("/signin", (req, res) => {
  res.send(`
    <div>
     Your user id is ${req.session.userId}
   <form method="POST">
       <input name="email" placeholder="email" />
       <input name="password" placeholder="password"/>
       <button>Sign In</button>
   </form>
   </div>`);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    res.send("Invalid Email!");
  }

  if (user.password !== password) {
    res.send("Wrong Password!");
  }

  req.session.userId = user.id;

  res.send("Signed In");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("Signed out successfully!");
});

app.listen(3000, () => {
  console.log("Listening at port 3000!");
});
