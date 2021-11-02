import NewApiService from './new-service'
import hitsTpl from '../templates/cardImages.hbs'
// import LoadMoreBtn from './loadMoreBtn'
import getRefs from './refs'
const refs = getRefs()

import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import * as basicLightbox from 'basiclightbox'



// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });
const newApiService = new NewApiService()

refs.searchForm.addEventListener('submit', onSearch)
// loadMoreBtn.refs.button.addEventListener('click', fetchHits)
refs.galleryContainer.addEventListener('click', onImageClick)

function onImageClick(e) {
  e.preventDefault()
  if (e.target.nodeName !== 'IMG') {
    return
  }

  const bigImageSrc = e.target.getAttribute('data-src')
  const instance = basicLightbox.create(`<img src=${bigImageSrc} />`)
  instance.show()
}


function onSearch(e) {
  e.preventDefault()
  newApiService.query = e.currentTarget.elements.query.value
  if (newApiService.query === '') {
    return error({
     title: 'Введите свой запрос!'
    })
  }

  // loadMoreBtn.show()
  newApiService.resetPage()
  clearHitsContainer()
  fetchHits()
}

function fetchHits() {
  // loadMoreBtn.disable()
  newApiService.fetchImages().then(hits => {
    if (hits.length === 0) {
      // loadMoreBtn.hide()
      return 
    }
    uppdataHitsMarkup(hits)
    // loadMoreBtn.enable()
  })
}

function uppdataHitsMarkup(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', hitsTpl(hits))
  const element = document.querySelector(`#i${hits[0].id}`);
  element.scrollIntoView({
  behavior: 'smooth',
  block: 'end',
  });

}

function clearHitsContainer() {
  refs.galleryContainer.innerHTML = ''
}

// Intersection Observer

  const onEntry = entries => {
    entries.forEach(entry => {
      // console.log('newApiService.query', newApiService.query);
    if (entry.isIntersecting && newApiService.query !== '') {
      console.log('Пара грузить'+ Date.now());
      fetchHits()
      newApiService.incrementPage()
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '200px'
})
  
observer.observe(refs.sentinel)
  

