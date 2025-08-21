import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let lightbox = null;

function createGallery(images, isNewSearch = false) {
  if (!images.length) return;

  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <ul class="stats">
          <li class="stats-item"><b>Likes:</b> ${likes}</li>
          <li class="stats-item"><b>Views:</b> ${views}</li>
          <li class="stats-item"><b>Comments:</b> ${comments}</li>
          <li class="stats-item"><b>Downloads:</b> ${downloads}</li>
        </ul>
      </li>
    `
    )
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }

  if (!isNewSearch) {
    const { height: cardHeight } =
      galleryContainer.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

function clearGallery() {
  galleryContainer.innerHTML = '';
}

function showLoader() {
  loader.classList.remove('is-hidden');
}

function hideLoader() {
  loader.classList.add('is-hidden');
}

function showLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}

export {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
};