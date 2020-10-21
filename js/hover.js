// Hover Event On Countries
export const hover = {
    styles: {},
    selectCountry: {},
    selectedCountryCode: "",

    highlightFeature: (e) => {

        if (e.target.feature.properties.iso_a2 !== hover.selectedCountryCode) {
            e.target.setStyle(hover.styles.highlightedCountry);
    
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                e.target.bringToFront();
            }
        }
    },

    resetHighlight: (e) => {
        e.target.setStyle(hover.styles.inactiveCountry);
    },

    ActivateCountry: (e) => {
        $.getJSON("js/external/countryBorders.geo.json", (countryBorders) => {
            hover.selectedCountryCode = e.target.feature.properties.iso_a2;
            hover.selectCountry(e.target.feature.properties.iso_a2, countryBorders);
        });
    },

    onEachFeature: (feature, layer) => {
        layer.on({
            mouseover: hover.highlightFeature,
            mouseout: hover.resetHighlight,
            click: hover.ActivateCountry
        });
    },

    hoverOnCountry: (data, map) => {
        L.geoJson(data, {
            style: hover.styles.inactiveCountry,
            onEachFeature: hover.onEachFeature
        }).addTo(map);
    }
}