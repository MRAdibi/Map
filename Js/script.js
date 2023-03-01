///////////// here is for call elements from DOM or create the variables we need
const locations = document.querySelector('.locations')
const workoutList = document.querySelector('.workouts')
const locationAddForm = document.querySelector('.add-location')
const addLocationForm = document.querySelector('form')
const typeSelect = document.querySelector('.type')
const inputDistance = document.querySelector('.distance input')
const inputDuration = document.querySelector('.duration input')
const inputCadence = document.querySelector('.cadence input')
const inputElevation = document.querySelector('.elevation input')
const restartBtn = document.querySelector(".reset")




class Workout {
    date = new Date();
    id = (Date.now() + "").slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance; // in Km
        this.duration = duration; // in min
    }


    _setTitle() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.title = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;

    }

}

class Running extends Workout {
    type = "running";

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setTitle()
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace
    }
}

class Cycling extends Workout {
    type = "cycling";

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setTitle()
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
    #mapZoomLevel = 17;
    #mapEvent;
    #workouts = [];
    constructor() {
        // Get user's position
        this._getPosition();

        // Get data from local storage
        this._getLocalStorage();

        // handle add a new location
        addLocationForm.addEventListener('submit', this._newWorkout.bind(this))


        // handle the changing type
        typeSelect.addEventListener('change', this._toggleElevationField)
        locations.classList.remove('hidden')
        workoutList.addEventListener('click', this._moveToPopup.bind(this))
        restartBtn.addEventListener('click', this.reset)

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

        this.#map = L.map('map').setView(cords, this.#mapZoomLevel);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this));

        this.#workouts.forEach(work => {
            this._renderWorkoutMarker(work)
        })
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        locationAddForm.classList.remove("add-location-hidden");
        inputDistance.focus();
    }

    _hideForm() {
        // make inputs empty
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
        locationAddForm.classList.add('add-location-hidden');
    }

    _toggleElevationField() {
        inputCadence.closest('.cadence').classList.toggle("hidden")
        inputElevation.closest('.elevation').classList.toggle("hidden")
    }

    _newWorkout(e) {

        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);

        e.preventDefault();

        // Get data from form
        const type = typeSelect.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        // If workout running, create running object
        if (type === "running") {
            const cadence = +inputCadence.value;
            // Check if data is valid
            if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)) return alert('please add the currect form of the data!!!!!');

            workout = new Running([lat, lng], distance, duration, cadence);
        }

        // If workout cycling, create cycling object
        if (type === "cycling") {
            const elevation = +inputElevation.value;
            // Check if data is valid
            if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration)) return alert('please add the currect form of the data!!!!!')
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        // Add new object to workout array 
        this.#workouts.push(workout);
        console.log(workout)


        // Render workout on map as marker
        this._renderWorkoutMarker(workout)
        // Render workout on list 
        this._renderWorkout(workout);

        // Hide form + clear input fields 
        this._hideForm()

        this._setLocalStorage();

    }


    _renderWorkoutMarker(workout) {
        // Display the marker
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                maxHeight: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            }).setContent(`${workout.type === "running" ? "🏃" : "🚴"} ${workout.title}`))
            .openPopup();
    }


    _renderWorkout(workout) {

        let html = `
        <div class="d-flex flex-column location-list-content ${workout.type}-color text-center" data-id="${workout.id}">
            <div class="d-flex justify-content-around">
                <img src="Img/${workout.type === "running" ? "Run" : "Bike"}.png" alt="">
                <div class="d-flex flex-column mx-3">
                    <h4 class="text-start text-dark fw-semibold">${workout.title}</h3>
                    <div class="d-flex justify-content-around mt-2 workout-data">
                        <p>${workout.type === "running" ? "🏃" : "🚴"} ${workout.distance} KM</p>
                        <p>⌛ ${workout.duration} MIN</p>
                        ${workout.type === "running" ? `
                        <p>⚡ ${workout.pace.toFixed(1)} MIN/KM</p>
                        <p>🦶 ${workout.cadence} SPM</p>
                        ` : ""}
                        ${workout.type === "cycling" ? `
                        <p>⚡ ${workout.speed.toFixed(1)} KM/H</p>
                        <p>🦶 ${workout.elevationGain} M</p>
                        ` : ""}
                    </div>
                </div>
            </div>
        </div>
        `
        workoutList.insertAdjacentHTML("afterbegin", html)
    }

    _moveToPopup(e) {
        const workoutEl = e.target.closest('.location-list-content')

        if (!workoutEl) return;

        const workout = this.#workouts.find(
            work => work.id === workoutEl.dataset.id
        );

        console.log(workout)

        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1,
            },
        });

    }

    _setLocalStorage() {
        localStorage.setItem("workouts", JSON.stringify(this.#workouts));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem("workouts"));
        
        // handle the error
        if (!data) return;

        this.#workouts = data;
        this.#workouts.forEach(work => {
            this._renderWorkout(work);
        })
    }

    reset() {
        localStorage.removeItem("workouts");
        location.reload();
    }

}

const app = new App();
