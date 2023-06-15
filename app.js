// required packages
const express          = require('express'),
      bodyParser       = require('body-parser'),
      methdOverride    = require("method-override"),
      mongoose         = require("mongoose"),
      app              = express(); 

// setting the view engine as ejs no nedd to provide .ejs extension
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('assets'));
app.use(methdOverride("_method"));


// Connecting to mongodb database using mongoose
mongoose.connect("mongodb://127.0.0.1:27017/PocketMoneyDB", (err) =>{
    if(err){
        console.log("MongoDB is not connected");
    }
    else{
        console.log("MongoDB is connected");
    }
});
const transactionSchema = new mongoose.Schema({
    name: String,
	amount: Number,
    action:String,
    paymentMethod:String,
    category:String,
    username:String,
    created: { type: Date, default: Date.now() }
});

const transactions = mongoose.model("transactions", transactionSchema);

// let transaction = [];
// redirect to /transaction
app.get("/", (req, res) => {
    // res.redirect("/transaction");
    res.redirect("/register");
});

//user registration route
app.get("/register", (req, res) =>{
    res.render("register");
})

// main route
app.get("/transaction", (req, res) => {

    transactions.find({}, (err, transactionData) =>{
        if(err){
            console.log(err);
        }
        else{
            res.render("transaction", {transactions:transactionData});
        }
    });
});

// creating transaction
app.post("/transaction", (req, res) => {
transactions.create(req.body.new, (err, newOne) =>{
    if(err){
        console.log(err);
    }
    else{
        console.log(newOne);
        res.redirect("/transaction");
    }
}); 
});

//catch all route
app.get("*", (req, res) => {
	res.send("This path does not exist");
});


app.listen(1800 , function(){
    console.log("Application started at port:1800");
});