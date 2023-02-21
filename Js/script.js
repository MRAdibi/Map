


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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





class Workout {
    date = new Date();
    id = (Date.now() + "").slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance; // in Km
        this.duration = duration; // in min
    }

}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed() {
        this.speed = this.distance / (this.duration / 60)
        return this.speed
    }


}





////////////////////////////////////////////////////

// Application Architecture
class App {
    #map;
    #mapEvent;
    constructor() {
        this._getPosition();
        // handle add a new location
        addLocationForm.addEventListener('submit', this._newWorkout.bind(this))
        // handle the changing type
        typeSelect.addEventListener('change', this._toggleElevationField)

        startBtn.querySelector('button').addEventListener("click", () => {
            locations.classList.remove('hidden')
            startBtn.classList.add("hidden")
            startApp()
        })

    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert("can't find you location");
            })
        }
    }


    _loadMap(position) {
        // set latitude and longitude to use on the map
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const cords = [latitude, longitude]

        this.#map = L.map('map').setView(cords, 17);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this))
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        locationAddForm.classList.remove("add-location-hidden");
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputCadence.closest('.cadence').classList.toggle("hidden")
        inputElevation.closest('.elevation').classList.toggle("hidden")
    }

    _newWorkout(e) {
        e.preventDefault();
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
        const lat = this.#mapEvent.latlng.lat
        const lng = this.#mapEvent.latlng.lng

        // Display the marker
        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                maxHeight: 100,
                autoClose: false,
                closeOnClick: false,
            }).setContent("Hello World"))
            .openPopup();
    }

}



const app = new App();




