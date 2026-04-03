const express = require("express")
const app = express()
app.use(express.static("stuff"))

app.get('/', function(req, res) {
	res.redirect("/index.html")
});

app.listen(3000, () =>{
	console.log("Server running!")
})
