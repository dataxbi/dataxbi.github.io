---
layout: post
title: "Fabric Apps - Plantillas"
date: 2026-08-21
author: "Nelson López Centeno"
image: /assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-brand-dashboard.png
categories: 
  - "sin-categoria"
tags: 
  - "fabric-apps"
  - "fabric"
---
La quinta entrega de esta serie se la dedico a las plantillas de Rayfin. Te explico dónde encontrar otras plantillas y cómo crear las tuyas propias. Además, te comparto una que he creado para ayudarte a estandarizar la creación de Fabric Apps en tu empresa.

<!--more-->

Cuando creamos una *Fabric App*, el backend se gestiona a través de *Rayfin*, pero en el frontend tenemos libertad total. Las plantillas nos ofrecen un punto de partida a través de la instalación de componentes, para tener disponible un *framework* con el que podemos acelerar el desarrollo. 

> Si aún no te has leído [las entradas anteriores de la serie](https://www.dataxbi.com/blog/tag/fabric-apps/?orden=asc), te animo a que lo hagas antes de continuar.

## Las plantillas incluidas con Rayfin

En entradas anteriores hemos visto que la herramienta de línea de comandos (CLI) de *Rayfin* incorpora varias plantillas:

1. **Blank App**: Una aplicación web muy sencilla de una sola página. 
   - Sin base de datos. 
   - Biblioteca [React](https://es.react.dev/) para los componentes del frontend.
   - Herramienta [Vite](https://vite.dev/) para gestionar el desarrollo de la aplicación web.
   - La única *skill* incluida es la de Rayfin.

2. **Data App**: Aplicación web analítica preparada para conectarse a modelos semánticos de Fabric.
   - Sin base de datos. 
   - También utiliza React y Vite.
   - Además de la *skill* de *Rayfin*, incluye varias *skills* para la planificación, desarrollo y validación de la aplicación analítica, como explico en un [post](https://www.dataxbi.com/blog/2026/06/20/fabric-apps-hola-dax/) de esta serie.

3. **Todo App**: Aplicación web de ejemplo que gestiona una lista de tareas.
   - Utiliza una base de datos SQL.
   - También utiliza React y Vite.
   - La única *skill* es la de *Rayfin*, que incluye instrucciones para gestionar la base de datos desde del *frontend* con GraphQL, como comento en [otro post](https://www.dataxbi.com/blog/2026/07/21/fabric-apps-hola-graphql/) de esta serie.
   - Hay dos plantillas de este tipo y la principal diferencia entre ellas es que una incorpora la biblioteca [Radiux UI](https://www.radix-ui.com/).

Si utilizamos [Fabricator](https://www.dataxbi.com/blog/2026/08/05/fabric-apps-fabricator/) para desarrollar nuestra *Fabric App*, tenemos disponible una plantilla propia llamada **Universal App**.


> Todas estas plantillas incorporan autenticación con Fabric, que hasta el momento es un requisito para utilizar las *Fabric Apps*.


## Awesome Rayfin 


Además de las plantillas incluidas con Rayfin, Microsoft mantiene un repositorio en GitHub con más plantillas, algunas desarrolladas por la comunidad. 

Este es el repositorio: [https://github.com/microsoft/awesome-rayfin](https://github.com/microsoft/awesome-rayfin).

Para crear una *Fabric App* con *Rayfin CLI* a partir de alguna de las plantillas, utiliza este comando:

```
npm create @microsoft/rayfin@latest "Mi app" -- --template https://github.com/microsoft/awesome-rayfin
```

> Los guiones dobles (--) hay que repetirlos, no es un error.

Al ejecutar el comando anterior, se presentará el listado de las plantillas disponibles, como se aprecia en la siguiente imagen. Ten en cuenta que solo se muestran 7 plantillas, pero hay más, que puedes ver desplazándote con la flecha hacia abajo.

![Utilizando las plantillas de la comunidad con Rayfin CLI](/assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-rayfin-cli.png)


Si utilizas Fabricator, puedes acceder a estas plantillas cuando creas un proyecto con la opción Template/Community.

![Utilizando las plantillas de la comunidad con Fabricator](/assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-fabricator.png)

Si entras al [repositorio](https://github.com/microsoft/awesome-rayfin) puedes ver los detalles y el código de las plantillas que contiene. En este momento hay 9 plantillas, y a continuación te comento las que me parecen más interesantes.

### Angular Blank App

[https://github.com/microsoft/awesome-rayfin/tree/main/templates/angular-blankapp](https://github.com/microsoft/awesome-rayfin/tree/main/templates/angular-blankapp)

Es una plantilla mínima, sin base de datos, que utiliza en el *frontend* [Angular](https://angular.dev/) en lugar de React, y la biblioteca de componentes de UI [Angular Material](https://material.angular.dev/).

No incluye *skills* adicionales, solo la de *Rayfin*. 

### Angular Dashboard App

[https://github.com/microsoft/awesome-rayfin/tree/main/templates/angular-dashboard](https://github.com/microsoft/awesome-rayfin/tree/main/templates/angular-dashboard)

Esta plantilla crea un cuadro de mandos para manejar proyectos. Piensa en una aplicación *Todo* pero más avanzada. O en [GitHub Projects](https://docs.github.com/es/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects). De hecho puede conectarse a un repositorio público de GitHub y mostrar los *issues* y las *pull requests*.

Utiliza una base de datos SQL y se basa en la plantilla Angular Blank App.

![Pantallazo de una Fabric App creada con la plantilla Angular Dashboard App](/assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-angular-dashboard-app.png)


### Slide Deck

[https://github.com/microsoft/awesome-rayfin/tree/main/templates/slide-deck](https://github.com/microsoft/awesome-rayfin/tree/main/templates/slide-deck)

Con esta plantilla puedes implementar una *Fabric App* para crear diapositivas con Markdown o HTML y presentarlas a tu audiencia, con registro de participantes y chat en vivo.

Utiliza una base de datos SQL.

![Pantallazo de una Fabric App creada con la plantilla Slide Deck](/assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-slide-deck.png)

### Power BI Fixer

[https://github.com/microsoft/awesome-rayfin/tree/main/templates/pbi-fixer](https://github.com/microsoft/awesome-rayfin/tree/main/templates/pbi-fixer)

Esta plantilla es maravillosa porque crea una *Fabric App* llena de funcionalidades:
- Edición de modelos semánticos
- Optimización de modelos semánticos asistida por IA
- Edición de reportes
- Tareas de administración de Fabric
- Creación de Fabric Apps
- Y mucho más...

El autor es también el creador del proyecto [PBI Fixer](https://kornalexander.github.io/pbi_fixer/index.html), un *notebook* para Fabric que permite optimizar modelos semánticos e informes de una manera interactiva y que utiliza [Semantic Link Labs](https://github.com/microsoft/semantic-link-labs).

En esta plantilla ha incorporado todo lo que está en el *notebook* y ha añadido nuevas opciones. Vale mucho la pena revisar el código, porque incluso ha utilizado User Defined Functions (UDF) de Fabric que aún no están soportadas oficialmente en *Rayfin*.

![Fragmento del sitio web de PBI Fixer con las dos ediciones: Notebook y Fabric App](/assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-pbi-fixer.png)

## Crear tu propia plantilla

Es muy fácil crear una plantilla para *Rayfin* porque no es más que una *Fabric App* pero con alguna configuración extra.

En el repositorio *Awesome Rayfin* hay un documento con las directrices para crear una plantilla: [https://github.com/microsoft/awesome-rayfin/blob/main/docs/template-guidelines.md](https://github.com/microsoft/awesome-rayfin/blob/main/docs/template-guidelines.md).

También hay un fichero [AGENTS.md](https://github.com/microsoft/awesome-rayfin/blob/main/AGENTS.md) con instrucciones para los agentes de IA.

Y los requisitos para publicar una plantilla en el repositorio: [https://github.com/microsoft/awesome-rayfin/blob/main/CONTRIBUTING.md](https://github.com/microsoft/awesome-rayfin/blob/main/CONTRIBUTING.md).

Si revisas este último documento verás que hay una serie de pasos para publicar nuestra plantilla en *Awesome Rayfin* y por supuesto hay que hacer un Pull Request (PR) y esperar la aprobación.

Para utilizar una plantilla, no es obligatorio que esté en *Awesome Rayfin*, sino que podemos hacerlo desde un repositorio propio o incluso desde una carpeta.

A continuación te comento dos ficheros que si son imprescindibles en las plantillas.

### Fichero rayfin-template.yml

Toda plantilla tiene que tener un fichero `rayfin-template.yml` con esta estructura:

```
apiVersion: v1
metadata:
  name: angular-blankapp
  displayName: Angular Blank App
  description: Bare-bones Fabric-authenticated Angular + Material app — sign-in, routing, and a placeholder home page, with no data layer to remove
entries:
  - path: .
    name: Angular Blank App
```

> El código anterior es de la plantilla Angular Blank App [https://github.com/microsoft/awesome-rayfin/blob/main/templates/angular-blankapp/rayfin-template.yml](https://github.com/microsoft/awesome-rayfin/blob/main/templates/angular-blankapp/rayfin-template.yml)

`name` tiene que coincidir con el nombre de la carpeta donde está la plantilla y el formato tiene que ser [kebab case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case).

`entries` contiene la ruta al código de la plantilla y el nombre de la plantilla.

Si en una carpeta hay varias planillas, se crea un elemento de `entries` para cada una, por ejemplo:

```
apiVersion: v1
metadata:
  name: awesome-rayfin
  displayName: Awesome Rayfin Templates
  description: Community-curated template gallery for Project Rayfin
entries:
  - path: templates/angular-blankapp
    name: Angular Blank App
    description: Bare-bones Fabric-authenticated Angular + Material app — sign-in, routing, and a placeholder home page, with no data layer to remove
  - path: templates/angular-dashboard
    name: Angular Dashboard App
    description: Responsive Angular Material dashboard — top navbar + collapsible side menu, Project/Task data model, and optional one-click GitHub Issues/PRs sync for a public repo.
  - path: templates/field-technician
    name: Field Technician App
    description: Field service management app with role-based dashboards for dispatchers and technicians, job tracking, customer lookup, and dual-mode auth (local password + Fabric)
```

> El código anterior es un fragmento del fichero `rayfin-template.yml` del repositorio Awesome Rayfin [https://github.com/microsoft/awesome-rayfin/blob/main/rayfin-template.yml](https://github.com/microsoft/awesome-rayfin/blob/main/rayfin-template.yml)

La carpeta de cada plantilla tendrá que contener a su vez un fichero `rayfin-template.yml` como el del primero ejemplo.

### Fichero manifest.json

El fichero `manifest.json` está presente en las Fabric Apps aunque no sean plantillas, pero en el caso de estas la propiedad `templatedId` tiene que coincidir con el nombre de la carpeta. 

```
{
  "templateId": "angular-blankapp",
  "icon": "angular-blankapp",
  "services": {
    "auth": true,
    "data": true,
    "storage": false,
    "staticHosting": true
  },
  "hasDabSchema": false,
  "tokens": [
    "__RAYFIN_API_URL__",
    "__RAYFIN_PK__",
    "__FABRIC_ITEM_ID__",
    "__FABRIC_WORKSPACE_ID__",
    "__FABRIC_PORTAL_URL__"
  ]
}
```

> El código anterior es de la plantilla Angular Blank App [https://github.com/microsoft/awesome-rayfin/blob/main/templates/angular-blankapp/manifest.json](https://github.com/microsoft/awesome-rayfin/blob/main/templates/angular-blankapp/manifest.json)


### Hola plantillas

Para demostrar como puedes crear tu propia plantilla, voy a preparar una muy básica que he llamado `hola-plantillas`, y que consiste en una única página estática.

Para hacer una plantilla te recomiendo que primero implementes una *Fabric App* y compruebes que funcione y luego la conviertes en plantilla añadiendo el fichero `rayfin-template.yml` y el resto de los metadatos. Y que te asegures de eliminar cualquier referencia a áreas de trabajo u otros elementos que puedan aparecer en la *Fabric App* al hacer pruebas o despliegue.

Estos son los pasos que he seguido para crear la plantilla `hola-plantillas`:

1. He creado una *Fabric App* con el nombre "Hola plantillas" utilizando la plantilla "Blank App". Lo que crea la carpeta `hola-plantillas`.
2. He utilizado un agente de IA para que modifique la aplicación y la simplifica aún más dejando solo una página web y la autenticación, y que deshabilite la base de datos.
3. He probado la aplicación localmente y también la he desplegado a Fabric.
4. He clonado el repositorio Awesome Rayfin en mi ordenador con el comando: `git clone https://github.com/microsoft/awesome-rayfin.gi`
5. He recurrido de nuevo el agente de IA para que me ayude a convertir la Fabric App en una plantilla, indicándole que utilice la SKILL de la copia local de Awesome Rayfin.
   - He comprobado que exista el fichero `rayfin-template.yml` y que esté correcto.
   - He comprobado que el fichero `manifest.json` tenga el valor correcto (hola-plantilla) en `templateId`
6. He limpiado las referencias a datos privados que pudieran quedar de la Fabric App:
   - En el fichero `rayfin/rayfin.yml` quitar los elementos de `allowedRedirectUris` que no incluyan `localhost`.
   - Eliminar el fichero fichero `rayfin/.deployments.json`
   - Eliminar el fichero fichero `rayfin/.env`
   - Eliminar el fichero fichero `.env.local`

El resultado lo he publicado en GitHub: [https://github.com/dataxbi/fabric-app-templates/tree/main/hola-plantillas](https://github.com/dataxbi/fabric-app-templates/tree/main/hola-plantillas)

Para crear una *Fabric App* con *Rayfin CLI* a partir de esta plantilla, utiliza este comando:

```
npm create @microsoft/rayfin@latest "Hola Plantillas" -- --template https://github.com/dataxbi/fabric-app-templates --template-name hola-plantillas
```

Si utilizas Fabricator, al crear el proyecto ve a la opción Template/Community y has *scroll* hasta el final de la lista y busca el *link* "Use a custom URL" que está abajo a la derecha, y llena el URL del repositorio y el nombre de la plantilla como muestra la imagen.

![Utilizando la plantilla hola-plantillas con Fabricator](/assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-hola-plantillas-fabricator.png)


En realidad el repositorio donde está `hola-plantillas` contiene otra plantilla que veremos a continuación, y también tiene un fichero [`rayfin-template.yml`](https://github.com/dataxbi/fabric-app-templates/blob/main/rayfin-template.yml) general para que se pueda usar directamente el URL del repositorio y aparezca el listado de las plantillas disponibles.

```
npm create @microsoft/rayfin@latest "Otra Plantillas" -- --template https://github.com/dataxbi/fabric-app-templates
```

## Una plantilla corporativa

La **gobernanza** ha sido una de las principales preocupaciones desde que fueron anunciadas las *Fabric Apps*, y con razón, porque sin ningún control podemos tener una explosión de aplicaciones web y bases de datos en las áreas de trabajo de Fabric.

Creo que las plantillas pueden servirnos para dar un pequeño paso en la buena dirección, porque las veo como el lugar donde podemos recoger las reglas que deben cumplir las Fabric Apps que se desplieguen en la empresa. Es verdad que por ahora Fabric no provee *out of the box* un mecanismo para forzar el uso de determinadas plantillas, ni de validar antes de desplegar, pero recuerda que las Fabric Aps aún están en versión preliminar, y además creo que con las herramientas que existen para CI/CD y las APÎs se podría implementar algún mecanismo a la medida.

A modo de ejemplo, he creado una plantilla para crear cuadros de mandos a partir de modelos semánticos publicados en Fabric, que ya incorpora un diseño corporativo. Lo puedes ver como el equivalente a un tema de Power BI, pero que además de indicar los colores, también tiene la disposición de los elementos generales (logo de la empresa, el encabezado, el menú), y también una biblioteca de componentes específicos para las visualizaciones

El nombre de la plantilla es `brand-dashboard` y la he publicado en el mismo repositorio de GitHub que he mencionado antes. Puedes acceder directamente con este URL: [https://github.com/dataxbi/fabric-app-templates/tree/main/brand-dashboard](https://github.com/dataxbi/fabric-app-templates/tree/main/brand-dashboard)

Para crearla me he basado en la plantilla *Data App* de *Rayfin* con las siguientes adaptaciones:
- **Shell corporativo**: Sustituye el layout simple por una barra lateral expandible/contraíble y cabecera compartida.
- **Componentes visuales**: Reemplaza VegaVisual por Recharts + componentes shadcn/ui para consistencia visual.

La idea con esta planilla no es que la uses directamente para crear una Fabric App, sino que la descargues, clonando el repositorio, y la personalices con el logo y los colores corporativos.

Luego creas las *Fabric Apps* a partir de la plantilla con tus modificaciones. O que compartas la plantilla modificada en algún repositorio para que la puedan utilizar otros colegas.

Esto se explica en la [guía para administradores](https://github.com/dataxbi/fabric-app-templates/blob/main/brand-dashboard/docs/ADMINISTRADORES.md) que está en el repositorio.

También hay [otra guía](https://github.com/dataxbi/fabric-app-templates/blob/main/brand-dashboard/docs/EMPLEADOS.md) para los colegas que utilicen la plantilla modificada.

Así luce la plantilla:

![Pantallazo de la plantilla brand-dashboard](/assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-brand-dashboard.png)

Así luce una aplicación implementada con esta planilla:

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-08-21-fabric-apps-plantillas/dataXbi-fabric-apps-plantillas-brand-dashboard-app.mp4" type="video/mp4">
</video>

## Continuará...

Gracias por llegar hasta aquí. 😊

La serie continuará, en la próxima entrega hablaré del consumo de CUs de la capacidad Fabric..

