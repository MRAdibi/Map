///////////// here is for call elements from DOM or create the variables we need
const infoBoxes = document.querySelectorAll('.tutorial')
const startBtn = document.querySelector('.start-map-section')
const locations = document.querySelector('.locations')
const locationAddForm = document.querySelector('.add-location')
const addLocationForm = document.querySelector('form')
const typeSelect = document.querySelector('.type')
const inputDistance = document.querySelector('.distance input')
const inputDuration = document.querySelector('.duration input')
const inputCadence = document.querySelector('.cadence input')
const inputElevation = document.querySelector('.elevation input')
let map;
let mapEvent;

///////////////// main map API call /////////////////
const startApp = function () {
    // check is geolocation works or not 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // set latitude and longitude to use on the map
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const cords = [latitude, longitude]

            map = L.map('map').setView(cords, 17);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.on('click', function (mapE) {
                mapEvent = mapE;
                locationAddForm.classList.remove("add-location-hidden");
                inputDistance.focus();

            })
        },
            function () {
                alert("can't find you location")
            })
    }
}
///////////////// end call API ///////////////// 


// handle add a new location
addLocationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
    const lat = mapEvent.latlng.lat
    const lng = mapEvent.latlng.lng

    // Display the marker
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(L.popup({
            maxWidth: 250,
            maxHeight: 100,
            autoClose: false,
            closeOnClick: false,
        }).setContent("Hello World"))
        .openPopup();
})


// handle the changing type
typeSelect.addEventListener('change', () => {
    inputCadence.closest('.cadence').classList.toggle("hidden")
    inputElevation.closest('.elevation').classList.toggle("hidden")
})



startBtn.querySelector('button').addEventListener("click", () => {
    locations.classList.remove('hidden')
    startBtn.classList.add("hidden")
    startApp()
})
