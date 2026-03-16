require("dotenv").config()
const mongoose = require("mongoose")
const User = require("./models/User")

async function updateAdmin() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected!")
    
    // ← Ganti "superadmin" dengan username kamu
    const user = await User.findOne({ username: "superAdmin" })
    if (!user) {
        console.log("User tidak ditemukan!")
        mongoose.connection.close()
        return
    }

    // ← Hanya ganti password saja
    user.password = "misaKuncinya"    // ← ganti password di sini
    
    await user.save()
    console.log("✅ Password berhasil diupdate!")
    mongoose.connection.close()
}

updateAdmin()