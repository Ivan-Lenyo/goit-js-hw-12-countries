import './sass/main.scss';
import debounce from 'lodash.debounce';
import {
  alert,
  info,
  success,
  error,
  defaultModules
} from "../node_modules/@pnotify/core/dist/PNotify.js";
import "@pnotify/core/dist/BrightTheme.css";
import Api from '../src/js/fetchCountries.js';
import countryList from '../src/templates/country-list.hbs';
import countryCard from '../src/templates/country-card.hbs';


const refs = {
    form: document.querySelector('#form'),
    input: document.querySelector('#input'),
    container: document.querySelector('.container'),
};

refs.input.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
    e.preventDefault();
    const searchQuery = refs.input.value;

    Api.fetchCountries(searchQuery)
        .then(country => {
            if (country.length > 10) {
                error({
                    text: 'Too many matches! Please, type a more specific query!',
                });
                refs.container.innerHTML = '';
            } else if (country.status === 404) {
                info({
                    text: 'There is no such country!',
                });
            } else if (country.length === 1) {
                renderCountryCard(country);
            } else if (country.length <= 10) {
                renderCountryList(country);
            }
        })
        .catch(onFetchError);
};

function renderCountryCard(country) {
  const markupCard = countryCard(country);
  refs.container.innerHTML = markupCard;
};

function renderCountryList(country) {
  const markupList = countryList(country);
  refs.container.innerHTML = markupList;
};

function onFetchError(error) {
    alert({
        text: 'ERROR!',
    });
};