import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const countryURL = 'https://restcountries.com/v3.1/name/';
const filterFields = '?fields=name,capital,population,flags,languages';

const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(onInputPromise, DEBOUNCE_DELAY));

function onInputPromise(event) {
  clearData();

  if (event.target.value.trim()) {
    return fetchCountries(event.target.value.trim()).then(countries =>
      renderResult(countries)
    );
  }
}

function fetchCountries(name) {
  return fetch(countryURL + name + filterFields)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      if (error.message == '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else {
        Notiflix.Notify.failure('Unexpected error');
      }
    });
}

function renderResult(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (1 < countries.length) {
    console.log('Found from 2 to 10');
    renderCountries(countries);
  } else {
    console.log('Bingo');
    renderCountry(countries);
  }
}

function renderCountries(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountry(countries) {
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `
  <div class="country__flag">
    <img class="country__img" src="${flags.svg}" alt="flag">
    <p class="country__name">${name.official}</p>
  </div>
  <ul class="country__info">
      <li class="country__item"> <b>Capital</b>:
    <span class="country__span">${capital}</span>
      </li>
      <li class="country__item"> <b>Population</b>:
    <span class="country__span">${population}</span>
      </li>
      <li class="country__item"> <b>Languages</b>:
    <span class="country__span">${Object.values(languages).join(', ')}</span>
      </li>
  </ul>`;
    })
    .join('');

  countryInfo.innerHTML = markup;
}

function clearData() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
