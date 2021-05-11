// Constent Values
declare const JotformFeedback: any;
const API_KEY: string | undefined = process.env.API_KEY;
const FORM_ID: string | undefined = process.env.FORM_ID;
const FB_APP: string | undefined = process.env.FB_APP;
const MAP: L.Map = L.map("hot-map-container");

const LATLNG_DEFAULT: L.LatLngExpression = { lat: 31.2, lng: -99.67 };
const ZOOM_DEFAULT: number = 4;

// Setup Defaults and DOM Elements
MAP.setView(LATLNG_DEFAULT, ZOOM_DEFAULT);

// Add Map Images from Mapbox api
L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.API_KEY,
    }
).addTo(MAP);

if (FORM_ID)
    new JotformFeedback({
        formId: FORM_ID,
        buttonText: "Check In",
        base: "https://form.jotform.com/",
        background: "#F59202",
        fontColor: "#FFFFFF",
        buttonSide: "top",
        buttonAlign: "center",
        type: false,
        width: 700,
        height: 500,
        isCardForm: false,
    });

// Add markers cluster Groups to Map
var markers = (<any>L).markerClusterGroup();
MAP.addLayer(markers);

/**
 * Loop through givin Address data and post to map.
 */
function displayAddresses(addresses: any[]) {
    let addressCount = addresses.length;

    for (let i = 0; i < addressCount; i++) {
        if (addresses[i]?.center) {
            markers.addLayer(L.marker(addresses[i].center.reverse()));
        }
    }
}

if (FB_APP)
    fetch(FB_APP)
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            displayAddresses(res?.data || []);
        })
        .catch((err) => console.log(err));
