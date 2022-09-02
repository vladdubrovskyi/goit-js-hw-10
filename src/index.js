import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');
const cleanMarkup = ref => (ref.innerHTML = '');

function createMarkupCard(data) {
  return data.map(
    ({ flags, name, capital, population, languages }) => `
    <div class="country-info">
      <div class="country-info__wrapper">
        <img class="country-info__flags" src="${flags.svg}" alt="${
      name.official
    }" width="50" />
        <h2 class="country-info__name">${name.official}</h2>
      </div>
      <p class="country-info__capital"><span class="country-info__weight">Capital:</span> ${capital}</p>
      <p class="country-info__population"><span class="country-info__weight">Population:</span> ${population}</p>
      <p class="country-info__languages"><span class="country-info__weight">Languages:</span> ${Object.values(
        languages
      )}</p>
    </div>
  `
  );
}

function countryListTemplate(data) {
  return data.map(
    ({ name, flags }) =>
      `<li class = "country-list__item"><img class = "country-list__img" src="${flags.svg}" alt="${name.official}" width="60" height="50">${name.official}</li>`
  );
}

function onInput(e) {
  let text = e.target.value.trim();

  if (!text) {
    cleanMarkup(listEl);
    cleanMarkup(divEl);
    return;
  }

  fetchCountries(text)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }

      const renderMarkup = data => {
        if (data.length === 1) {
          cleanMarkup(listEl);
          divEl.innerHTML = createMarkupCard(data);
        } else {
          cleanMarkup(divEl);
          listEl.innerHTML = countryListTemplate(data);
        }
      };
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(listEl);
      cleanMarkup(divEl);
      Notify.failure('Oops, there is no country with that name');
    });
}

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
