export default class Carousel {
  constructor(el) {
    this.el = el;
    this.options = JSON.parse(el.getAttribute('data-carousel-options'));
    this.apiUrl = `https://pixabay.com/api/?key=9656065-a4094594c34f9ac14c7fc4c39&q=${this.options.searchQuery}&image_type=photo`;
    this.count = this.options.slides;
    this.activeSlide = 0;
    this.visibleSlides = 2;
    this.container = el.querySelector('.carousel__slide-container');
    this.triggerPrev = el.querySelector('.controls__trigger--prev');
    this.triggerNext = el.querySelector('.controls__trigger--next');

    this.addListeners();
    this.fetchImages();
  }


  // Basic function to retrieve images fro pixabay api
  getCORS(url, success) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = success;
    xhr.send();
    return xhr;
  }

  fetchImages() {
    this.getCORS(this.apiUrl, (request) => {
      // get response from api
      const response = JSON.parse(request.currentTarget.response || request.target.responseText);

      // snip out relevant part of response for processing
      let hits = [];
      for (let i = 0; i < this.options.count; i++) {
        hits.push(response.hits[i])
      }
      this.buildCarousel(hits);
    });
  }

  // Convert api hits to html
  buildCarousel(hits) {
    let slides = ``;
    for (let i = 0; i < hits.length; i++) {
      const {webformatURL, user, tags} = hits[i];
      slides = slides + `<li class="carousel__slide" aria-hidden="true">
                          <figure>
                            <img src="${webformatURL}" alt="Image representing the tags '${tags}'">
                            <figcaption class="carousel__caption">${user}</figcaption>
                          </figure>
                        </li>`
    }
    this.container.innerHTML = slides;
    
    this.firstSlide = this.el.querySelector('.carousel__slide');
    this.slides = this.el.querySelectorAll('.carousel__slide');
    this.onResize();
  }

  // Handle navigation
  changeActiveSlide(slideId) {
    // Ensure we haven't scrolled too far due to resizing or similar
    if (slideId <= this.visibleSlides) {
      this.activeSlide = this.visibleSlides;
    } else if (slideId >= this.slides.length - (this.visibleSlides + 1)) {
      this.activeSlide = this.slides.length - (this.visibleSlides + 1);
    } else {
      this.activeSlide = slideId;
    }


    // Set aria-hidden values dependant on number of visible slides
    this.slides.forEach((item, i) => {
      if (i < this.activeSlide - this.visibleSlides || i > this.activeSlide + this.visibleSlides) {
        item.setAttribute('aria-hidden', true);
      } else {
        item.setAttribute('aria-hidden', false);
      }
    });

    // Animate slides by setting the offset of the slide container
    const slideWidth = parseInt(this.firstSlide.offsetWidth);
    const slideMargin = parseInt(getComputedStyle(this.firstSlide).marginRight);
    const totalSlideWidth = slideWidth + slideMargin;
    this.container.style.transform = `translateX(-${totalSlideWidth * this.activeSlide}px)`
  }

  // Handle recalculation of carousel position etc
  onResize () {

    // This could be upgraded later to handle more varied cases
    if (window.innerWidth <= 480) {
      this.visibleSlides = 0;
    } else if (window.innerWidth <= 768) {
      this.visibleSlides = 1;
    } else {
      this.visibleSlides = 2;
    }

    // The offset and aria-hidden state need to be recalculated based on the size and number of the images
    this.changeActiveSlide(this.activeSlide);
  }

  onTriggerPrev() {
    this.changeActiveSlide(this.activeSlide - 1);
  }
  onTriggerNext() {
    this.changeActiveSlide(this.activeSlide + 1)
  }

  addListeners() {
    this.triggerPrev.addEventListener('click', () => {
      this.onTriggerPrev();
    });
    this.triggerNext.addEventListener('click', () => {
      this.onTriggerNext();
    });
    window.addEventListener('resize', () => {
      this.onResize();
    });
  }
}