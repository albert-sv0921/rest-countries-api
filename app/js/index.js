"strict mode";

// dark-mode switch

let modeSwitcher = "light";
const url = "https://restcountries.com/v3.1/";

const modeSwitch = document.querySelector(".switch");
const header = document.querySelector(".header");
const containerDOM = document.querySelector(".main");
const searchInput = document.getElementById("search");
const selectInput = document.getElementById("region");

modeSwitch.addEventListener("click", (e) => {
  modeSwitcher = modeSwitcher === "light" ? "dark" : "light";

  if (modeSwitcher === "light") {
    document.body.style.color = "hsl(200, 15%, 8%)";
    document.body.style.backgroundColor = "hsl(0, 0%, 98%)";
    header.style.backgroundColor = "hsl(0, 0%, 100%)";

    searchInput.style.backgroundColor = "hsl(0, 0%, 100%)";
    searchInput.parentElement.style.backgroundColor = "hsl(0, 0%, 100%)";
    searchInput.style.color = "hsl(200, 15%, 8%)";

    selectInput.style.backgroundColor = "hsl(0, 0%, 100%)";
    selectInput.style.color = "hsl(200, 15%, 8%)";

    containerDOM.innerHTML = "";
  }

  if (modeSwitcher === "dark") {
    document.body.style.color = "hsl(0, 0%, 100%)";
    document.body.style.backgroundColor = "hsl(207, 26%, 17%)";
    header.style.backgroundColor = "hsl(209, 23%, 22%)";

    searchInput.style.backgroundColor = "hsl(209, 23%, 22%)";
    searchInput.parentElement.style.backgroundColor = "hsl(209, 23%, 22%)";
    searchInput.style.color = "hsl(0, 0%, 100%)";

    selectInput.style.backgroundColor = "hsl(209, 23%, 22%)";
    selectInput.style.color = "hsl(0, 0%, 100%)";

    containerDOM.innerHTML = "";
  }
});

async function getAllCountries() {
  containerDOM.innerHTML = "";

  const res = await fetch(url + "all");
  const data = await res.json();

  data.forEach((element) => {
    const { name, capital, region, population, flags } = element;

    const markup = `
      <div class="card">
      <div class="image">
        <img src="${flags.svg}" alt="${name.common} flag" />
      </div>
      <p class="country">${name.common}</p>
      <p class="population">
        <span class="bold">Population:</span>
        <span>${population}</span>
      </p>
      <p class="region">
        <span class="bold">Region:</span>
        <span>${region}</span>
      </p>
      <p class="capital">
        <span class="bold">Capital:</span>
        <span>${capital}</span>
      </p>
    </div>
      `;

    containerDOM.insertAdjacentHTML("beforeend", markup);
  });
}

// getAllCountries();

// search country logic

searchInput.addEventListener("input", (e) => getQueryCountry(e));

async function getQueryCountry(e) {
  if (!e.target.value) return getAllCountries();

  containerDOM.innerHTML = "";

  const input = e.target.id === "search" ? "name/" : "region/";

  const query = `${input}${e.target.value}`;
  const res = await fetch(url + query);
  const data = await res.json();

  data.forEach((element) => {
    const { name, capital, region, population, flags } = element;

    const markup = `
      <div class="card ${
        modeSwitcher === "light" ? "darkText whiteEl" : "whiteText darkEl"
      }">
      <div class="image">
        <img src="${flags.svg}" alt="${name.common} flag" />
      </div>
      <p class="country">${name.common}</p>
      <p class="population">
        <span class="bold">Population:</span>
        <span>${population}</span>
      </p>
      <p class="region">
        <span class="bold">Region:</span>
        <span>${region}</span>
      </p>
      <p class="capital">
        <span class="bold">Capital:</span>
        <span>${capital}</span>
      </p>
    </div>
      `;

    containerDOM.insertAdjacentHTML("beforeend", markup);
  });
}

selectInput.addEventListener("input", (e) => getQueryCountry(e));

// details modal window

document.body.addEventListener("click", (e) => {
  if (!e.target.closest(".btn-back")) return;
  document.querySelector(".modal").remove();
});

async function getCountryDetails(countryName) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
  const data = await res.json();

  const currencies = Object.entries(data[0].currencies)[0][1].name;
  const languages = Object.values(data[0].languages).join(", ");
  const { name, capital, region, population, flags, subregion, tld } = data[0];

  const markup = `<div class="modal ${
    modeSwitcher === "light" ? "darkText whiteEl" : "whiteText darkEl"
  }">
    <div class="btn__container ">
      <button type="button" class="btn-back ${
        modeSwitcher === "light" ? "darkText whiteEl" : "whiteText darkEl"
      }">&larr; Back</button>
    </div>
    <div class="details__container">
      <div class="details__image">
        <img src="${flags.svg}" alt="${name.common} flag" />
      </div>
      <div class="details__info">
        <h2 class="info__country">${name.common}</h2>
        <div class="flex">
          <div class="info-left">
            <p>
              <span class="bold">Native Name:</span>
              <span>${name.official}</span>
            </p>
            <p>
              <span class="bold">Population:</span>
              <span>${population}</span>
            </p>
            <p>
              <span class="bold">Region:</span>
              <span>${region}</span>
            </p>
            <p>
              <span class="bold">Sub Region:</span>
              <span>${subregion}</span>
            </p>
            <p>
              <span class="bold">Capital:</span>
              <span>${capital}</span>
            </p>
          </div>
          <div class="info-right">
            <p>
              <span class="bold">Top Level Domain:</span>
              <span>${tld[0]}</span>
            </p>
            <p>
              <span class="bold">Currencies:</span>
              <span>${currencies}</span>
            </p>
            <p>
              <span class="bold">Languages:</span>
              <span>${languages}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  containerDOM.innerHTML = "";
  containerDOM.insertAdjacentHTML("afterend", markup);
}

containerDOM.addEventListener("click", (e) => {
  if (!e.target.closest(".card")) return;

  const query = e.target.closest(".card").querySelector(".country").textContent;
  getCountryDetails(query);
});
