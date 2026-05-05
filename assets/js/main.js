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
  
  // Lightbox para imágenes en posts
  const postImages = document.querySelectorAll('.post-content img');
  
  if (postImages.length > 0) {
    // Envolver cada imagen en un contenedor con clase zoom y añadir icono
    postImages.forEach(img => {
      const wrapper = document.createElement('span');
      wrapper.className = 'img-zoomable';
      
      const zoomIcon = document.createElement('span');
      zoomIcon.className = 'zoom-icon';
      zoomIcon.textContent = '🔍';
      
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      wrapper.appendChild(zoomIcon);
    });
    
    // Crear elemento lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<span class="lightbox-close">&times;</span><img src="" alt="">';
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Función para abrir lightbox
    function openLightbox(imgSrc, imgAlt) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Abrir lightbox al hacer clic en una imagen o en su icono
    postImages.forEach(img => {
      img.addEventListener('click', function() {
        openLightbox(this.src, this.alt);
      });
      
      const zoomIcon = img.nextElementSibling;
      if (zoomIcon && zoomIcon.classList.contains('zoom-icon')) {
        zoomIcon.addEventListener('click', function(e) {
          e.stopPropagation();
          openLightbox(img.src, img.alt);
        });
      }
    });
    
    // Cerrar lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
