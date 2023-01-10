///////////// here is for call elements from DOM or create the variables we need
const infoBoxes = document.querySelectorAll('.tutorial')
const startBtn = document.querySelector('.start-map-section')
const locations = document.querySelector('.locations')



///////////////// main map API call /////////////////
const startApp = function () {
    // check is geolocation works or not 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // set latitude and longitude to use on the map
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const cords = [latitude, longitude]

            const map = L.map('map').setView(cords, 17);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.on('click', function (eventMap) {
                console.log(eventMap)
                const lat = eventMap.latlng.lat
                const lng = eventMap.latlng.lng

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
        },
            function () {
                alert("can't find you location")
            })
    }
}
///////////////// end call API ///////////////// 


startBtn.querySelector('button').addEventListener("click", () => {
    locations.classList.remove('hidden')
    startBtn.classList.add("hidden")
    startApp()
})
