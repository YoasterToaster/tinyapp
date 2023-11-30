const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// gets the current urls we have so we can display them all
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});
// Gets the longURL
app.get("/u/:id", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});
// Sends "Hello!" to our root page
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });
// Gets the 
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };

  // const obj = {
  //   id: generateRandomString(),
  //   email: users.email,
  //   password: users.password
  // }
  res.render("urls_register", templateVars);
});

// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: "Hello World!" };
//   res.render("hello_world", templateVars);
// });

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  const randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(req.body.longURL); // Respond with 'Ok' (we will replace this)
});

// app.get("/register", (req, res) => {
//   // Add any necessary logic here
//   res.render("urls_register");
// });

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  let id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect('/urls/');
});

app.post("/register", (req, res) => {
  // Grab the email and password from the body
  const { email, password } = req.body;
  const id = generateRandomString();
  const user = {id, email, password};
    //Add to the users object
  users[id] = user;
  res.cookie("user_id", id);
  
  console.log(user);
  res.redirect('/urls');
});

// Saves the login name and adds it as a cookie
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  // console.log(cookie);
  res.redirect('/urls');
});
// Clears the cookies
app.post("/logout", (req, res) => {
  const username = req.body.username;
  res.clearCookie('username', req.body.username);
  res.redirect('/urls');
});


function generateRandomString() {
  const randomString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let newId = "";
  for (i = 0; i < 6; i++){
    newId += randomString[Math.floor(Math.random() * randomString.length)];
  }
  console.log(newId);
  return newId;
}

generateRandomString();