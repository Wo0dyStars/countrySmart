//************************************************** 
// IMPORTS
//************************************************** 
import { styles } from "./styles.js";
import { ajax } from "./utils.js";
import { populateSelect, spinOptions, getColor } from "./data.js";
import { hover } from "./hover.js";
import { drawChart } from "./chart.js";
import { displayWeatherData, displayCountryData, displayMiniData } from "./display.js";

//************************************************** 
// API DETAILS
//************************************************** 
const openCageAPI = "63b9294f9ed64bdeb0c77b390070e3a2";
const OpenWeatherAPIKey = "4d942565fae22651786edb5a63d30836";

populateSelect();

//************************************************** 
// GLOBAL VARIABLE DECLARATIONS
//************************************************** 
let selectedCountryCode = "";
let markers = {};
let countryLayer = {};
let capitalMarker = {};
let countriesDetails = "";

ajax({purpose: "RestCountries"}, (countries) => (countriesDetails = countries), "php/request.php");

$(document).ready(() => {
    $(".button").on("click tap", function() {
        $(".modal-wrapper").toggleClass("show hide");
        $(this).toggleClass("animated");
    });

    $(function () {
        $("#dialog").dialog();
    });
})

//************************************************** 
// INITIALIZE THE MAP
//************************************************** 
const map = L.map("countryMap", {
    minZoom: 3,
    maxZoom: 15,
    maxBounds: [[-90, -180],   [90, 180]]
});

const tileURL = "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png";
const tileAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
L.tileLayer(tileURL, { attribution: tileAttr, maxZoom: 18 }).addTo(map);

//************************************************** 
// FIND USER LOCATION
//************************************************** 
const onLocationFound = (e) => {
    
    L.marker(e.latlng).addTo(map).bindPopup("This is your location here.");
    L.circle(e.latlng, 50000).addTo(map);
    getLocalCountry(e.latitude, e.longitude);
}

const onLocationError = () => { 
    $("#dialog").html("I was unable to detect your location on your device. I will assume that your are from England.");
    getLocalCountry(55, -3);
}

map.on('locationerror', () => {
    if (!navigator.geolocation) {
        onLocationError();
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            L.marker(position.coords.latitude).addTo(map).bindPopup("This is your location here.");
            L.circle(position.coords.longitude, 50000).addTo(map);
            getLocalCountry(position.coords.latitude, position.coords.longitude);
        }, (error) => {
            onLocationError();
        } )
    }
});

map.on('locationfound', onLocationFound);

map.locate({setView: true, maxZoom: 16});

const getLocalCountry = (latitude, longitude) => {
    // Use Open Cage API to retrieve location data
    ajax({latitude, longitude, purpose: "getLocalCountry", APIKey: openCageAPI}, (country) => {
        selectedCountryCode = country.results[0].components["ISO_3166-1_alpha-2"];
        
        $("#dialog").html(`
            <div>
                <div><span class="dialog-text">Continent</span>: ${country.results[0].components.continent}</div>
                <div><span class="dialog-text">Country</span>: ${country.results[0].components.country}</div>
                <div><span class="dialog-text">County</span>: ${country.results[0].components.county}</div>
                <div><span class="dialog-text">City</span>: ${country.results[0].components.city}</div>
                <hr>
                <div>Your exact location is:</div>
                <div><span class="dialog-text">Latitude</span>: ${country.results[0].geometry.lat}</div>
                <div><span class="dialog-text">Longitude</span>: ${country.results[0].geometry.lng}</div>

            </div>
        `)

        $.getJSON("js/external/countryBorders.geo.json", (countryBorders) => {
            hover.styles = styles;
            hover.selectCountry = selectCountry;
            hover.selectedCountryCode = selectedCountryCode;
            hover.hoverOnCountry(countryBorders, map);
            selectCountry(selectedCountryCode, countryBorders);
        });
    }, "php/request.php");
};

$("#selectCountry").on("click", function() {
    selectedCountryCode = $("#countries").val();

    $.getJSON("js/external/countryBorders.geo.json", (countryBorders) => {
        selectCountry(selectedCountryCode, countryBorders);
    });
})

const selectCountry = (countryCode, data) => {

    if (countryLayer != undefined) { map.removeLayer(countryLayer); }
    if (markers != undefined) { map.removeLayer(markers); }

    countryLayer = L.geoJSON(data, {
        filter: (feature) => feature.properties.iso_a2 === countryCode,
        style: styles.activeCountry
    })

    countryLayer.addTo(map);
    map.fitBounds(countryLayer.getBounds(), { padding: [50, 50] });

    info.update(countryCode);
    map.spin(true, spinOptions);
    ajax({ countryCode, purpose: "receiveCountryCode" }, receiveCountryCode, "php/request.php");
}

const receiveCountryCode = (country) => {
    const countryCode = country.results[0].objectId;
    ajax({ countryCode, purpose: "createMarkers" }, createMarkers, "php/request.php");
}

