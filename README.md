# Sitio web dataXbi

Sitio web oficial de dataXbi construido con Jekyll y alojado en GitHub Pages.

## 🚀 Desarrollo local

### Requisitos previos

- Ruby 2.7 o superior
- Bundler

### Instalación

```bash
# Instalar dependencias
bundle install

# Ejecutar servidor de desarrollo
bundle exec jekyll serve --livereload

# El sitio estará disponible en http://localhost:4000
```

### Compilación

```bash
bundle exec jekyll build
```

El sitio compilado se generará en la carpeta `_site/`.

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
├── formacion/         # Página de formación
├── servicios/         # Página de servicios
├── quienes-somos/     # Página quiénes somos
├── contacto/          # Página de contacto
├── _config.yml        # Configuración de Jekyll
├── Gemfile            # Dependencias Ruby
└── index.html         # Página principal
```

## 🌐 Publicación en GitHub Pages

### Configuración inicial

1. **Crear repositorio en GitHub** (si no existe):
   ```bash
   # El repositorio debe estar en la organización dataxbi
   # Nombre sugerido: website
   ```

2. **Configurar GitHub Pages**:
   - Ve a Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (o `master`), carpeta `/ (root)`
   - Save

3. **Actualizar URLs en `_config.yml`**:
   
   **Para testing (GitHub Pages del repo):**
   ```yaml
   url: "https://dataxbi.github.io"
   baseurl: "/website"
   ```
   
   **Para producción (dominio personalizado):**
   ```yaml
   url: "https://www.dataxbi.com"
   baseurl: ""
   ```

4. **Push al repositorio**:
   ```bash
   git remote add origin https://github.com/dataxbi/website.git
   git push -u origin main
   ```

### Dominio personalizado (cuando esté listo)

1. Crear archivo `CNAME` en la raíz:
   ```
   www.dataxbi.com
   ```

2. Configurar DNS en tu proveedor:
   ```
   CNAME www.dataxbi.com -> dataxbi.github.io
   ```

3. En GitHub Settings → Pages:
   - Custom domain: `www.dataxbi.com`
   - Enforce HTTPS: activado

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

## ✅ Checklist antes de producción

- [ ] Actualizar `_config.yml` con URL y baseurl correctos
- [ ] Reemplazar placeholders de imágenes
- [ ] Actualizar email de contacto si difiere de info@dataxbi.com
- [ ] Probar todos los enlaces internos
- [ ] Verificar responsive en móvil
- [ ] Revisar meta descriptions de todas las páginas
- [ ] Configurar CNAME para dominio personalizado
- [ ] Activar HTTPS en GitHub Pages
- [ ] Probar formularios/enlaces de contacto

## 📚 Recursos

- [Jekyll Docs](https://jekyllrb.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/es/pages)
- [Instrucciones del proyecto](.github/copilot-instructions.md)

## 🔧 Solución de problemas

### El sitio no compila

1. Verificar sintaxis en `_config.yml`
2. Comprobar front matter de los posts
3. Ver logs en Actions (GitHub)

### Los estilos no cargan

1. Verificar rutas con `{{ site.baseurl }}`
2. Limpiar caché: `bundle exec jekyll clean`

### Las imágenes no aparecen

1. Usar rutas: `{{ site.baseurl }}/assets/images/nombre.jpg`
2. Verificar que las imágenes existan en `assets/images/`

---

**Nota**: Este sitio está en fase de desarrollo. La migración del blog desde WordPress se realizará en una segunda fase.
