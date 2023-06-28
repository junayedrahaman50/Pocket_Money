// required packages
const express = require("express"),
  bodyParser = require("body-parser"),
  methdOverride = require("method-override"),
  mongoose = require("mongoose"),
  User = require("./models/user"),
  bcrypt = require("bcrypt"),
  session = require("express-session"),
  app = express();

// setting the view engine as ejs no need to provide .ejs extension
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use(methdOverride("_method"));
app.use(session({secret: 'Keypad Cat', resave:false, saveUninitialized:false}));

// Making username accessible globally
app.use((req, res, next) =>{
  res.locals.currentUser = req.session.username;
  next();
});

// Login required middleware to protect our routes
const requireLogin = (req, res, next) =>{
  if(!req.session.user_id){
    return res.redirect("/register");
  }
  next();
}
// Connecting to mongodb database using mongoose
mongoose.connect("mongodb://127.0.0.1:27017/PocketMoneyDB", (err) => {
  if (err) {
    console.log("MongoDB is not connected");
  } else {
    console.log("MongoDB is connected");
  }
});
// Pattern/schema for each transaction (Note: DB is Schemaless and other data can be added)
const transactionSchema = new mongoose.Schema({
  username:String,
  title: String,
  amount: Number,
  description:String,
  category:String,
  action: String,
  paymentMode: String,
  username: String,
  created: { type: Date, default: Date.now() }
});

const transactions = mongoose.model("transactions", transactionSchema);

app.get("/", (req, res) => {
  res.redirect("/register");
});

// Authentication Routes
app.get("/register", (req, res) =>{
  res.render("register");
});

app.post("/register", async (req, res) =>{
  const {password, username} = req.body;
  // Hashing(encrypt) password for secrity
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    password: hash
  });
  // Saving User to database
  await user.save();
  req.session.user_id = user._id;
  req.session.username = user.username;
  res.redirect("/transaction");
});

app.post("/login", async (req, res) =>{
  const {username, password} = req.body;
  const user = await User.findOne({ username });
  // Bcrypt compares given password with hashed one and returns true or false
  const validPassword = await bcrypt.compare(password, user.password);
  if(validPassword){
    req.session.user_id = user._id;
    req.session.username = user.username;
    res.redirect("/transaction");
  } else {
  res.redirect("/register");
  }
});

app.post("/logout", (req, res) =>{
  req.session.user_id = null;
  req.session.username = null;

  //req.session.destroy(); - destroies whole session
  res.redirect("/register");
});



// main route for calculating insights on user data
app.get("/dashboard", requireLogin, (req, res) => {
  const userName = req.session.username;
  transactions.find({username:userName}, (err, transactionData) => {
    if (err) {
      res.redirect('back');
    } else {
      transactions.find({username:userName, action:"+"}, (err, income) =>{
        if(err){
          res.redirect('back');
        }
        else{
          transactions.find({username:userName, action:"-"}, (err, expense) =>{
            if(err){
              res.redirect('back');
            }
            else{
              res.render("mainDummy", { transactions: transactionData, income:income, expense:expense  });
            }
          });
        }
      });
    }
  });
});


// Fetching all data with incomes and expense in transaction page
app.get("/transaction", requireLogin, (req, res) => {
  const userName = req.session.username;
  transactions.find({username:userName}, (err, transactionData) => {
    if (err) {
      res.redirect('back');
    } else {
      transactions.find({username:userName, action:"+"}, (err, income) =>{
        if(err){
          res.redirect('back');
        }
        else{
          transactions.find({username:userName, action:"-"}, (err, expense) =>{
            if(err){
              res.redirect('back');
            }
            else{
              res.render("transaction", { transactions: transactionData, income:income, expense:expense  });
            }
          });
        }
      });
    }
  });
});

// CRUD OPERATION STARTS HERE
// New Route for adding transaction
app.get("/transaction/new", (req, res) =>{
  res.render("new");
});



// creating transaction
app.post("/transaction",requireLogin, (req, res) => {
  transactions.create(req.body.new, (err, newOne) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/transaction");
    }
  });
});

//Show Route
app.get("/transaction/:id", (req,res)=>{
  transactions.findById(req.params.id, (err, singleTransaction) =>{
    if(err){
      res.redirect("back");
    }else{
      res.render("show", {sTransaction:singleTransaction});
    }
  });
});

// Edit Route
app.get("/transaction/:id/edit", (req,res) =>{
  transactions.findById(req.params.id, (err, foundTransaction) =>{
    if(err){
      res.redirect("back");
    }else{
      res.render("edit", {transaction:foundTransaction});
    }
  });
});

// Update Route
app.put("/transaction/:id", requireLogin, (req, res)=>{
  transactions.findByIdAndUpdate(req.params.id, req.body.updated, (err, updatedOne) => {
    if(err){
      res.redirect("back");
    }
    else{
      res.redirect("/transaction");
    }
  });
});

// Delete Route
app.delete("/transaction/:id", requireLogin, (req, res)=>{
  // destroy transaction
transactions.findByIdAndRemove(req.params.id, (err) =>{
  // redirect somewhere
  if(err){
    res.redirect("back");
  }
  else{
    res.redirect("/transaction")
  }
});
});


// catch all route (unspecified paths)
app.get("*", (req, res) => {
  res.render("404");
});

app.listen(1800,  () => {
  console.log("Application started at port:1800");
});