function createMarkers(cities) {

    map.spin(false);

    if (markers != undefined) { map.removeLayer(markers); }
    if (capitalMarker != undefined) { map.removeLayer(capitalMarker); }

    // Simple Coloured Icons from https://github.com/pointhi/leaflet-color-markers
    const SimpleIcon = L.Icon.extend({
        options: {
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }
    })

    const SimpleIconURL = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-";
    const goldIcon = new SimpleIcon({ iconUrl: SimpleIconURL + "gold.png" });

    capitalMarker = L.marker(new L.latLng(cities.results[0].location.latitude, cities.results[0].location.longitude), {icon: goldIcon});

    markers = L.markerClusterGroup();
    
    const colorPopulations = {};
    const chartValues = {};
    for(let i = 1; i < cities.results.length; i++) {
        const latitude = cities.results[i].location.latitude;
        const longitude = cities.results[i].location.longitude;

        const title = `
            <div>
                <strong>City name:</strong> ${cities.results[i].name} <br>
                <strong>Population:</strong> ${cities.results[i].population} people
            </div>
        `;

        const currentIndex = getColor(cities.results[i].population).index;
        if ( chartValues[currentIndex] ) { chartValues[currentIndex] += 1; } 
            else { chartValues[currentIndex] = 1 };

        const currentColor = getColor(cities.results[i].population).name;
        if ( colorPopulations[currentColor] ) { colorPopulations[currentColor] += 1; } 
            else { colorPopulations[currentColor] = 1 };
        const selectedIcon = new SimpleIcon({ iconUrl: SimpleIconURL + currentColor + ".png" });
        const marker = L.marker(new L.latLng(latitude, longitude), {icon: selectedIcon}).bindPopup(title);

        markers.addLayer(marker);
    }

    // Five largest city for Weather API
    const fiveLargestCity = {};
    for(let i = 0; i < 5; i++) {
        fiveLargestCity[i] = {
            city: cities.results[i].name,
            lat: cities.results[i].location.latitude,
            lng: cities.results[i].location.longitude
        }
    }

    getCountryInfo(fiveLargestCity);
    
    drawChart(chartValues);

    legend.update(colorPopulations);
    map.addLayer(markers);
    capitalMarker.addTo(map).bindPopup(`
        <div>
            <h4>This is the largest city</h4>
            <strong>City name:</strong> ${cities.results[0].name} <br>
            <strong>Population:</strong> ${cities.results[0].population} people
        </div>
    `).openPopup();
}

const getCountryInfo = (cities) => {
    if (cities) {
        
        $(".weather-data").empty();
        for (let i = 0; i < Object.keys(cities).length; i++) {
            const URL = `api.openweathermap.org/data/2.5/weather?lat=${cities[i].lat}&lon=${cities[i].lng}&appid=${OpenWeatherAPIKey}`;

            map.spin(true, spinOptions);
            ajax({URL, purpose: "OpenWeatherAPI"}, (cities) => { map.spin(false); displayWeatherData(cities) }, "php/request.php");
        }
    }
}

//************************************************** 
// CREATE INFO PANEL TO EACH COUNTRY
//************************************************** 
const info = L.control({position: "bottomright"});

info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "countryInformation");
    this.update(selectedCountryCode);
    return this._div;
}

info.update = function(countryCode) {
    let selectedCountry = "";
    if ( countryCode ) {
        if (!countriesDetails) {
            ajax({countryCode, purpose: "RestCountries"}, (country) => {
                this._div.innerHTML = displayCountryData(country);
                $("#modal-content").html(displayCountryData(country));
                $(".countryInfo-mobile").html(displayMiniData(country));
            }, "php/request.php");
        } else {
            selectedCountry = countriesDetails.filter(country => country.alpha2Code === countryCode)[0];
            this._div.innerHTML = displayCountryData(selectedCountry);
            $("#modal-content").html(displayCountryData(selectedCountry));
            $(".countryInfo-mobile").html(displayMiniData(selectedCountry));
        }
    } 
}

info.addTo(map);

//************************************************** 
// CREATE LEGEND SPECIFIC TO EACH COUNTRY
//************************************************** 
const legend = L.control({position: "topright"});

legend.onAdd = function(map) {

    this._div = L.DomUtil.create("div", "countryInformation legend legend-mobile");
    this.update();
    
    return this._div;

}

legend.update = function(colorPopulations = {}) {
    const values = [0, 100000, 200000, 300000, 400000, 500000, 1000000, 5000000]; 

    this._div.innerHTML = "<h4>Populations</h4>";
    for (let i = 0; i < values.length; i++) {
        const { color, name } = getColor(values[i]+1);
        const currentNumber = colorPopulations[name] ? " (" + colorPopulations[name] + ") <br>" : " (0) <br>";
        const currentLine = values[i+1] ? " - " + values[i+1] : "+ ";
        this._div.innerHTML += `
            <i style="background: ${color}"></i>
            ${values[i] + currentLine + "<strong>" + currentNumber + "</strong>"}
        `;
    }
}

legend.addTo(map);