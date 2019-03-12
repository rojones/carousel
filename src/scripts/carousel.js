export default class Carousel {
  constructor(el) {
    this.el = el;
    this.options = JSON.parse(el.getAttribute('data-carousel-options'));
    this.apiUrl = `https://pixabay.com/api/?key=9656065-a4094594c34f9ac14c7fc4c39&q=${this.options.searchQuery}&image_type=photo`;
    this.count = this.options.slides;
    this.activeSlide = 0;
    this.visibleSlides = 2;
    
    this.fetchImages();
  }


  // Basic function to retrieve images from pixabay api
  getCORS(url, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = success;
    xhr.onerror = error;
    xhr.send();
    return xhr;
  }

  // Fetch images and then call the buildCarousel function
  fetchImages() {
    this.getCORS(this.apiUrl, (request) => {
      // Parse response from api as an object
      const response = JSON.parse(request.currentTarget.response || request.target.responseText);

      // Snip out relevant part of response for processing
      let hits = [];
      for (let i = 0; i < this.options.count; i++) {
        hits.push(response.hits[i])
      }
      this.buildCarousel(hits);
    }, (error) => {
      this.displayError();
    });
  }

  // Convert api hits to html and inject
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

    const carouselBody = `<div class="carousel__track">
                            <ul class="carousel__slide-container">
                              ${slides}
                            </ul>
                          </div>
                          <div class="controls">
                            <button class="controls__trigger controls__trigger--prev">
                              Prev
                              <svg>
                                <title>Previous arrow</title>
                                <use xlink:href="dist/svg/arrow.svg#Layer_1"></use>
                              </svg>
                            </button>
                            <button class="controls__trigger controls__trigger--next">
                              Next
                              <svg>
                                <title>Next arrow</title>
                                <use xlink:href="dist/svg/arrow.svg#Layer_1"></use>
                              </svg>
                            </button>
                          </div>`

    this.el.innerHTML = carouselBody;
    this.firstSlide = this.el.querySelector('.carousel__slide');
    this.slides = this.el.querySelectorAll('.carousel__slide');
    this.container = this.el.querySelector('.carousel__slide-container');
    this.triggerPrev = this.el.querySelector('.controls__trigger--prev');
    this.triggerNext = this.el.querySelector('.controls__trigger--next');

    this.recalculate();

    this.addListeners();
  }

  // Handle navigation
  changeActiveSlide(slideId) {
    // Ensure we haven't scrolled too far due to resizing or similar
    if (slideId <= this.visibleSlides) {
      this.activeSlide = this.visibleSlides;
      this.triggerPrev.disabled = true;
      this.triggerNext.disabled = false;
    } else if (slideId >= this.slides.length - (this.visibleSlides + 1)) {
      this.activeSlide = this.slides.length - (this.visibleSlides + 1);
      this.triggerPrev.disabled = false;
      this.triggerNext.disabled = true;
    } else {
      this.activeSlide = slideId;
      this.triggerPrev.disabled = false;
      this.triggerNext.disabled = false;
    }

    // Set aria-hidden values dependant on number of visible slides
    this.slides.forEach((item, i) => {
      if (i < this.activeSlide - this.visibleSlides || i > this.activeSlide + this.visibleSlides) {
        item.setAttribute('aria-hidden', true);
      } else {
        item.setAttribute('aria-hidden', false);
      }
    });

    // Animate slides by setting the offset of the slide container based on the width of a single slide and its margin
    const slideWidth = parseInt(this.firstSlide.offsetWidth);
    const slideMargin = parseInt(getComputedStyle(this.firstSlide).marginRight);
    const totalSlideWidth = slideWidth + slideMargin;
    this.container.style.transform = `translateX(-${totalSlideWidth * this.activeSlide}px)`
  }

  // Handle repositioning carousel elements due to resizing or other changes
  recalculate() {
    // This could be upgraded later to handle more varied cases
    if (window.innerWidth <= 480) {
      this.visibleSlides = 0;
    } else if (window.innerWidth <= 768) {
      this.visibleSlides = 1;
    } else {
      this.visibleSlides = 2;
    }
    this.changeActiveSlide(this.activeSlide);
  }

  // Display a message if the api returns an error
  displayError() {
    const errorMessage = `<li class="carousel__indicator carousel__indicator--error">There has been an error, please try loading the page again.</li>`
    this.container.innerHTML = errorMessage;
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
      this.recalculate();
    });
  }
}