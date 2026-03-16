//1.Imports (always place at the top)
const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")        // ← add here
const bcrypt = require("bcryptjs")         // ← add here
require("dotenv").config()
const Church = require("./models/Church")
const User = require("./models/User")      // ← add here
const app = express()
app.use(express.json())
app.use(express.static("public"))

// 2. Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected! ✅"))
    .catch((err) => console.log("Error:", err))

// Middleware protect routes       // ← add here
function authenticateAdmin(req, res, next) {
    const token = req.headers["authorization"]
    if (!token) return res.status(401).json({ message: "Unauthorized!" })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ message: "Invalid token!" })
    }
}

app.get('/', function(req, res) {
    res.send("Hello World")
})

// Auth routes                     // ← add here
app.post('/api/auth/login', async function(req, res) {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(401).json({ message: "❌ Username tidak ditemukan!" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ message: "❌ Password salah!" })
    }
    const token = jwt.sign(
        { userId: user._id, role: user.role, churchId: user.churchId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    )
    res.json({ token, role: user.role, churchId: user.churchId, churchName: user.churchName })
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

app.get('/churches', async function(req, res) {
    const churches = await Church.find()
    res.json(churches)
})

app.post('/churches', authenticateAdmin, async function(req, res) {  // ← add authenticateAdmin
    const church = new Church({
        name: req.body.name,
        location: req.body.location,
        schedule: req.body.schedule
    })
    await church.save()
    res.json(church)
})

app.delete('/churches/:id', authenticateAdmin, async function(req, res) {  // ← add authenticateAdmin
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

app.put('/churches/:id', authenticateAdmin, async function(req, res) {  // ← add authenticateAdmin
    const church = await Church.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    )
    res.json(church)
})

app.listen(3000, function() {
    console.log("server is running on port 3000")
})