# Sistema de Tags Automatizado

## Cómo funciona

El sitio ahora tiene un sistema automatizado para gestionar tags en los posts del blog.

### Solución 1: Tags dinámicos en blog/index.html ✅ IMPLEMENTADO

La página del blog (`blog/index.html`) ahora **genera automáticamente** la lista de tags extrayendo todos los tags únicos de los posts. 

**No necesitas hacer nada manualmente** - simplemente añade tags a tus posts y aparecerán automáticamente en la página del blog.

### Solución 2: Script para generar páginas individuales de tags

Para crear páginas individuales por tag (como `blog/tag/fabric.html`), usa el script de PowerShell.

## Flujo de trabajo recomendado

### Cuando creas un post nuevo:

1. **Añade los tags en el front matter del post**:
   ```yaml
   ---
   layout: post
   title: "Mi nuevo artículo"
   date: 2026-01-04
   author: "Nelson López"
   tags: [fabric, powerbi, tutorial]
   ---
   ```

2. **Los tags aparecerán automáticamente en:**
   - La página del blog (`/blog/`) - lista de "Temas populares"
   - La página individual del post

3. **Si quieres crear páginas individuales de tags**, ejecuta:
   ```powershell
   .\generar-paginas-tags.ps1
   ```

   Este script:
   - ✅ Analiza todos los posts
   - ✅ Extrae todos los tags únicos
   - ✅ Cuenta cuántos posts tiene cada tag
   - ✅ Crea/actualiza las páginas en `blog/tag/`
   - ✅ Muestra estadísticas en consola

4. **Haz commit y push**:
   ```powershell
   git add blog/tag/
   git commit -m "Actualizar páginas de tags"
   git push
   ```

## Comandos útiles

### Ver qué tags existen actualmente
```powershell
# Listar todos los tags con conteo
.\generar-paginas-tags.ps1
```

### Regenerar todas las páginas de tags
```powershell
# El script detecta cambios automáticamente
.\generar-paginas-tags.ps1
```

### Añadir un nuevo tag a un post existente
1. Edita el archivo `.md` del post
2. Añade el tag al array: `tags: [tag1, tag2, nuevo-tag]`
3. Ejecuta `.\generar-paginas-tags.ps1`
4. Haz commit y push

## Beneficios

### ✅ Ventajas de la solución actual:

1. **Sin mantenimiento manual**: Los tags se detectan automáticamente
2. **Sin duplicados**: El script asegura un tag = una página
3. **Ordenados alfabéticamente**: Lista clara y organizada
4. **Estadísticas incluidas**: Sabes cuántos posts tiene cada tag
5. **Compatible con GitHub Pages**: No requiere plugins especiales
6. **Sin BOM**: El script guarda archivos en UTF-8 sin BOM

### 📋 Estructura de archivos:

```
blog/
├── index.html          # Lista de posts con tags dinámicos
└── tag/
    ├── fabric.html
    ├── powerbi.html
    ├── dax.html
    └── ...             # Una página por tag
```

## Convenciones de nombres

- **Tags en minúsculas**: `fabric`, `powerbi`, `dax`
- **Guiones para espacios**: `etl-low-cost-fabric`
- **Sin caracteres especiales**: Solo letras, números y guiones

## Ejemplo completo

```yaml
---
layout: post
title: "Introducción a Microsoft Fabric"
date: 2026-01-04
author: "Nelson López"
tags: [fabric, azure, datawarehouse, tutorial]
excerpt: "Aprende los conceptos básicos de Microsoft Fabric"
---

Tu contenido aquí...
```

Resultado:
- ✅ 4 tags añadidos automáticamente
- ✅ Aparecen en `/blog/` (Temas populares)
- ✅ Aparecen en el post individual
- ✅ Al ejecutar el script, se crean/actualizan 4 páginas de tags

## Troubleshooting

### El script no encuentra tags

Asegúrate de que el formato sea correcto:
```yaml
tags: [tag1, tag2, tag3]
```

No uses:
```yaml
tags:
  - tag1
  - tag2
```

### Los tags no aparecen en el blog

Verifica que:
1. El post esté en `_posts/`
2. El nombre del archivo siga el formato `YYYY-MM-DD-titulo.md`
3. El front matter tenga `layout: post`
4. Hayas hecho `git push`

### Página de tag no se actualiza

1. Ejecuta `.\generar-paginas-tags.ps1`
2. Haz commit: `git add blog/tag/ && git commit -m "Actualizar tags" && git push`
3. Espera a que GitHub Pages reconstruya el sitio (1-2 minutos)

## Mantenimiento

**Recomendación**: Ejecuta el script cada vez que:
- Añades un post nuevo con tags nuevos
- Modificas tags en posts existentes
- Quieres actualizar el conteo de posts por tag

El script es **idempotente** - puedes ejecutarlo las veces que quieras sin problemas.
