var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var methodOverride = require("method-override")
var sanitizer = require("express-sanitizer")

app.set("views","/MoboTech/ejs")
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/mobo_tech', {useNewUrlParser: true})
app.use(methodOverride("_method"))
app.use("/css",express.static("css"))
app.use("/MoboTech/css",express.static("css"))
app.use("/js",express.static("js"))
app.use("/MoboTech/js",express.static("js"))
app.use(sanitizer())

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
	var nm = req.sanitize(req.body.name);
	var img = req.body.image;
	var desc = req.sanitize(req.body.description);
	mobile.create({name:nm,image:img,description:desc},function(err,mobile){
		console.log("Successfully Created");
		console.log(mobile);
	})
	res.redirect("/MoboTech");
})

app.get("/MoboTech/more-info/:id",function(req,res){
	mobile.findById(req.params.id,function(err,mob){
		if(err){
			console.log("Error in fetching mobile.")
		}
		else{
			res.render("more-info.ejs",{mobile:mob})
		}
	})
})

app.get("/MoboTech/edit/:id",function(req,res){
	mobile.findById(req.params.id,function(err,mob){
		if(err){
			console.log("Error in fetching the data.")
		}
		else{
			res.render("edit.ejs",{mobile:mob})
		}
	})
})

app.put("/MoboTech/:id",function(req,res){
	var name = req.sanitize(req.body.name)
	var image = req.body.image
	var desc = req.sanitize(req.body.description)
	mobile.findByIdAndUpdate(req.params.id,{name:name,image:image,description:desc},function(err,mob){
		if(err){
			console.log("Error in Updating")
		}
		else{
			res.redirect("/MoboTech")
		}
	})
})

app.delete("/MoboTech/:id",function(req,res){
	mobile.findByIdAndRemove(req.params.id,function(err,mob){
		if(err){
			console.log("Error in fetching the data.")
		}
		else{
			res.redirect("/MoboTech")
		}
	})
})

app.listen("3000",function(){
	console.log("Connected to Server.")
})

