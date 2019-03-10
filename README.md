# Carousel

## Description
This is an HTML5 carousel. The template for it is in index.html, it takes options in the form of `data-carousel-options='{"searchQuery": "beautiful+goat", "count": 6}'`, where the searchQuery is the term to search pixabay for, and the count is the number of images to load into the carousel.

## Installation
Drop the files onto a local webserver (I use MAMP) to get started. Running `npm install` will pull everything you need to compile the project, and running the default `gulp` task will start a watcher that will actually put everything in the right place.

Minified versions of the assets can be created by running `gulp compile`.

## To do
- Although the project is reasonably robust as far as changing the styles without breaking the whole thing goes, a better system of managing the various breakpoints is needed.

- It is currently lacking any error messaging for when the Pixabay API fails to return relevant data

- Keyboard control better than just tabbing through the buttons would be a nice-to-have