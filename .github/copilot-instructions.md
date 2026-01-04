# Instrucciones del repositorio — Sitio web dataXbi (GitHub Pages)

## Objetivo del sitio
Construir el sitio web de **dataXbi** usando **GitHub Pages**, con un diseño claro, ligero y honesto, alineado con la realidad actual del proyecto:

- Microsoft Fabric como eje principal
- Formación de pago: libro y talleres en vivo
- Servicios profesionales en una sola página
- Contenido gratuito y de comunidad centralizado en el blog
- Marca cercana y personal (no corporativa)

El sitio debe ser fácil de mantener, rápido y con SEO básico bien resuelto.

---

## Identidad y posicionamiento

### Marca
- **dataXbi** es una **marca comercial registrada**
- Los servicios son prestados por **dos profesionales autónomos**
- dataXbi **no es una empresa ni una sociedad**

### Reglas de redacción obligatorias
- NO usar términos como: “empresa”, “compañía”, “sociedad”, “equipo corporativo”
- Usar un tono cercano, profesional y directo
- Utilizar expresiones como:
  - “trabajamos contigo”
  - “te ayudamos”
  - “colaboramos”
  - “ponemos a tu disposición”

Estas reglas aplican a todas las páginas del sitio.

---

## Socios de dataXbi
dataXbi es una marca comercial bajo la que trabajan **dos profesionales autónomos**, sin jerarquías:

- **Nelson López Centeno**  
  https://www.linkedin.com/in/nelson-lopez-centeno/

- **Diana Aguilera Reyna**  
  https://www.linkedin.com/in/diana-aguilera-reyna/

Reglas:
- Mostrar ambos perfiles de forma equivalente
- Incluir enlaces a LinkedIn
- Evitar lenguaje societario

---

## Lema oficial
El lema de dataXbi es:

> Te ayudamos a transformar tus datos en soluciones

Reglas:
- Usarlo como mensaje principal en la home
- Puede repetirse en el footer
- No modificar el texto
- No repetirlo innecesariamente

---

## Tecnología
- **Jekyll** (GitHub Pages)
- Tema propio, ligero
- Sin frameworks JS pesados
- Plugins permitidos:
  - `jekyll-seo-tag`
  - `jekyll-sitemap`
  - `jekyll-feed`
  - `jekyll-redirect-from`
- Mobile-first
- Idioma: español

---

## Arquitectura del sitio

### Navegación principal
- Formación
- Servicios
- Blog
- Quiénes somos
- Contacto

Sin submenús complejos.

---

## ESTRUCTURA GRÁFICA / VISUAL DEL SITIO

### Principios visuales
- Diseño limpio, mucho espacio en blanco
- Tipografía legible, sin adornos
- Jerarquía clara: título → subtítulo → CTA
- Secciones bien separadas
- Uso moderado de iconos
- No usar imágenes de stock genéricas con personas

---

### Header (global)
- Logo dataXbi a la izquierda
- Menú principal a la derecha
- Botón destacado opcional: “Solicitar reunión”
- Header fijo en desktop, no intrusivo en móvil

---

### Home `/`

#### 1. Hero
- Lema como H1
- Subtítulo explicando enfoque en Microsoft Fabric
- CTAs:
  - Formación
  - Contacto

#### 2. Bloque “Qué hacemos”
Tres tarjetas iguales:
- Formación (libro + talleres)
- Servicios (proyectos + bolsas de horas)
- Blog (contenido abierto)

Cada tarjeta con icono simple y CTA.

#### 3. Bloque destacado — Libro
- Layout a dos columnas
- Texto + imagen/mockup del libro
- CTA: “Más sobre el libro”

#### 4. Bloque destacado — Taller en vivo
- Fondo diferenciado
- Mensaje de evento activo
- CTA: “Ver próximo taller”

#### 5. Últimos artículos del blog
- Grid de 3 artículos
- Título, extracto corto y fecha
- CTA: “Ver todos”

#### 6. CTA final
- Fondo sólido o degradado suave
- Texto: invitación a contacto
- Botón: “Contactar”

---

### Formación `/formacion/`
- Hero corto
- Dos bloques principales:
  - Libro
  - Talleres
- Cada bloque con descripción breve y CTA
- No incluir contenido gratuito

---

### Servicios `/servicios/`
- Hero corto
- Bloque 1: Proyectos con Microsoft Fabric
- Bloque 2: Consultoría por bolsas de horas
- Bloque 3: Para quién es
- CTA recurrente: “Solicitar reunión”

---

### Blog `/blog/`
- Layout centrado en lectura
- Listado de posts con paginación
- Sin distracciones visuales
- Sidebar solo si aporta valor

#### Migración WordPress
- Mantener URLs originales exactamente
- Usar `permalink` fijo si es necesario

---

### Quiénes somos `/quienes-somos/`
- Texto breve explicando la marca
- Dos perfiles en tarjetas:
  - Foto
  - Nombre
  - Especialización
  - LinkedIn
- Tono humano, no corporativo

---

### Contacto `/contacto/`
- Texto corto
- Botones grandes:
  - Email
  - LinkedIn
  - Solicitar reunión
- Sin formularios complejos

---

### Footer
- Lema
- Navegación principal
- Redes sociales
- Nota legal:

> dataXbi es una marca comercial registrada.  
> Servicios prestados por profesionales autónomos.

---

## Redes sociales (enlaces oficiales)
- LinkedIn: https://www.linkedin.com/company/dataxbi/
- YouTube: https://www.dataxbi.com/youtube
- GitHub: https://github.com/dataxbi/
- Instagram: https://www.instagram.com/dataxbi/
- X/Twitter: https://twitter.com/dataXbiTW

---

## Estructura de carpetas esperada
- `_layouts/`
- `_includes/`
- `_posts/`
- `assets/`
- `blog/`
- `formacion/`
- `libro/`
- `talleres/`
- `servicios/`
- `quienes-somos/`
- `contacto/`

---

## Criterios de calidad
- Compila en GitHub Pages
- URLs del blog preservadas
- Diseño consistente
- SEO básico correcto
- Sin dependencias innecesarias

---

## Cómo debe trabajar Copilot en este repositorio
- Priorizar simplicidad
- No inventar contenido
- Usar placeholders claros
- Cambios pequeños y revisables
- Respetar siempre esta estructura visual

---

## Flujo de trabajo con Git

Después de completar cualquier tarea que modifique archivos del repositorio:
1. Hacer commit con un mensaje descriptivo en español
2. Hacer push automáticamente al repositorio remoto

No esperar a que el usuario lo solicite explícitamente.
