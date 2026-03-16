const mongoose = require("mongoose")

const churchSchema = new mongoose.Schema({
    name: String,
    location: String,
    address: String,
    schedule: {
        sunday: [String],
        monday: [String],
        tuesday: [String],
        wednesday: [String],
        thursday: [String],
        friday: [String],
        saturday: [String]
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    extraSchedule: [
        {
            title: String,
            date: String,
            time: String,
            isActive: Boolean
        }
    ]
})

const Church = mongoose.model("Church", churchSchema)
module.exports = Church