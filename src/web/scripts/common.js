function insertExternalResources() {
  document.head.innerHTML += (`
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css" />
  `);
}

function createHeader() {
  const header = document.createElement("header");
  header.innerHTML = `<h1>Travel Site</h1>`;
  return header;
}

function createFooter() {
  const footer = document.createElement("footer");
  footer.innerHTML = `<p>End of page.</p>`;
  return footer;
}

function createSidebar() {
  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";
  sidebar.append(createClockWidget());
  sidebar.append(createBackgroundModeWidget());
  sidebar.append(createContentZoomWidget());
  return sidebar;
}

function createNavbar() {
  const navbar = document.createElement("div");
  navbar.className = "navbar";
  navbar.innerHTML = (`
    <a class="navbar-link" href="index.html">Home<a/>
    <a class="navbar-link" href="cart.html">Cart<a/>
    <a class="navbar-link" href="stays.html">Stays<a/>
    <a class="navbar-link" href="flights.html">Flights<a/>
    <a class="navbar-link" href="cars.html">Cars<a/>
    <a class="navbar-link" href="cruises.html">Cruises<a/>
    <a class="navbar-link" href="contact.html">Contact Us<a/>`);
  return navbar;
}

function createClockWidget() {
  const clock = document.createElement("div");
  clock.className = "sidebar-widget";
  clock.innerHTML = (`
    <div class="sidebar-widget-label">Date & Time</div>
    <div id="date" style="font-weight:300;">${Clock.getCurrentDateText()}</div>
    <div id="time" style="font-weight:200;font-size:24px;">${Clock.getCurrentTimeText()}</div>`);
  setInterval(Clock.update, 1000);
  return clock;
}

function createBackgroundModeWidget() {
  const backgroundSwitch = document.createElement("div");
  backgroundSwitch.className = "sidebar-widget";
  backgroundSwitch.innerHTML = (`
    <div class="sidebar-widget-label">Background Mode</div>
    <button onclick="Body.setLightTheme()">Light</button>
    <button onclick="Body.setDarkTheme()">Dark</button>`);
  return backgroundSwitch;
}

function createContentZoomWidget() {
  const zoomSwitch = document.createElement("div");
  zoomSwitch.className = "sidebar-widget";
  zoomSwitch.innerHTML = (`
    <div id="content-zoom-label" class="sidebar-widget-label">Content Zoom: ${Content.getFontSize()}</div>
    <button onclick="Content.zoomOut()">-</button>
    <button onclick="Content.zoomIn()">+</button>`);
  return zoomSwitch;
}

document.addEventListener("DOMContentLoaded", () => {
  insertExternalResources();
  const mainElement = document.getElementById("main");
  mainElement.insertBefore(createSidebar(), mainElement.firstChild);
  document.body.insertBefore(createNavbar(), document.body.firstChild);
  document.body.insertBefore(createHeader(), document.body.firstChild);
  document.body.appendChild(createNavbar());
  document.body.appendChild(createFooter());
  Body.setInitialTheme();
  Content.setInitialZoom();
});

class Clock {
  static update() {
    document.getElementById("date").textContent = Clock.getCurrentDateText();
    document.getElementById("time").textContent = Clock.getCurrentTimeText();
  }

  static getCurrentDateText() {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static getCurrentTimeText() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    return `${hours}:${minutes}:${seconds} ${Clock.getTimeZoneAbbreviation()}`;
  }

  static getTimeZoneAbbreviation() {
    const date = new Date();
    const options = { timeZoneName: "short" };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(date);

    const timezonePart = parts.find(part => part.type === "timeZoneName");
    return timezonePart ? timezonePart.value : null;
  }
}

class Body {
  static setInitialTheme() {
    switch (localStorage.getItem('THEME')) {
      case 'light': return Body.setLightTheme();
      case 'dark': return Body.setDarkTheme();
    }
  }

  static setLightTheme() {
    localStorage.setItem('THEME', 'light');
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#000000";
  }

  static setDarkTheme() {
    localStorage.setItem('THEME', 'dark');
    document.body.style.backgroundColor = "#1F1F1F";
    document.body.style.color = "#FFFFFF";
  }
}

class Content {
  static getFontSize() {
    return parseInt(localStorage.getItem('CONTENT_FONT_SIZE') ?? '16');
  }

  static setInitialZoom() {
    this.setZoom(Content.getFontSize());
  }

  static zoomOut() {
    const fontSize = Content.getFontSize();
    if (fontSize > 12) Content.setZoom(fontSize - 1);
  }

  static zoomIn() {
    const fontSize = Content.getFontSize();
    if (fontSize < 20) Content.setZoom(fontSize + 1);
  }

  static setZoom(fontSize) {
    localStorage.setItem("CONTENT_FONT_SIZE", fontSize)
    document.getElementById("content").style.fontSize = fontSize;
    document.getElementById("content-zoom-label").textContent = `Content Zoom: ${fontSize}`
  }
}
