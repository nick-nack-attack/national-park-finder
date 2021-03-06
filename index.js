'use strict';

const apiKey = 'bCp6AZngmij15kye1kYkb5bRbIN9I1h8ekuvovM6';
const urlBase = 'https://developer.nps.gov/api/v1/parks';

// https://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&key=YOUR_API_KEY

function getAddress(index) {
    console.log(`getAddress() is running...`)
    const googleApiKey = 'AIzaSyCK82Be_pTbvfiHQEo1H9hbSJpwDG0LPJE';
    const latLongArray = index.split(',');
    const latlongString = `latlng=${latLongArray[0].replace("lat:", "")},${latLongArray[1].replace("long:", "")}`;
    const fullUrlString = `https://maps.googleapis.com/maps/api/geocode/json?${latlongString}&key=${googleApiKey}`;
    // console.log(`Here is fullUrlString: [${fullUrlString}]`)
    let address = "";

    return fetch(fullUrlString)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText)
        })
        .then(googleMapsJson => JSON.stringify(googleMapsJson.results[0].formatted_address))
        .catch(error => {
            $('#js-error-message').text(`Something went so wrong: ${error.message}`)
        });

}

function displayResults(responseJson) {

    $('#js-results-list').empty();
    $('#js-number-of-results').empty();

    console.log(`displayResults() is running...`)

    $('#js-number-of-results').append(`${responseJson.data.length}`);

    for (let i = 0; i < responseJson.data.length; i++) {

        $('#js-results-list').append(`
                <li>
                    <h3>${responseJson.data[i].fullName}</h3>
                    <p class="js-location">${responseJson.data[i].states}</p>
                    <p>${responseJson.data[i].description}</p>
                    <a href="${responseJson.data[i].url}">Learn more</a>
                </li>
            `)
        }
    
    $('#results').removeClass('hidden');
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    console.log(`formatQueryParams: ${queryItems}`)
    return queryItems.join('&')
}

function getParks(submittedStates, submittedMaxResults) {
    const params = {
        stateCode: submittedStates,
        limit: submittedMaxResults,
        api_key: apiKey
    };
    //
    const queryString = formatQueryParams(params);
    const url = urlBase + "?" + queryString;
    //
    console.log(url);
    //
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            $('#js-error-message').text(`Something went wrong: ${error.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const submittedStates = $('#js-search-term').val();
        const submittedMaxResults = $('#js-max-results').val();
        getParks(submittedStates, submittedMaxResults);
    })
}

watchForm();