const express = require("express");
const { getUserByEmail, isLoggedIn } = require("./helpers.js");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session')
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["Purple", "Super Dog", "House cat"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "userRandomID",
  },
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
  // console.log(users[req.cookies["user_id"]]);
  // console.log("WE ARE IN THE URLS GET");
  // console.log(urlDatabase);
  // console.log("WE ARE IN THE URLS GET");
  const templateVars = {
    urls: urlDatabase,
    user_id: req.session.user_id
  };
  // console.log(templateVars.user_id);
  res.render("urls_index", templateVars);
});
// Gets the longURL
app.get("/u/:id", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.id].longURL;
  // console.log(longURL);
  res.redirect(longURL);
});

// Gets the 
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  const templateVars = {
    urls: urlDatabase,
    user_id: req.session.user_id
  };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  isLoggedIn(req.session.user_id, res, '/urls');


  const templateVars = {
    urls: urlDatabase,
    user_id: req.session.user_id
  };

  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  // Redirects to urls if logged in
  isLoggedIn(req.session.user_id, res, '/urls');

  const templateVars = {
    urls: urlDatabase,
    user_id: req.session.user_id
  };

  res.render("urls_login", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id.userID, longURL: urlDatabase[req.params.id].longURL };
  
  if (!templateVars[longURL]){
    res.status(404).send('URL does not exist!');
  }

  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  // console.log("TESTING" + req.body.userID, req.cookies)
  if (req.session.user_id) {    
        const randomString = generateRandomString();
        urlDatabase[randomString] = {
          longURL: req.body.longURL,
          userID: req.session.user_id
        }
        res.redirect('/urls');
  } else {
    res.status(401).send('You must be logged in to shorten URLs!');
  }
});

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
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { id, email, hashedPassword };

 
    if (getUserByEmail(email ,users)) {
      return res.status(400).send('User already exists');
    } else if (email === "" || password === "") {
      return res.status(400).send('All fields must be filled');
    }
  
  //Add to the users object
  users[id] = user;
  console.log(users);
  // res.cookie("user_id", id);
  req.session.user_id = id;
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  if (email === "" || password === "") {
    return res.status(400).send('All fields must be filled');
  }

  for (let id in users) {
    if (users[id].email === email) {
      if (bcrypt.compareSync(password, users[id].hashedPassword)) {
        req.session.user_id = id;
        return res.redirect('/urls');
      } else {
        return res.status(403).send('Incorrect Password');
      }
    }

  }
  return res.status(403).send('Email Could not be found');

});

// Clears the cookies
app.post("/logout", (req, res) => {
  const user_id = req.body.user_id;
  req.session = null;
  res.redirect('/login');
});


function generateRandomString() {
  const randomString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let newId = "";
  for (i = 0; i < 6; i++) {
    newId += randomString[Math.floor(Math.random() * randomString.length)];
  }
  return newId;
}