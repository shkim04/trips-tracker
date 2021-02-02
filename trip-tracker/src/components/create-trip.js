import React, { Component } from 'react';
import HandleClickListener from './clickListener';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import countries from '../countries-cities/countries.json';
import cities from '../countries-cities/cities.json';
import './create-trip.css';


export default class CreateTrip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            country: '',
            city : '',
            description: '',
            startDate : null,
            endDate : null,
            countryVisible: false,
            cityVisible: false,
        }
        
        this.divRef = React.createRef();
        this.handleCountrySelector = this.handleCountrySelector.bind(this);
        this.handleCitySelector = this.handleCitySelector.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.selectStartDate = this.selectStartDate.bind(this);
        this.selectEndDate = this.selectEndDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const { countryVisible, cityVisible } = this.state;
        if( countryVisible || cityVisible ) {
            this.divRef.current.focus();
        }
    }

    handleCountrySelector(country) {
        this.setState({
            country: country,
            city: '',
            countryVisible: false
        })
    }

    handleCitySelector(city) {
        this.setState({
            city: city,
            cityVisible: false
        })
    }

    onChangeDescription(e) {
        this.setState({
            description : e.target.value
        });
    }

    selectStartDate(date) {
        this.setState({
            startDate : date
        });
    }

    selectEndDate(date) {
        this.setState({
            endDate : date
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const trip = {
            country : this.state.country,
            city: this.state.city,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            description : this.state.description,
        }

        axios.post('http://localhost:5000/trips/add', trip, async (req, res) => {
            try {
                res.json('Trip added')
            }
            catch(err) {
                res.status(400).json({ message: err.message })
            }
        })

        window.location = '/';
    }

    render() {
        let filteredCountry = countries.filter(country => {
            return country.name === this.state.country;
        })
    
        let citiesByCountry = !filteredCountry[0] ? 
                                    [] : 
                                    cities.filter(city => (city.country_id === filteredCountry[0].id))
                                            .map(city => city.name)
                                            .sort()
        return (
            <div className='create-trip-main-container'>
                <div className='create-trip-container'>
                    <h3 id='title'>Create New Trip</h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Country: </label>
                            <div className='drop-down'>
                                <div className='form-control dropdown-content-container'>
                                    <div
                                        tabIndex='-1'
                                        ref={this.divRef}
                                        className='drop-down-content'
                                        onClick={() => this.setState({countryVisible: true})}
                                    >
                                        <div className='selected-value'>{this.state.country}</div>
                                        <div className='arrow-down' />
                                    </div>
                                </div>
                                { 
                                    this.state.countryVisible &&
                                        <HandleClickListener
                                            onClick={() => this.setState({countryVisible: false})}
                                        >
                                            <ul     
                                                id='country-selector' 
                                                className='drop-down-selector'
                                            >
                                                {
                                                    countries.map(country => {
                                                        return  <li 
                                                                    className='option' 
                                                                    key={country.id}
                                                                    value={country.name}
                                                                    onClick={() => this.handleCountrySelector(country.name)}
                                                                >
                                                                    {country.name}
                                                                </li>
                                                        })
                                                }
                                            </ul>
                                        </HandleClickListener>
                                }
                            </div>
                        </div>
                        <div className="form-group">
                            <label>City: </label>
                            <div className='drop-down'>
                                <div className='form-control dropdown-content-container'>
                                    <div
                                        tabIndex='-1'
                                        ref={this.divRef}
                                        className='drop-down-content'
                                        onClick={() => this.setState({cityVisible: true})}
                                    >
                                        <div className='selected-value'>{this.state.city}</div>
                                        <div className='arrow-down' />
                                    </div>
                                </div>
                                {
                                    this.state.cityVisible && 
                                    citiesByCountry.length > 0 && 
                                        <HandleClickListener
                                            onClick={() => this.setState({cityVisible: false})}
                                        >
                                            <ul 
                                                id='city-selector'
                                                className='drop-down-selector'
                                            >
                                            {
                                                citiesByCountry.map((city, index) => {
                                                    return <li
                                                                className='option'
                                                                key={index}
                                                                value={city}
                                                                onClick={() => this.handleCitySelector(city)}
                                                            >
                                                                {city}
                                                            </li>
                                                })
                                            }
                                            </ul>
                                        </HandleClickListener>
                                }
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Date: </label>
                            <div className='datepicker-container'>
                                <div className='form-control start-date-container'>
                                    <DatePicker
                                        selected={this.state.startDate}
                                        onChange={this.selectStartDate}
                                        selectsStart
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                    />
                                </div>
                                <div className='start-end-divider'/>
                                <div className='form-control end-date-container'>
                                    <DatePicker
                                        selected={this.state.endDate} 
                                        onChange={this.selectEndDate}
                                        selectsEnd
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        minDate={this.state.startDate}
                                    />
                                </div>
                            </div>   
                        </div>
                        <div className="form-group">
                            <label>Description: </label>
                            <div className='description-container  form-control'>
                                <textarea 
                                    type="text"
                                    required
                                    className="trip-description"
                                    value={this.state.description}
                                    onChange={this.onChangeDescription}
                                />
                            </div>
                        </div>
                        <div className="form-group add-trip-btn-container">
                            <input 
                                type="submit" 
                                value="Add Trip" 
                                className='btn'
                            />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}