mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container:'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: hotelground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(hotelground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${hotelground.title}</h3><p>${hotelground.location}</p>`
            )
    )
    .addTo(map)