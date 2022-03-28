import { useState } from "react";
import '../styles/Weather.css';
import axios from "axios";
import WeatherInfo from "./WeatherInfo";

const WeatherContainer = () => {
    const API_KEY = '91e9e321d024b27dfe45fcdad9a58c98'
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?'
    // zip={zip code},{country code}&appid={API key}
    const [searchQuery, setSearchQuery] = useState();
    const [weatherData, setWeatherData] = useState({
        temp: null,
        humidity: null,
        desc: null,
        city: null
    })
    const [isValidZipCode, setIsValidZipCode] = useState(true)
    const updateSearchQuery = (event) => {
        let zipCode = event.target.value
        let isValid = validateZipCode(zipCode)
        setSearchQuery(zipCode)

        if (isValid || zipCode === "" || isValid.length === 5) {
            setIsValidZipCode(true)
        } else {
            setIsValidZipCode(false)
        }

    }

    const validateZipCode = (zipCode) => {
        let regex = /[0-9]{5}/; // 5 numerical digits
        return regex.test(zipCode)

    }
    const getWeatherData = async () => {
        if (!isValidZipCode || searchQuery === "") {
            setIsValidZipCode(false);
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}zip=${searchQuery},us&appid=${API_KEY}`)
            // return setWeatherData(response.data);
            .then(response => response.data)
            .then(data => setWeatherData({
                temp: convertToFarenheit(data.main.temp),
                humidity: data.main.humidity,
                desc: data.weather[0].main,
                city: data.name   
            }))
          
        }
        catch (error) {
            console.log(error)
        }
    }
    function convertToFarenheit(temp) {
        return ((temp - 273.15) * (9.0 / 5.0) + 32).toFixed(0);
    }

    return (
        <div className="weather-container">
            <header className="weather-header">
                <h3>Weather</h3>
                <div>
                    <input 
                    placeholder="Zip Code"
                    className="search-input"
                    onChange={updateSearchQuery}
                    maxLength = "5"
                    />
                    <button onClick={getWeatherData} className="material-icons">search</button>
                </div>
            </header>
            <p className="error">{isValidZipCode? "" : "Invalid Zip Code"}</p>
            <div className="weather-info">
                {weatherData.temp === null ? (
                    <p>No Weather to Display
                        <i className="material-icons">wb_sunny</i>
                    </p>
                ) : <WeatherInfo data = {weatherData}/>
                }
            </div>
        </div>
    )
}

export default WeatherContainer;