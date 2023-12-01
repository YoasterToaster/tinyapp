const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

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

const isLoggedIn = (req, res, page) => {
  if (req.cookies["user_id"]) {
    return res.redirect(page);
  }
}

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
    user_id: req.cookies["user_id"]
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
// Sends "Hello!" to our root page
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });
// Gets the 
app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.redirect('/login');
  }
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"]
  };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  isLoggedIn(req, res, '/urls');


  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"]
  };

  // const obj = {
  //   id: generateRandomString(),
  //   email: users.email,
  //   password: users.password
  // }
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  // Redirects to urls if logged in
  isLoggedIn(req, res, '/urls');

  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"]
  };
  // console.log(`login get: ${templateVars}`)
  // const obj = {
  //   id: generateRandomString(),
  //   email: users.email,
  //   password: users.password
  // }
  res.render("urls_login", templateVars);
});

// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: "Hello World!" };
//   res.render("hello_world", templateVars);
// });

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

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  console.log("TESTING" + req.body.userID, req.cookies)
  if (req.cookies["user_id"]) {
    // look for an id
    // for (let key in urlDatabase) {
      // console.log(urlDatabase[key]);
      // console.log(req.body.longURL);
      // if (urlDatabase[key] === req.body.longURL) {
        
        const randomString = generateRandomString();
        urlDatabase[randomString] = {
          longURL: req.body.longURL,
          userID: req.cookies["user_id"]
        }
        res.redirect('/urls');
      // }
    // }
    // res.status(401).send('There is no such URL in the database!');
  } else {
    res.status(401).send('You must be logged in to shorten URLs!');
  }
  // res.redirect(req.body.longURL); // Respond with 'Ok' (we will replace this)
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
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { id, email, hashedPassword };
//   console.log(bcrypt.compareSync(password, hashedPassword)); // returns true
// console.log(bcrypt.compareSync(hashedPassword, hashedPassword)); // returns false
  for (let userId in users) {
    if (users[userId].email === email) {
      // console.log(users[userId].email)
      // console.log(email)
      return res.status(400).send('User already exists');
    } else if (email === "" || password === "") {
      return res.status(400).send('All fields must be filled');
    }
  }
  //Add to the users object
  users[id] = user;
  console.log(users);
  res.cookie("user_id", id);

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
        res.cookie('user_id', id);
        return res.redirect('/urls');
      } else {
        return res.status(403).send('Incorrect Password');
      }
    }

  }
  return res.status(403).send('Email Could not be found');
  // else {
  //   console.log(users[userId].email);
  //   return res.status(401).send('The user does not exist');
  // }
});
// Saves the login name and adds it as a cookie
// app.post("/login", (req, res) => {
//   console.log("SECOND LOGIN POST");
//   const user_id = req.body.user_id;
//   res.cookie("user_id", user_id);
//   // console.log(cookie);
//   res.redirect('/urls');
// });
// Clears the cookies
app.post("/logout", (req, res) => {
  const user_id = req.body.user_id;
  res.clearCookie('user_id', user_id);
  res.redirect('/login');
});


function generateRandomString() {
  const randomString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let newId = "";
  for (i = 0; i < 6; i++) {
    newId += randomString[Math.floor(Math.random() * randomString.length)];
  }
  // console.log(newId);
  return newId;
}