require("dotenv").config()
const mongoose = require("mongoose")
const User = require("./models/User")

async function createSuperAdmin() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected!")
    
    // Check if superadmin already exists
    const existing = await User.findOne({ username: "superadmin" })
    if (existing) {
        console.log("Superadmin already exists!")
        mongoose.connection.close()
        return
    }

    // Create superadmin
    const admin = new User({
        username: "superadmin",
        password: "jadwalmisa2025",
        role: "superadmin",
        churchId: null,
        churchName: null
    })

    await admin.save()
    console.log("✅ Superadmin created successfully!")
    mongoose.connection.close()
}

createSuperAdmin()