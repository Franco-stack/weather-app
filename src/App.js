import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function App() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiKey = '412607c858163e93ab64e91072730df7'; // Tu API Key

    // Función para obtener datos del clima
    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            // Llamada para obtener datos actuales
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
            const weatherResponse = await axios.get(weatherUrl);
            setWeatherData(weatherResponse.data);

            // Llamada para obtener pronóstico
            const { lat, lon } = weatherResponse.data.coord;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            const forecastResponse = await axios.get(forecastUrl);

            // Tomamos los primeros 5 intervalos para simplificar
            setForecastData(forecastResponse.data.list.slice(0, 5));
        } catch (error) {
            setError('Error al obtener los datos meteorológicos. Inténtalo de nuevo.');
            setWeatherData(null);
            setForecastData(null);
        } finally {
            setLoading(false);
        }
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim() === '') {
            setError('Porfavor ingrese el nombre de la ciudad.');
            return;
        }
        fetchWeather();
    };

    // Renderizado
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Weather App</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Ingresa un lugar"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        width: '300px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        marginLeft: '10px',
                        fontSize: '16px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    disabled={loading}
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {weatherData && forecastData && (
    <div className="weather-container">
        <div className="temperature">
            <h2>Temperature</h2>
            <div className="weather-container">
                    <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                    <p>
                        <img 
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                            alt="weather icon" 
                        />
                    </p>
                    <p>Temperature: {weatherData.main.temp}°C</p>
                    <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                </div>
        </div>
        <div className="forecast">
            <h2>Forecast</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {forecastData.map((forecast, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                        <p>
                            <strong>
                                {new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </strong>: 
                            {forecast.main.temp}°C, {forecast.weather[0].description}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
        <div className="temperature-forecast">
            <h2>Temperature Forecast (Graph)</h2>
            <LineChart
                width={400}
                height={200}
                data={forecastData.map(f => ({
                    time: new Date(f.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    temp: f.main.temp,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </div>
    </div>
)}
        </div>
    );
}

export default App;
