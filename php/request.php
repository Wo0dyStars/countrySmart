<?php

    $Back4AppCountriesURL = "https://parseapi.back4app.com/classes/Continentscountriescities_Country?limit=1&keys=name";
    $Back4AppCitiesURL = "https://parseapi.back4app.com/classes/Continentscountriescities_City?limit=300&order=-population&include=country&keys=name,country,country.name,country.currency,population,location";
    $OpenCageURL = "https://api.opencagedata.com/geocode/v1/json?key=";
    $RestCountriesURL = "https://restcountries.eu/rest/v2/";
    $URL = "";

    if ( $_REQUEST["purpose"] === "receiveCountryCode" ) {

        $WHERE = urlencode('{ "code": "'. $_REQUEST["countryCode"] .'"}');
        $URL = $Back4AppCountriesURL . '&where=' . $WHERE;

    } 
    
    else if ( $_REQUEST["purpose"] === "createMarkers" ) {
        
        $WHERE = urlencode('{
            "country": {
                "__type": "Pointer",
                "className": "Continentscountriescities_Country",
                "objectId": "'. $_REQUEST["countryCode"] .'"
            }
        }');

        $URL = $Back4AppCitiesURL . '&where=' . $WHERE;
    } 
    
    else if ( ( $_REQUEST["purpose"] === "getLocalCountry" ) ) {
        $URL = $OpenCageURL .$_REQUEST["APIKey"]. "&q=" .$_REQUEST["latitude"]. "+" .$_REQUEST["longitude"];
    } 
    
    else if ( ( $_REQUEST["purpose"] === "RestCountries" ) ){
        if ( $_REQUEST["countryCode"] ) {
            $URL = $RestCountriesURL . "alpha/". $_REQUEST["countryCode"] ;
        } else {
            $URL = $RestCountriesURL . "all";
        }
    } else {
        $URL = $_REQUEST["URL"];
    }


    if (( $_REQUEST["purpose"] === "receiveCountryCode" ) || ( $_REQUEST["purpose"] === "createMarkers" )) {
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $URL);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'X-Parse-Application-Id: 9LVuvR8mFn9Ug0JSH4qVY2mujpvhlx0olmHm8gUq', 
            'X-Parse-REST-API-Key: 2bHlYmBAukOHlMo3balq52cbiWjpm5JCLePXkvRb' 
        ));

        $data = json_decode(curl_exec($curl)); 
        
        curl_close($curl);
        
        echo json_encode($data);
    } else {
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $URL);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $data = json_decode(curl_exec($curl)); 
        
        curl_close($curl);
        
        echo json_encode($data);
    }
    
?>
