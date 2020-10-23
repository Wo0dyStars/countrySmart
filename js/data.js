// Populate select tag
export const populateSelect = () => {
    $.getJSON("js/external/countryBorders.geo.json", (countryBorders) => {
        const countries = countryBorders.features.map(country => country.properties.name).sort();
        
        for (let i = 0; i < countries.length; i++) {
            const countryData = countryBorders.features.filter(c => c.properties.name === countries[i])[0];

            const entry = countryData.properties.name + " (" + countryData.properties.iso_a2 + ")";
            $("#countries").append(
                $("<option></option>").val(countryData.properties.iso_a2).html(entry)
            );
        }
    })
}

// Spin Options
export const spinOptions =  {
    lines: 13,
    length: 0,
    width: 23,
    radius: 61,
    scale: 1.2,
    speed: 1.1,
    rotate: 63,
    animation: "spinner-line-shrink",
    color: "#155799"
};

// Get Specified Color With Name And Index
export const getColor = (value) => {
    return value > 1000000 ? { name: "orange", color: '#CB8427', index: 5, markerCode: "orange" } :  
           value > 500000  ? { name: "blue", color: '#2A81CB', index: 4, markerCode: "yellow" }   : 
           value > 100000  ? { name: "green", color: '#2AAD27', index: 3, markerCode: "green" }  :  
           value > 50000  ? { name: "violet", color: '#9C2BCB', index: 2, markerCode: "violet" } :  
           value > 20000  ? { name: "red", color: '#FF0000', index: 1, markerCode: "red" }   : 
                             { name: "black", color: '#3D3D3D', index: 0, markerCode: "black" };   
}