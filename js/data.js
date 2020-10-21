// Populate select tag
export const populateSelect = () => {
    $.getJSON("js/external/countryBorders.geo.json", (countryBorders) => {
        countryBorders.features.map(country => {
            const entry = country.properties.name + " (" + country.properties.iso_a2 + ")";
            $("#countries").append(
                $("<option></option>").val(country.properties.iso_a2).html(entry)
            );
        });
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
    return value > 5000000 ? { name: "yellow", color: '#CAC428', index: 7 } :  
           value > 1000000 ? { name: "orange", color: '#CB8427', index: 6 } :  
           value > 500000  ? { name: "red", color: '#CB2B3E', index: 5 }    :  
           value > 400000  ? { name: "blue", color: '#2A81CB', index: 4 }   : 
           value > 300000  ? { name: "green", color: '#2AAD27', index: 3 }  :  
           value > 200000  ? { name: "violet", color: '#9C2BCB', index: 2 } :  
           value > 100000  ? { name: "grey", color: '#7B7B7B', index: 1 }   : 
                             { name: "black", color: '#3D3D3D', index: 0 };   
}