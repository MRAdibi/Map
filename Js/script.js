///////////// here is for call elements from DOM or create the variables we need
const infoBoxes = document.querySelectorAll('.tutorial')
const startBtn = document.querySelector('.start-map-section')
const locations = document.querySelector('.locations')



///////////////// main map API call /////////////////
const startApp = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const cords = [latitude, longitude]
            const map = L.map('map').setView(cords, 17);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker(cords).addTo(map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                .openPopup();
        }, function () { })
    }
}
///////////////// end call API ///////////////// 


startBtn.querySelector('button').addEventListener("click", () => {
    locations.classList.remove('hidden')
    startBtn.classList.add("hidden")
    startApp()
})
