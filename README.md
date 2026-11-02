# Sitio web dataXbi

Sitio web oficial de dataXbi construido con Jekyll y alojado en GitHub Pages.

🌐 **URL**: https://dataxbi.github.io

---

## 📁 Estructura del proyecto

```
website/
├── _layouts/          # Plantillas HTML base
│   ├── default.html   # Layout principal
│   ├── page.html      # Para páginas estáticas
│   ├── post.html      # Para artículos del blog
│   └── home.html      # Para la página home
├── _includes/         # Componentes reutilizables
│   ├── header.html    # Navegación principal
│   ├── footer.html    # Pie de página
│   └── cta-button.html # Botón CTA reutilizable
├── _posts/            # Artículos del blog (YYYY-MM-DD-titulo.md)
├── assets/
│   ├── css/           # Estilos CSS
│   ├── images/        # Imágenes
│   └── js/            # JavaScript
├── blog/              # Página listado del blog
├── libro-introduccion-fabric/  # Página del libro
├── taller-de-powerbi-a-microsoft-fabric/ # Página del taller
├── servicios/         # Página de servicios
├── quienes-somos/     # Página quiénes somos
├── contacto/          # Página de contacto
├── _config.yml        # Configuración de Jekyll
└── index.html         # Página principal
```

---

## 📝 Crear contenido

### Nuevo artículo del blog

Crear archivo en `_posts/` con formato `YYYY-MM-DD-titulo.md`:

```markdown
---
layout: post
title: "Título del artículo"
date: 2026-01-02
author: "dataXbi"
tags: [fabric, powerbi]
description: "Descripción breve para SEO"
---

Contenido del artículo en Markdown...
```

### Nueva página

Crear archivo HTML o Markdown en la carpeta correspondiente:

```markdown
---
layout: page
title: "Título de la página"
description: "Descripción para SEO"
permalink: /ruta-url/
---

Contenido...
```

---

## 🎨 Personalización

### Colores

Editar variables CSS en `assets/css/main.css`:

```css
:root {
  --color-primary: #0066cc;
  --color-primary-dark: #004d99;
  /* ... */
}
```

### Navegación

Editar en `_config.yml`:

```yaml
navigation:
  - title: "Nuevo menú"
    url: "/nueva-pagina/"
```

---

## 🚀 Publicación

GitHub Pages compila automáticamente el sitio en cada push a la rama `main`.

- Los cambios se publican en pocos minutos
- Verificar el estado en: **Actions** (pestaña del repositorio)
- URL del sitio: https://dataxbi.github.io

### Dominio personalizado (futuro)

Cuando esté listo para usar un dominio propio:

1. Crear archivo `CNAME` en la raíz con: `www.dataxbi.com`
2. Configurar DNS (CNAME) apuntando a `dataxbi.github.io`
3. Actualizar `_config.yml`: `url: "https://www.dataxbi.com"` y `baseurl: ""`

---

## 📚 Recursos

- [Jekyll Docs](https://jekyllrb.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/es/pages)
- [Instrucciones del proyecto](.github/copilot-instructions.md)

---

## 🔧 Solución de problemas

### El sitio no compila

- Verificar sintaxis en `_config.yml`
- Revisar front matter de los archivos
- Ver logs en la pestaña **Actions** de GitHub

### Las imágenes no aparecen

- Usar rutas: `{{ site.baseurl }}/assets/images/nombre.jpg`
- Verificar que las imágenes existan en `assets/images/`

### Los estilos no cargan

- Verificar todas las rutas que incluyan `{{ site.baseurl }}`
- Revisar que `assets/css/main.css` exista
