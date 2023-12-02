const getUserByEmail = (email, database) => {
  for (let userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return false;
};

const isLoggedIn = (req, res, page) => {
  if (req) {
    return res.redirect(page);
  }
}

const urlsForUser = (id, database) => {
  // object to return
  const urls = {}
  // loop through and check what is equal
  for (const key in database) {
    if (database[key].userID === id) {
      urls[key] = { userID: id, longURL: database[key].longURL };
    }
  }
  return urls;

}

function generateRandomString() {
  const randomString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let newId = "";
  for (i = 0; i < 6; i++) {
    newId += randomString[Math.floor(Math.random() * randomString.length)];
  }
  return newId;
}


module.exports = { getUserByEmail, isLoggedIn, urlsForUser, generateRandomString };