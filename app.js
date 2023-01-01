const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require('mongoose');
// const { Schema } = mongoose;
const session = require('express-session');
const flash = require('connect-flash');
// const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret:'YogaGuru',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

//  app.engine('html', require('ejs').renderFile);

app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});

 mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://admin-Pranav:Mamtab-1@cluster0.tq9tzbl.mongodb.net/YogaDB");
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
   console.log("connection succeeded");
})
const yogaSchema = new mongoose.Schema({
  name: String,
  email: String,
  sex : String,
  age: Number,
  day: Number,
  month: Number,
  year: Number,
  batch : String
});
const yogaSchemaPay= new mongoose.Schema ({
  name: String,
  email: String,
  isFessPaid: Number,
  day: Number,
  month: Number,
  year: Number,
  batch : String,
})

const Yoga=mongoose.model("Yoga",yogaSchema);
const Yogapay=mongoose.model("Yogapay",yogaSchemaPay);

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html")
})
app.get("/join",function(req,res){
  res.render("form")
})
app.get('/paysucessfull',function(req,res){
  res.render("display");
} );
app.get('/fail',function(req,res){
  res.render("error");
} );
app.get('/payfail',function(req,res){
  res.statusCode = 404;
  console.log(res.status)
  res.render("payfail");
} );
app.post("/join/submit",function(req,res){

  const yname=req.body.name;
  const ysex=req.body.genderchoice;
  const yage=req.body.age;
  const ydate=req.body.date;
  const yemail=req.body.mail;
  const ybatch=req.body.batchchoice;
  const paystatus=req.body.paychoice;
  if(paystatus==0){
    req.flash('payfail', 'Your payment is failed. Try again.');
    return res.redirect("/payfail");
  }

  var d = new Date( ydate );

  if ( !!d.valueOf() ) { // Valid date
      yyear = d.getFullYear();
      ymonth = d.getMonth();
      yday = d.getDate();
  } else { /* Invalid date */ }
  const yoga=new Yoga({
    name: yname,
    email:yemail,
     sex: ysex,
      age: yage,
    day:yday,
    month:ymonth,
    year:yyear,
    batch:ybatch
  })
  const yogapay=new Yogapay({
    name: yname,
    email:yemail,
    isFessPaid:1,
    day:yday,
    month:ymonth,
    year:yyear,
    batch:ybatch
  })
Yoga.find({email:yemail},function(err,founduser){

  if(founduser.length>0){
console.log(yyear);
console.log(ymonth);
console.log(yday);
  if(founduser[0].year==yyear && ymonth>founduser[0].month && yday>founduser[0].day){
    console.log("hhkjkj");
    Yoga.deleteOne({email:yemail}, function (err) {
  if (!err) {
    console.log("Delete")
  };
})

Yogapay.deleteOne({email:yemail}, function (err) {
if (!err) {
console.log("Delete")
};
})

    yogapay.save();
    yoga.save();
    req.flash('success', 'Welcome!!....You have sucessfully completed your payment. Happy Yoga :)');
     res.redirect("/paysucessfull");
  }else if(founduser[0].year<yyear){
    Yoga.deleteOne({email:yemail}, function (err) {
  if (!err) {
    console.log("Delete")
  };
})

Yogapay.deleteOne({email:yemail}, function (err) {
if (!err) {
console.log("Delete")
};
})
    yogapay.save();
    yoga.save();
    req.flash('success', 'Welcome!!....You have sucessfully completed your payment. Happy Yoga :)');
     res.redirect("/paysucessfull");
  }
  else{
    console.log("aaaa")
    req.flash('error', 'Your one month subscribtion is not completed yet.');
     res.redirect("/fail");
  }
}else{
  console.log("Hi");
  yogapay.save();
  yoga.save();
  req.flash('success', 'Welcome!!....You have sucessfully completed your payment. Happy Yoga :)');
   res.redirect("/paysucessfull");
  // yoga.save()
}
//  console.log(founduser);
})


})
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
