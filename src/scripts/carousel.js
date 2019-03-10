export default class Carousel {
  constructor(el) {
    this.options = JSON.parse(el.getAttribute('data-carousel-options'));
    this.apiUrl = `https://pixabay.com/api/?key=9656065-a4094594c34f9ac14c7fc4c39&q=${this.options.searchQuery}&image_type=photo`
    this.count = this.options.slides;

    this.container = el.querySelector('.carousel__slide-container')

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
      const url, user, tags = hits[i];

      slides = slides + `<li class="carousel__slide">
                          <figure>
                            <img src="${url}" alt="Image representing the tags '${tags}'">
                            <figcaption class="carousel__caption">${user}</figcaption>
                          </figure>
                        </li>`
    }
    this.container.innerHTML = slides;
  }

  // handle recalculation of carousel position etc
  onResize () {

  }

  // handle navigation

}