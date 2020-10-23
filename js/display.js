const sanitiseWeatherData = (rawWeatherData, timezone, isCurrent) => {
    const weatherIcon = rawWeatherData.weather[0].icon;

    const weatherData = {
        visibility: rawWeatherData.visibility,
        localTime: new Date(rawWeatherData.dt * 1000 + ( timezone * 1000 )),
        weatherIconImage: `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
        weatherDescription: rawWeatherData.weather[0].description,
        windSpeed: rawWeatherData.wind_speed,
        windDegree: rawWeatherData.wind_deg,
        feelsLike: Math.round(parseFloat(rawWeatherData.feels_like) - 273.15),
        humidity: rawWeatherData.humidity,
        pressure: rawWeatherData.pressure,
        temperature: Math.round(parseFloat(rawWeatherData.temp) - 273.15)
    }

    if ( isCurrent ) {
        weatherData.sunRise = new Date(rawWeatherData.sunrise * 1000);
        weatherData.sunSet = new Date(rawWeatherData.sunset * 1000);
    }

    return weatherData;
    
}

export const displayWeatherData = (weather, name) => {

    const currentData = sanitiseWeatherData(weather.current, weather.timezone_offset, true);

    let weatherForecast = "";
    for (let i = 0; i < 24; i++) {
        const hourly = sanitiseWeatherData(weather.hourly[i], weather.timezone_offset, false);

        weatherForecast += `
            <div>
                <div>${moment(hourly.localTime).format('HH:mm')}</div>
                <div><img src="${hourly.weatherIconImage}" /></div>
                <div>${hourly.temperature}&#176;</div>
            </div>
        `
    }

    $(".weather-data").append(`
        <div id="weather">
            <div class="weather-line">
                <div class="weather-group">
                    <h2>${name}</h2>
                    <h1 class="weather-temperature">${currentData.temperature}&#176;</h1>
                </div>

                <div class="weather-group">
                    <img src="${currentData.weatherIconImage}" />
                    <span>${currentData.weatherDescription}</span>
                </div>
            </div>

            <div id="weather-forecast">
                ${weatherForecast}
            </div>
            
            <div class="weather-description">
                <h4>${moment(currentData.localTime).format('ddd, MMM, YYYY')}</h4>
                <div>Sunrise: ${moment(currentData.sunRise).format('HH:mm')}</div>
                <div>Sunset: ${moment(currentData.sunSet).format('HH:mm')}</div>
                <hr>
                <div class="weather-minors">
                    <div>Wind: ${currentData.windSpeed} m/s, ${currentData.windDegree}&#176;</div>
                    <div>Visibility: ${currentData.visibility} m</div>
                    <div>Feels like: ${currentData.feelsLike}&#176;</div>
                    <div>Humidity: ${currentData.humidity}%</div>
                    <div>Pressure: ${currentData.pressure} hPa</div>
                </div>
            </div>
        </div>
    `)
}

const formatPopulation = (population) => {
    return `~ ${(population / 1000000)}M`;
}

export const displayCountryData = (country) => {
    const { name, capital, flag, area, population } = country;

    const controlPanel = `
            <article>
                <h4>${name}</h4>
                <ul>
                    <li>Capital city: ${capital}</li>
                    <li class="medium-flag">
                        <img src="${flag}" alt="${name} national flag" />
                    </li>
                    <li>Area: ${area} km<sup>2</sup></li>
                    <li>Population: ${formatPopulation(population)}</li>
                </ul>
            </article>
    `;

    $(".background").css("background", `url("${flag}") no-repeat center/cover`);

    return controlPanel;
}

export const displayCountryName = (country) => {
    return `<article><h4>${country.name}</h4></article>`;
}

export const displayMiniData = (country) => {
    const { name, flag } = country;

    const miniPanel = `
        <span class="country-name">${name}</span>
        <img class="country-flag" src="${flag}" alt="${name} national flag" />
    `;

    return miniPanel;
}

export const displayPhotos = (photos) => {
    let photoGrid = "";
    
    let index = 0;
    const randomPhotos = [];
    while (( index < 10 ) && ( index < photos.hits.length )) {
        const random = Math.floor(Math.random() * photos.hits.length);
        
        if (!randomPhotos.includes(random)) {
            photoGrid += `
                <div>
                    <figure>
                        <img src="${photos.hits[index].webformatURL}" />
                        <figcaption>${photos.hits[index].tags}</figcaption>
                    </figure>
                </div>
            `;

            randomPhotos.push(random);
        }
        
        index++;
    }

    $("#photos").html(photoGrid);
}

export const displayWikipedia = (info) => {

    let wikiData = "";
    for (let i = 0; i < Object.keys(info.geonames).length; i++) {
        wikiData += `
            <details id="wikidata" open>
                <summary>${info.geonames[i].title}</summary>
                <div class="wikidata-summary">${info.geonames[i].summary}</div>
                <div class="wikidata-link"><a href="http://${info.geonames[i].wikipediaUrl}" target="_blank">You can find more information here.</a></div>
            </details>
        `
    }

    $("#wikipedia").html(`
        ${wikiData}
    `)
}