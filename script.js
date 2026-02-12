function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[now.getDay()];
  const dateString = `${day}, ${now.toLocaleDateString("en-US")}`;

  document.getElementById("clock").textContent = timeString;
  document.getElementById("day-date").textContent = dateString;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError, {
      enableHighAccuracy: true,
    });
  } else {
    document.getElementById("location").textContent = "Location not supported";
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
  )
    .then((response) => response.json())
    .then((data) => {
      const address = data.display_name;
      document.getElementById("location").textContent = address;
    })
    .catch(() => {
      document.getElementById("location").textContent =
        "Unable to retrieve full address";
    });
}

function showError(error) {
  const locElem = document.getElementById("location");
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

/* ===== COUNTDOWN TOGGLE FEATURE ===== */

let countdownInterval = null;
let countdownVisible = false;

document
  .getElementById("countdown-btn")
  .addEventListener("click", toggleCountdown);

function toggleCountdown() {
  const countdownEl = document.getElementById("countdown");

  if (!countdownVisible) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
    countdownEl.style.display = "block";
    countdownVisible = true;
  } else {
    clearInterval(countdownInterval);
    countdownEl.style.display = "none";
    countdownVisible = false;
  }
}

function updateCountdown() {
  const targetDate = new Date("2027-08-29T00:00:00");
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "The date has arrived";
    return;
  }

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("countdown").textContent = `${totalDays} days`;
}

/* ===== DAILY TARGET TIME REMAINING FEATURE ===== */

function updateDailyTargets() {
  const now = new Date();

  const targets = [
    { id: "t1", hour: 10, minute: 0, label: "10:00 AM" },
    { id: "t2", hour: 12, minute: 1, label: "12:01 PM" },
    { id: "t3", hour: 15, minute: 0, label: "3:00 PM" },
  ];

  targets.forEach((target) => {
    let targetTime = new Date();
    targetTime.setHours(target.hour, target.minute, 0, 0);

    const diff = targetTime - now;
    const elem = document.getElementById(target.id);
    if (!elem) return;

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      elem.textContent = `Time remaining to ${target.label}: ${hours}h ${minutes}m ${seconds}s`;
      elem.style.color = "limegreen";
    } else if (
      now.getHours() === target.hour &&
      now.getMinutes() === target.minute &&
      now.getSeconds() === 0
    ) {
      elem.textContent = `${target.label} is NOW`;
      elem.style.color = "red";
    } else {
      elem.textContent = `${target.label} already passed`;
      elem.style.color = "gray";
    }
  });
}

setInterval(updateDailyTargets, 1000);
updateDailyTargets();
