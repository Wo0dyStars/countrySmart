export const displayWeatherData = (weather) => {

    const { name, timezone, visibility } = weather;
    const localTime = new Date(weather.dt * 1000 + ( timezone * 1000 ));
    const weatherIcon = weather.weather[0].icon;
    const weatherIconImage = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    const weatherDescription = weather.weather[0].description;
    const windSpeed = weather.wind.speed;
    const windDegree = weather.wind.deg;
    const sunRise = new Date(weather.sys.sunrise * 1000);
    const sunSet = new Date(weather.sys.sunset * 1000);
    const feelsLike = Math.round(parseFloat(weather.main.feels_like) - 273.15);
    const humidity = weather.main.humidity;
    const pressure = weather.main.pressure;
    const temperature = Math.round(parseFloat(weather.main.temp) - 273.15);

    $(".weather-data").append(`
        <div id="weather">
            <div class="weather-line">
                <div class="weather-group">
                    <h2>${name}</h2>
                    <h1 class="weather-temperature">${temperature}&#176;</h1>
                </div>

                <div class="weather-group">
                    <img src="${weatherIconImage}" />
                    <span>${weatherDescription}</span>
                </div>
            </div>
            
            <div class="weather-description">
                <h4>${moment(localTime).format('ddd, MMM, YYYY')}</h4>
                <div>Sunrise: ${moment(sunRise).format('HH:mm')}</div>
                <div>Sunset: ${moment(sunSet).format('HH:mm')}</div>
                <hr>
                <div class="weather-minors">
                    <div>Wind: ${windSpeed} m/s, ${windDegree}&#176;</div>
                    <div>Visibility: ${visibility} m</div>
                    <div>Feels like: ${feelsLike}&#176;</div>
                    <div>Humidity: ${humidity}%</div>
                    <div>Pressure: ${pressure} hPa</div>
                </div>
            </div>
        </div>
    `)
}

export const displayCountryData = (country) => {
    const { name, capital, flag, area, population } = country;

    const controlPanel = `
            <article>
                <h4>${name}</h4>
                <ul>
                    <li>Capital city: ${capital}</li>
                    <li>
                        <img src="${flag}" alt="${name} national flag" />
                    </li>
                    <li>Area: ${area} km<sup>2</sup></li>
                    <li>Population: ${population} people</li>
                </ul>
            </article>
    `;

    return controlPanel;
}

export const displayMiniData = (country) => {
    const { name, flag } = country;

    const miniPanel = `
        <span class="country-name">${name}</span>
        <img class="country-flag" src="${flag}" alt="${name} national flag" />
    `;

    return miniPanel;
}