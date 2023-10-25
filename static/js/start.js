window.addEventListener('load', event => {
  var image = document.querySelector('.landingImg');
  var isLoaded = image.complete && image.naturalHeight !== 0;
  if (isLoaded) {
    document.body.style.display = 'block';
  }
});
