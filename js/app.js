var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var methodOverride = require("method-override")

app.set("views","/MoboTech/ejs")
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/mobo_tech', {useNewUrlParser: true})
app.use(methodOverride("_method"))
app.use("/css",express.static("css"))
app.use("/js",express.static("js"))

var MobileSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String
})

var mobile = new mongoose.model("mobile",MobileSchema)

app.get("/MoboTech",function(req,res){
	mobile.find({},function(err,mobiles){
		res.render("index.ejs",{mob:mobiles})
	})
})

app.get("/MoboTech/new",function(req,res){
	res.render("new.ejs")
})

app.post("/MoboTech",function(req,res){
	var nm = req.body.name;
	var img = req.body.image;
	var desc = req.body.description;
	mobile.create({name:nm,image:img,description:desc},function(err,mobile){
		console.log("Successfully Created");
		console.log(mobile);
	})
	res.redirect("/MoboTech");
})

/*app.get("/MoboTech/:id",function(req,res){
	var _id = req.params.id;
	mobile.findById(_id,function(err,mob){
		res.render("info.ejs",{mobile:mob})
	})
})*/

app.listen("3000",function(){
	console.log("Connected to Server.")
})

