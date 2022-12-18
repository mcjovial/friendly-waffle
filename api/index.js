const express = require('express');
const { PostgresInterface } = require('./postgresInterface');
const {connectionString} = require('../config');


const router = express.Router();
const pgi = new PostgresInterface(connectionString);

router.get("/", (req, res) => {
  res.send(["hello", "world"]);
});

router.get("/browseBooks", async (req, res) => {
  const data = await pgi.browseBook();
  res.send(data);
});

router.get("/viewAll/:table", async (req, res) => {
  const data = await pgi.viewAll(req.params.table);
  res.send({ data: data });
});

router.get("/searchBook/:search/:by", async (req, res) => {
  const { search, by } = req.params;
  const results = await pgi.searchBook(search, by);
  console.table(results);
  res.send(results);
});

router.get("/viewCheckoutHistory/:user", async (req, res) => {
  const { user } = req.params;
  const results = await pgi.viewCheckoutHistory(user);
  console.log(results);
  res.send(results);
})

router.get("/authenticateLogin/:user/:pass", async (req, res) => {
  const { user, pass } = req.params;
  const results = await pgi.authenticateLogin("patron", user, null, pass);
  console.log(results);
  res.send(results);
});

router.get("/librarianLogin/:lid/:pass", async (req, res) => {
  const { lid, pass } = req.params;
  const results = await pgi.authenticateLogin("librarian", null, lid, pass);
  console.log(results);
  res.send(results);
});

router.get("/viewPatronInfo/:user", async (req, res) => {
  const { user } = req.params;
  const results = await pgi.viewPatronInfo(user);
  console.log(results);
  res.send(results);
});

router.get("/availableBook/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const results = await pgi.availableBook(isbn);
  console.log(results);
  res.send(results);
});

router.get("/onlineCheckout/:isbn/:user", async (req, res) => {
  const { isbn, user } = req.params;
  await pgi.onlineCheckout(isbn,user);
  console.log('Insert');
  res.send('Insert');
});

router.get("/checkinBook/:bid", async (req, res) => {
  const { bid } = req.params;
  console.log(bid);
  await pgi.checkinBook(bid);
  console.log('Update');
  res.send('Update');
});

router.get("/checkMyHold/:user", async (req, res) => {
  const { user } = req.params;
  const results = await pgi.checkMyHold(user);
  console.log(results);
  res.send(results);
});

router.get("/placeHold/:user/:isbn", async (req, res) => {
  const { isbn, user } = req.params;
  await pgi.placeHold(user,isbn);
  console.log('Insert');
  res.send('Insert');
});

router.get("/checkinBook/:bid", async (req, res) => {
  const { bid } = req.params;
  console.log(bid);
  await pgi.checkinBook(bid);
  console.log('Update');
  res.send('Update');
});

router.get("/checkoutAHold/:bid/:user", async (req, res) => {
  const { bid, user } = req.params;
  console.log(bid);
  await pgi.checkoutAHold(bid,user);
  console.log('Update');
  res.send('Update');
});

router.get("/createNewPatron/:user/:pass/:fn/:ln/:dob/:addr/:phone/:email", async (req, res) => {
  const { user, pass, fn, ln, dob, addr, phone, email } = req.params;
  console.log('Route GET', dob);
  const status = await pgi.createNewPatron(user, pass, fn, ln, dob, addr, phone, email);
  res.send(status);
});

router.get("/payFee/:username", async (req, res) => {
  const { username } = req.params;
  await pgi.payFee(username);
  console.log('Update');
  res.send('Update');
});

router.get("/getLibrarianName/:lid", async (req,res) => {
  const { lid } = req.params;
  const fname = await pgi.getLibrarianName(lid);
  res.send(fname);
})

router.get("/viewPatronInfoBy/:search/:by/:amount/:operator", async (req,res) =>{
  let { search, by, amount, operator } = req.params;
  const results = await pgi.viewPatronInfoBy(search,by,amount,operator);
  console.log(results);
  res.send(results);
})

router.get("/viewAllPatrons", async (req,res) =>{
  const results = await pgi.viewPatronInfoBy('all',null,null,null);
  console.log(results);
  res.send(results);
})

router.get("/query/:select/:from/:where", async (req,res) => {
  const { select, from, where } = req.params;
  s = select.replace(/-/g,' ');
  f = from.replace(/-/g,' ');
  w = where.replace(/-/g,' ');
  const results = await pgi.query(s,f,w);
  res.send(results);
})

router.get("/viewCheckoutsByBook/:isbn", async (req,res) => {
  const {isbn} = req.params;
  const results = await pgi.viewCheckoutsByBook(isbn);
  res.send(results);
})

router.get("/viewHoldsByBook/:isbn", async (req,res) => {
  const {isbn} = req.params;
  const results = await pgi.viewHoldsByBook(isbn);
  res.send(results);
})

router.get("/viewHoldsByUser/:user", async (req,res) => {
  const {user} = req.params;
  const results = await pgi.viewHoldsByUser(user);
  res.send(results);
})

router.get("/viewCheckoutsByUser/:user", async (req,res) => {
  const {user} = req.params;
  const results = await pgi.viewCheckoutsByUser(user);
  res.send(results);
})

router.get("/viewActiveCheckouts", async (req,res) => {
  const results = await pgi.viewActiveCheckouts();
  res.send(results);
})

router.get("/viewCheckoutByBID/:bid", async (req,res) => {
  const {bid} = req.params;
  const results = await pgi.viewCheckoutByBID(bid);
  res.send(results);
})

router.get("/addBookToBooks/:isbn", async (req,res) => {
  const {isbn} = req.params;
  const err = await pgi.addBookToBooks(isbn);
  res.send(err);
})

router.get("/issueNewCard/:CID/:user/:LID/:reason", async (req,res) => {
  const { CID, user, LID, reason } = req.params;
  const err = await pgi.issueNewCard(CID, user, LID, reason);
  res.send(err);
})

router.get("/checkout_lib/:bid/:cid", async (req,res) => {
  const { bid, cid } = req.params;
  const err = await pgi.checkout_lib(bid, cid);
  res.send(err);
})

router.get("/removeSpecificBook/:bid/", async (req,res) => {
  const { bid } = req.params;
  const err = await pgi.removeSpecificBook(bid);
  console.log(err);
  res.send(err);
})

router.get("/removeBookBasedOnISBN/:isbn/", async (req,res) => {
  const { isbn } = req.params;
  const err = await pgi.removeBookBasedOnISBN(isbn);
  console.log(err);
  res.send(err);
})

router.get("/addBookToBookInfo/:isbn/:title/:author/:category/:format/:count", async (req,res) => {
  const { isbn, title, author, category, format, count } = req.params;
  const t = title.replace(/-/g,' ');
  const a = author.replace(/-/g,' ');
  const c = category.replace(/-/g,' ');
  const err = await pgi.addBookToBookInfo(isbn, t, a, c, format);
  if (err && err.name === 'error'){
    res.send(err);
  }
  else{
    for (let i = 0; i < count; i++){
      console.log('adding...');
      await pgi.addBookToBooks(isbn);
    }
    res.send('Done');
  }
  
})

router.get("/lib_checkout_hold/:bid/:user", async (req,res) => {
  const { bid, user } = req.params;
  const err = await pgi.lib_checkout_hold(bid, user);
  res.send(err);
})

router.get("/remove_hold/:username/:isbn", async (req,res) => {
  const { username, isbn } = req.params;
  const err = await pgi.remove_hold(username, isbn);
  res.send(err);
})



module.exports = router;

// createNewPatron(user, pass, fn, ln, DOB, addr, phone, email)