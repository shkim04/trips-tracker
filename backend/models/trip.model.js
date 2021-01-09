const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true},
    description: { type: String, required: true },
}, {
    timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;