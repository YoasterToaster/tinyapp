const getUserByEmail = (email, database) => {
  for (let userId in database){
    if (database[userId].email === email){
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


module.exports = {getUserByEmail, isLoggedIn};