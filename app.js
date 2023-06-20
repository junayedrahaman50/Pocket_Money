// required packages
const express = require("express"),
  bodyParser = require("body-parser"),
  methdOverride = require("method-override"),
  mongoose = require("mongoose"),
  app = express();

// setting the view engine as ejs no need to provide .ejs extension
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use(methdOverride("_method"));

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

// user registration route
app.get("/register", (req, res) =>{
  res.render("register");
})

// main route for calculating insights on user data
app.get("/dashboard", (req, res) => {
  transactions.find({}, (err, transactionData) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("mainDummy", { transactions: transactionData });
    }
  });
});

// Fetching all data with incomes and expense in transaction page
app.get("/transaction", (req, res) => {
  transactions.find({}, (err, transactionData) => {
    if (err) {
      res.redirect('back');
    } else {
      transactions.find({action:"+"}, (err, income) =>{
        if(err){
          res.redirect('back');
        }
        else{
          transactions.find({action:"-"}, (err, expense) =>{
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
app.post("/transaction", (req, res) => {
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
app.put("/transaction/:id", (req, res)=>{
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
app.delete("/transaction/:id", (req, res)=>{
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
