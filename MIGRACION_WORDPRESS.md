# Migración del blog desde WordPress a Jekyll

## Paso 1: Exportar contenido desde WordPress

1. Accede al panel de WordPress: https://www.dataxbi.com/wp-admin
2. Ve a **Herramientas → Exportar**
3. Selecciona **Entradas** (Posts)
4. Haz clic en **Descargar archivo de exportación**
5. Guarda el archivo XML (ejemplo: `dataxbi.wordpress.2026-01-04.xml`)

---

## Paso 2: Convertir el XML a archivos Markdown

### Opción A: Usar wordpress-export-to-markdown (Node.js) - RECOMENDADO

Si tienes Node.js instalado:

```bash
npx wordpress-export-to-markdown
```

El asistente te preguntará:
1. Ubicación del archivo XML
2. Carpeta de salida (usa: `_posts`)
3. Formato de prefijo (selecciona: `year/month/day`)
4. Si quieres descargar imágenes

### Opción B: Usar jekyll-import (Ruby)

Si tienes Ruby instalado:

```bash
gem install jekyll-import
ruby -r jekyll-import -e 'JekyllImport::Importers::WordpressDotCom.run({
  "source" => "dataxbi.wordpress.2026-01-04.xml"
})'
```

### Opción C: Conversión manual

Para cada post del XML, crear archivo `.md` en `_posts/`:

1. **Nombre del archivo**: `YYYY-MM-DD-titulo-del-post.md`
   
2. **Front matter** al inicio:
```yaml
---
layout: post
title: "Título del post"
date: YYYY-MM-DD HH:MM:SS
author: "dataXbi"
tags: [tag1, tag2]
---
```

3. **Contenido**: copiar el HTML o Markdown del post

---

## Paso 3: Revisar archivos convertidos

Los archivos en `_posts/` deben tener:

### Nombre del archivo
Formato: `YYYY-MM-DD-titulo-del-post.md`

Ejemplo: `2025-02-03-etl-low-cost-fabric-version2-encender-capacidad.md`

### Front matter
```yaml
---
layout: post
title: "ETL Low Cost con Fabric - Versión 2: Encender capacidad"
date: 2025-02-03
author: "dataXbi"
tags: [fabric, etl]
description: "Descripción del post"
---
```

---

## Paso 4: Ajustes comunes después de la conversión

### Imágenes
- WordPress: `![alt](http://www.dataxbi.com/wp-content/uploads/imagen.jpg)`
- Jekyll: `![alt]({{ site.baseurl }}/assets/images/blog/imagen.jpg)`

Copiar imágenes a: `assets/images/blog/`

### Bloques de código
Verificar que estén con sintaxis Markdown:

```python
print("Hola mundo")
```

### Enlaces internos
- WordPress: `https://www.dataxbi.com/blog/otro-post/`
- Jekyll: `{{ site.baseurl }}/blog/2025/01/15/otro-post/`

---

## Paso 5: Verificación

### Probar URLs
El permalink configurado es: `/blog/:year/:month/:day/:title/`

Esto generará URLs como:
`https://dataxbi.github.io/blog/2025/02/03/etl-low-cost-fabric-version2-encender-capacidad/`

### Comprobar que funciona
1. Hacer commit y push de los archivos
2. Esperar que GitHub Pages compile (2-3 minutos)
3. Probar algunas URLs antiguas para verificar que funcionan

---

## Paso 6: Redirecciones (si cambia el dominio)

Si el blog se moverá de `www.dataxbi.com` a `dataxbi.github.io`:

### Opción A: Redirección en WordPress
Instalar plugin "Simple 301 Redirects" y redirigir:
- Desde: `/blog/*`
- Hacia: `https://dataxbi.github.io/blog/*`

### Opción B: .htaccess en el servidor
```apache
RedirectMatch 301 ^/blog/(.*)$ https://dataxbi.github.io/blog/$1
```

---

## Checklist de migración

- [ ] Exportar XML desde WordPress
- [ ] Convertir XML a Markdown
- [ ] Copiar archivos a `_posts/`
- [ ] Copiar imágenes a `assets/images/blog/`
- [ ] Ajustar rutas de imágenes en los posts
- [ ] Revisar enlaces internos
- [ ] Hacer commit y push
- [ ] Verificar que las URLs funcionan
- [ ] Configurar redirecciones en WordPress (si aplica)

---

## Recursos útiles

- [Jekyll Import Docs](https://import.jekyllrb.com/docs/wordpress/)
- [wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown)
- [Markdown Guide](https://www.markdownguide.org/)

---

## ¿Necesitas ayuda?

Si encuentras problemas durante la migración, revisa:
1. Que los nombres de archivo tengan el formato correcto
2. Que el front matter esté bien formado (YAML válido)
3. Los logs de compilación en GitHub Actions
