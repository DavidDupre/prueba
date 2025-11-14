export default {
  mounted(el: HTMLElement) {
    function loadImage() {
      const imageElement = el instanceof HTMLImageElement ? el : el.querySelector('img');
      if (imageElement) {
        // console.log('Cargando imagen:', imageElement.dataset.url);
        imageElement.addEventListener('error', () => console.error('Error loading image:', imageElement.dataset.url));
        imageElement.src = imageElement.dataset.url || '';
      }
    }

    function handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage();
          observer.unobserve(entry.target);
        }
      });
    }

    function createObserver() {
      const options = {
        root: null,
        threshold: 0,
      };
      const observer = new IntersectionObserver(handleIntersect, options);
      observer.observe(el);
    }

    if ('IntersectionObserver' in window) {
      createObserver();
    } else {
      loadImage();
    }
  }
};
