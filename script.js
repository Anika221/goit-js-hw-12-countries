import './style.css';
import fetchCountries from './fetchCountries';
import { error, info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import debounce from 'lodash.debounce';

const refs = {
  input: document.querySelector('#search-box'),
  container: document.querySelector('.js-container'),
};

// Шаблон для однієї країни
function countryCardTpl(country) {
  return `
    <div class="country-card">
      <h2>${country.name}</h2>
      <img src="${country.flag}" alt="Прапор ${country.name}" width="200">
      <p><b>Столиця:</b> ${country.capital}</p>
      <p><b>Населення:</b> ${country.population}</p>
      <p><b>Мови:</b> ${country.languages.map(l => l.name).join(', ')}</p>
    </div>
  `;
}

// Шаблон для списку 2–10 країн
function countryListTpl(countries) {
  return `
    <ul class="country-list">
      ${countries
        .map(c => `<li><img src="${c.flag}" width="50"> ${c.name}</li>`)
        .join('')}
    </ul>
  `;
}

// Обробник вводу з debounce 500 мс
refs.input.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  const query = e.target.value.trim();

  if (!query) {
    refs.container.innerHTML = '';
    return;
  }

  fetchCountries(query)
    .then(countries => {
      refs.container.innerHTML = '';

      if (countries.length > 10) {
        info({ text: 'Занадто багато збігів. Уточніть пошук!' });
        return;
      }

      if (countries.length >= 2 && countries.length <= 10) {
        refs.container.innerHTML = countryListTpl(countries);
        return;
      }

      if (countries.length === 1) {
        refs.container.innerHTML = countryCardTpl(countries[0]);
      }
    })
    .catch(() => {
      error({ text: 'Країну не знайдено' });
    });
}
