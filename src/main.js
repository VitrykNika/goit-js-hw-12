import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const form = document.querySelector('.form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');
const endMessage = document.createElement('p'); // створюємо повідомлення динамічно
endMessage.classList.add('end-message', 'is-hidden');
endMessage.style.textAlign = 'center';
endMessage.style.marginTop = '15px';
endMessage.style.fontSize = '16px';
document.querySelector('.controls').appendChild(endMessage);


let query = '';
let page = 1;
let totalHits = 0;
const IMAGES_PER_PAGE = 15;


form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);


async function onFormSubmit(event) {
  event.preventDefault();

  query = input.value.trim();
  page = 1;
  totalHits = 0;

  if (!query) {
    showToast('warning', 'Please enter a search query!');
    return;
  }

  clearGallery();
  hideLoadMoreButton();
  endMessage.classList.add('is-hidden');
  await fetchImages();
}

async function onLoadMore() {
  page += 1;
  hideLoadMoreButton();
  endMessage.classList.add('is-hidden');
  await fetchImages(true);
}


async function fetchImages(isLoadMore = false) {
  loader.classList.remove('is-hidden');

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0 && !isLoadMore) {
      showToast('info', 'Sorry, no images found.');
      return;
    }

      createGallery(data.hits, !isLoadMore);
    

    const imagesShown = page * IMAGES_PER_PAGE;

    if (imagesShown < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      if (imagesShown > 0) {
        endMessage.textContent = "We're sorry, but you've reached the end of search results.";
        endMessage.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    showToast('error', 'Something went wrong.');
    console.error(error);
  } finally {
    loader.classList.add('is-hidden');
  }
}


function showToast(type, message) {
  const options = {
    title: type === 'error' ? 'Error' :
           type === 'warning' ? 'Warning' :
           type === 'info' ? 'Info' : '',
    message,
    position: 'topRight',
  };
  iziToast[type](options);
}