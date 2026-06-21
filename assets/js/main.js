// Script principal para dataXbi

// Toggle menú móvil
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      const expanded = mainNav.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', expanded);
    });
  }
  
  // Cerrar menú al hacer clic en un enlace
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      mainNav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const sortButton = document.querySelector('[data-sort-posts]');
  const sortablePosts = document.querySelector('[data-sortable-posts]');

  if (sortButton && sortablePosts) {
    sortButton.addEventListener('click', function() {
      const nextOrder = sortButton.dataset.sortOrder === 'desc' ? 'asc' : 'desc';
      const posts = [...sortablePosts.querySelectorAll('.blog-item')];

      posts.sort((firstPost, secondPost) => {
        const firstDate = firstPost.dataset.postDate || '';
        const secondDate = secondPost.dataset.postDate || '';
        const firstIndex = Number(firstPost.dataset.postIndex || 0);
        const secondIndex = Number(secondPost.dataset.postIndex || 0);

        if (firstDate === secondDate) {
          return firstIndex - secondIndex;
        }

        return nextOrder === 'asc'
          ? firstDate.localeCompare(secondDate)
          : secondDate.localeCompare(firstDate);
      });

      posts.forEach(post => sortablePosts.appendChild(post));
      sortButton.dataset.sortOrder = nextOrder;
      sortButton.setAttribute('aria-pressed', nextOrder === 'asc');
      sortButton.textContent = nextOrder === 'asc'
        ? 'Fecha: antiguos primero'
        : 'Fecha: recientes primero';
    });
  }
  
  // Lightbox para imágenes, vídeos e iframes de YouTube en posts
  const zoomableMedia = document.querySelectorAll('.post-content img, .post-content video');
  const youtubeEmbeds = document.querySelectorAll('.post-content iframe[src*="youtube.com/embed/"], .post-content iframe[src*="youtu.be/"]');

  if (zoomableMedia.length > 0 || youtubeEmbeds.length > 0) {
    const allZoomables = [...zoomableMedia, ...youtubeEmbeds];

    allZoomables.forEach(media => {
      if (media.closest('.img-zoomable, .video-embed-zoomable')) {
        return;
      }

      if (media.tagName === 'IMG' && media.alt && !media.title) {
        media.title = media.alt;
      }

      const wrapper = document.createElement(media.tagName === 'IFRAME' ? 'div' : 'span');
      wrapper.className = media.tagName === 'IFRAME' ? 'video-embed-zoomable' : 'img-zoomable';

      const zoomIcon = document.createElement('button');
      zoomIcon.type = 'button';
      zoomIcon.className = 'zoom-icon';
      zoomIcon.textContent = '🔍';
      zoomIcon.setAttribute('aria-label', 'Ampliar contenido');

      media.parentNode.insertBefore(wrapper, media);
      wrapper.appendChild(media);
      wrapper.appendChild(zoomIcon);
    });

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<span class="lightbox-close">&times;</span><div class="lightbox-content"></div>';
    document.body.appendChild(lightbox);

    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    function openLightbox(media) {
      lightboxContent.innerHTML = '';

      let expandedMedia;

      if (media.tagName === 'VIDEO') {
        expandedMedia = media.cloneNode(true);
        expandedMedia.controls = true;
        expandedMedia.autoplay = true;
        expandedMedia.loop = media.loop;
        expandedMedia.muted = false;
        expandedMedia.playsInline = true;
      } else if (media.tagName === 'IFRAME') {
        expandedMedia = media.cloneNode(true);
        expandedMedia.width = '1280';
        expandedMedia.height = '720';
        expandedMedia.setAttribute('allowfullscreen', 'allowfullscreen');
        expandedMedia.setAttribute(
          'allow',
          media.getAttribute('allow') || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        );
      } else {
        expandedMedia = document.createElement('img');
        expandedMedia.src = media.currentSrc || media.src;
        expandedMedia.alt = media.alt || '';
      }

      lightboxContent.appendChild(expandedMedia);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    zoomableMedia.forEach(media => {
      media.addEventListener('click', function() {
        openLightbox(this);
      });
    });

    allZoomables.forEach(media => {
      const zoomIcon = media.nextElementSibling;
      if (zoomIcon && zoomIcon.classList.contains('zoom-icon')) {
        zoomIcon.addEventListener('click', function(e) {
          e.stopPropagation();
          openLightbox(media);
        });
      }
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightboxContent.innerHTML = '';
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
