function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[now.getDay()];
  const dateString = `${day}, ${now.toLocaleDateString('en-US')}`;

  document.getElementById('clock').textContent = timeString;
  document.getElementById('day-date').textContent = dateString;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError, {
      enableHighAccuracy: true
    });
  } else {
    document.getElementById('location').textContent = "Location not supported";
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
      const address = data.display_name;
      document.getElementById('location').textContent = address;
    })
    .catch(() => {
      document.getElementById('location').textContent = "Unable to retrieve full address";
    });
}

function showError(error) {
  const locElem = document.getElementById('location');
  switch (error.code) {
    case error.PERMISSION_DENIED:
      locElem.textContent = "Permission denied for location access";
      break;
    case error.POSITION_UNAVAILABLE:
      locElem.textContent = "Location information unavailable";
      break;
    case error.TIMEOUT:
      locElem.textContent = "Request timed out";
      break;
    default:
      locElem.textContent = "Unknown error occurred";
  }
}

updateClock();
setInterval(updateClock, 1000);
getLocation();


document.getElementById('countdown-btn').addEventListener('click', startCountdown);

function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const targetDate = new Date("2027-08-29T00:00:00");
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').textContent = "The date has arrived";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('countdown').textContent =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

