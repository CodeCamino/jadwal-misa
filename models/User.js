const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["superadmin", "churchadmin"],
        default: "churchadmin"
    },
    churchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Church",
        default: null  // null = superadmin (akses semua)
    },
    churchName: {
        type: String,
        default: null
    }
})

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

const User = mongoose.model("User", userSchema)
module.exports = User