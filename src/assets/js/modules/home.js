export default 'HOME';

document.addEventListener('DOMContentLoaded', () => {

    const getLocationButton = document.querySelector('#get-geolocation');

    if (!getLocationButton) {
        return;
    }

    getLocationButton.addEventListener('click', onClickGetLocation);
});

const GeoSupportError = class GeoSupportError extends Error {
    constructor(message) {

        super(message);
        this.GeoSupportError = true;
    }
};

function onClickGetLocation(e) {

    e.preventDefault();

    return getLocation().then(({ coords }) => {

        return post({
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    })
    .catch((err) => {

        if (err.GeoSupportError) {
            this.innerHTML = 'Sorry! Unfortunately your browser doesn\'t support geolocation';
        }

        console.error(err);
    });
};

function getLocation() {

    if (!navigator.geolocation) {
        return Promise.reject(new GeoSupportError());
    }

    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
};

function post(values) {

    const form = document.createElement('form');
    const input = document.createElement('input');

    form.method = 'post';

    Object.keys(values).forEach((field) => {

        input.name = field;
        input.value = `${values[field]}`;
        form.appendChild(input.cloneNode());
    });

    // To be sent, the form needs to be attached to the main document.
    form.style.display = 'none';
    document.body.appendChild(form);

    form.submit();

    // Once the form is sent, remove it.
    document.body.removeChild(form);
};
