//1.Imports (always place at the top)
const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const Church = require("./models/Church")


const app = express()
app.use(express.json())
app.use(express.static("public"))

// 2. Database connection (after import)
mongoose.connect(process.env.MONGODB_URI)  // ← add here
    .then(() => console.log("MongoDB connected! ✅"))
    .catch((err) => console.log("Error:", err))


app.get('/', function(req, res) {
    res.send("Hello World")
})

// Admin routes
app.get('/admin', function(req, res) {
    res.sendFile(__dirname + '/public/admin/index.html')
})

app.get('/admin/edit/:id', function(req, res) {
    res.sendFile(__dirname + '/public/admin/edit.html')
})

app.get('/admin/login', function(req, res) {
    res.sendFile(__dirname + '/public/admin/login.html')
})

app.get('/admin/add', function(req, res) {
    res.sendFile(__dirname + '/public/admin/add.html')
})

app.get('/churches', async function (req, res) {
    const churches = await Church.find()
    res.json(churches)
})

app.post('/churches', async function (req, res) {
    const church = new Church({
        name: req.body.name,
        location: req.body.location,
        schedule: req.body.schedule
    })

    await church.save()
    res.json(church)

})

app.delete('/churches/:id', async function(req, res) {
    await Church.findByIdAndDelete(req.params.id)
    res.json({ message: "Church deleted! ✅" })
})

app.get('/church/:id', function(req, res) {
    res.sendFile(__dirname + '/public/church.html')
})

app.get('/api/church/:id', async function(req, res) {
    const church = await Church.findById(req.params.id)
    res.json(church)
})


app.put('/churches/:id', async function(req, res) {
    const church = await Church.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    )
    res.json(church)
})

app.listen(3000, function () {
    console.log("server is running on port 3000")
})

