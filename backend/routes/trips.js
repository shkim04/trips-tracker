const router = require('express').Router();
let Trip = require('../models/trip.model');

router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find()
        res.json(trips)
    }
    catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/:id', getTrip, (req, res) => {
    res.json(res.trip)
});

router.post('/add', async (req, res) => {
    const country = req.body.country;
    const city = req.body.city;
    const startDate = Date.parse(req.body.startDate);
    const endDate = Date.parse(req.body.endDate)
    const description = req.body.description;

    const trip = new Trip({
        country,
        city,
        startDate,
        endDate,
        description,
    });

    try {
        const newTrip = await trip.save()
        res.status(201).json(newTrip)
    }
    catch(err) {
        res.status(400).json({ message: err.message })
    }
});

router.delete('/:id', getTrip, async (req, res) => {
    try {
        await res.trip.remove()
        res.json({ message: 'Trip deleted'})
    }
    catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.patch('/add/:id', getTrip, async (req, res) => {
    if(req.body.country != null ){ res.trip.country = req.body.country }
    if(req.body.city != null ){ res.trip.city = req.body.city }
    if(req.body.startDate != null ){ res.trip.startDate = req.body.startDate }
    if(req.body.endDate != null ){ res.trip.endDate = req.body.endDate }
    if(req.body.description != null ){ res.trip.description = req.body.description }
    try {
        const updatedTrip = await res.trip.save()
        res.json(updatedTrip)
    }
    catch(err) {
        res.status(400).json({ message: err.message })
    }
});

async function getTrip(req, res, next) {
    let trip;
    try {
        trip = await Trip.findById(req.params.id)
        if(trip === null) {
            return res.status(404).json({ message: 'Cannot find the one' })
        }
    }
    catch(err) {
        return res.status(500).json({ message: err.message })
    }
    res.trip = trip
    next()
}

module.exports = router;