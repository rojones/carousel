export default class Carousel {
  constructor(el) {
    this.el = el;
    this.options = JSON.parse(el.getAttribute('data-carousel-options'));
    this.apiUrl = `https://pixabay.com/api/?key=9656065-a4094594c34f9ac14c7fc4c39&q=${this.options.searchQuery}&image_type=photo`;
    this.count = this.options.slides;
    this.activeSlide = 0;
    this.container = el.querySelector('.carousel__slide-container');
    this.triggerPrev = el.querySelector('.controls__trigger--prev')
    this.triggerNext = el.querySelector('.controls__trigger--next')
    

    this.addListeners();
    this.fetchImages();
  }


  // move this to helpers later
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

  // convert api hits to html
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
    console.log(this.slides)
    this.changeActiveSlide(2)
  }

  // handle navigation
  changeActiveSlide(slideId) {
    this.activeSlide = slideId;

    this.slides.forEach((item) => {
      item.setAttribute('aria-hidden', true);
    });
    this.slides[slideId].setAttribute('aria-hidden', false);

    // Animate slides
    const slideWidth = parseInt(this.firstSlide.offsetWidth);
    const slideMargin = parseInt(getComputedStyle(this.firstSlide).marginRight);
    const totalSlideWidth = slideWidth + slideMargin;
    this.container.style.transform = `translateX(-${totalSlideWidth * slideId}px)`
  }

  // handle recalculation of carousel position etc
  onResize () {
    this.changeActiveSlide(this.activeSlide);
  }

  onTriggerPrev() {
    if (this.activeSlide > 0) {
      this.changeActiveSlide(this.activeSlide - 1);
    }
  }
  onTriggerNext() {
    if (this.activeSlide < (this.slides.length - 1)) {
      this.changeActiveSlide(this.activeSlide + 1)
    }
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