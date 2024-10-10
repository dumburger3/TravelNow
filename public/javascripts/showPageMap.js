mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: travelLoco.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');


const marker = new mapboxgl.Marker()
    .setLngLat(travelLoco.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${travelLoco.title}</h2><p>${travelLoco.location}</p>`
        )
    )
    .addTo(map)