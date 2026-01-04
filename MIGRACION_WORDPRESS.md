# Migración del blog desde WordPress a Jekyll

## Paso 1: Exportar contenido desde WordPress

1. Accede al panel de WordPress: https://www.dataxbi.com/wp-admin
2. Ve a **Herramientas → Exportar**
3. Selecciona **Entradas** (Posts)
4. Haz clic en **Descargar archivo de exportación**
5. Guarda el archivo XML (ejemplo: `dataxbi.wordpress.2026-01-04.xml`)

---

## Paso 2: Convertir el XML a archivos Markdown

### Opción A: Usar herramienta online (más fácil)

1. Ve a: https://wordpress-to-jekyll.netlify.app/
2. Sube el archivo XML exportado
3. Descarga el ZIP con los archivos Markdown
4. Extrae los archivos en la carpeta `_posts/` de este repositorio

### Opción B: Usar jekyll-import (Ruby)

Si tienes Ruby instalado:

```bash
gem install jekyll-import
ruby -r jekyll-import -e 'JekyllImport::Importers::WordpressDotCom.run({
  "source" => "dataxbi.wordpress.2026-01-04.xml"
})'
```

### Opción C: Usar wordpress-export-to-markdown (Node.js)

Si tienes Node.js instalado:

```bash
npx wordpress-export-to-markdown
```

Sigue el asistente interactivo:
1. Selecciona el archivo XML
2. Elige la carpeta de salida (_posts)
3. Configura el formato de fecha

### Opción D: Conversión manual (si son pocos posts)

Para cada post, crear archivo `.md` con:
- Nombre: `YYYY-MM-DD-titulo-del-post.md`
- Copiar el contenido del post de WordPress
- Agregar el front matter YAML

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
- [WordPress to Jekyll converter](https://wordpress-to-jekyll.netlify.app/)
- [Markdown Guide](https://www.markdownguide.org/)

---

## ¿Necesitas ayuda?

Si encuentras problemas durante la migración, revisa:
1. Que los nombres de archivo tengan el formato correcto
2. Que el front matter esté bien formado (YAML válido)
3. Los logs de compilación en GitHub Actions
