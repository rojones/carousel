import attach from 'attach.js';
import Carousel from './carousel';



attach.add('Carousel',function(el){
  new Carousel(el);
});

document.addEventListener("DOMContentLoaded",function(){
  attach.run();
});