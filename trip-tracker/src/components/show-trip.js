import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import './show-trip.css';
import cities from '../countries-cities/cities.json';

const Trip = props => (
        <div className='table-row'>
            <div className='table-cell country-cell'>{props.trip.country}</div>
            <div className='table-cell city-cell'>{props.trip.city}</div>
            <div className='table-cell date-cell'>{props.trip.startDate.substring(0, 10).replace(/-/g, '/')} - {props.trip.endDate.substring(0, 10).replace(/-/g, '/')}</div>
            <div className='table-cell description-cell'>{props.trip.description}</div>
            <div className='table-cell delete-cell'><Link to='/' onClick={() => { props.deleteTrip(props.trip._id)}}>Delete</Link></div>
        </div>
    )

class ShowTrip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trips: [],
            coordinates: []
        }

        this.getCoordinatesByCity = this.getCoordinatesByCity.bind(this);
        this.displayMarkers = this.displayMarkers.bind(this);
        this.deleteTrip = this.deleteTrip.bind(this);
        this.tripList = this.tripList.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:5000/trips')
            .then(response => {
                if(!response.data) {
                    return [];
                }
                this.setState({
                    trips: response.data
                })
                this.getCoordinatesByCity();
            })
            .catch(error => {
                console.log(error);
            })
    }

    getCoordinatesByCity() {
        let filteredCities = cities.filter(city => {
            return this.state.trips.map(trip => trip.city).includes(city.name);
        })
        this.setState({
            coordinates: filteredCities.map(city => {
                return { lat: city.latitude, lng: city.longitude}
            })
        })
    } 

    displayMarkers() {
        return this.state.coordinates.map((coordinate, index) => {
            return <Marker key={index} id={index} position={{
                            lat: coordinate.lat,
                            lng: coordinate.lng
                        }}
                    />
            })
    }

    deleteTrip(id) {
        axios.delete('http://localhost:5000/trips/'+ id, async (req, res) => {
            try {
                res.json('Trip Deleted')
            }
            catch(err) {
                res.status(400).json({ message: err.message })
            }
        })
        
        this.setState({
            trips: this.state.trips.filter(trip => trip._id !== id),
        }, () => this.getCoordinatesByCity())
        
        this.displayMarkers();
    }

    tripList() {
        return this.state.trips.map(currentTrip => {
            return <Trip trip={currentTrip} deleteTrip={this.deleteTrip} key={currentTrip._id} />
        })
    }

    render() {
        return (
            <div className='show-trip-main-container'>
                <div className='show-trip-map-container'>
                    <Map
                        google={this.props.google}
                        zoom={2}
                        initialCenter={{ lat: 35.8242, lng: 127.1480}}
                    >
                        {this.displayMarkers()}
                    </Map>        
                </div>
                <section className='trip-table'>
                    <header className='table-row'>
                        <div className='table-cell country-cell'>Country</div>
                        <div className='table-cell city-cell'>City</div>
                        <div className='table-cell date-cell'>Date</div>
                        <div className='table-cell description-cell'>Description</div>
                        <div className='table-cell delete-cell'></div>
                    </header>
                    {this.tripList()}    
                </section>
                <div className='create-trip-btn-container'>
                    <Link to='/create'><button className='create-trip-btn'>Go To Create Trip</button></Link>
                </div>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCYxMXPQKlnd4mTQDjsDJ_O6Zj50uEFXQ4'
  })(ShowTrip);