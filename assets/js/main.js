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
  
  // Lightbox para imágenes y vídeos en posts
  const zoomableMedia = document.querySelectorAll('.post-content img, .post-content video');

  if (zoomableMedia.length > 0) {
    zoomableMedia.forEach(media => {
      if (media.closest('.img-zoomable')) {
        return;
      }

      if (media.tagName === 'IMG' && media.alt && !media.title) {
        media.title = media.alt;
      }

      const wrapper = document.createElement('span');
      wrapper.className = 'img-zoomable';

      const zoomIcon = document.createElement('span');
      zoomIcon.className = 'zoom-icon';
      zoomIcon.textContent = '🔍';

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
