---
layout: post
title: "Fabric Apps - Hola mundo"
date: 2026-06-11
author: "Nelson López Centeno"
image: /assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-fabric-invaders-inicio.png
categories: 
  - "sin-categoria"
tags: 
  - "fabric-apps"
  - "fabric"
---
En Microsoft Build 2026 fueron presentadas las Fabric Apps, y ya están disponibles en versión preliminar. Con este post inicio una serie donde iré explicando qué son, cómo funcionan y qué podemos hacer con ellas.

<!--more-->

### ¿Qué es una Fabric App?

En esencia, una [Fabric App](https://learn.microsoft.com/es-es/fabric/apps/overview?wt.mc_id=MVP_367391) es una aplicación web que se hospeda en un área de trabajo de Fabric. 

Como toda aplicación web, está formada por un *front-end* que se ejecuta en un navegador en tu ordenador, y un *back-end* que en este caso se ejecuta en Fabric.

En el *front-end* tenemos casi total libertad para implementar lo que se nos ocurra.

Mientras que en el *back-end* estamos limitados a utilizar los servicios que se nos permitan, que por ahora son dos: autenticación y base de datos Fabric SQL.

Para gestionar los servicios del *back-end* y la publicación de la aplicación en Fabric debemos utilizar [Rayfin](https://www.microsoft.com/en-us/microsoft-fabric/features/rayfin), un proyecto de [código abierto](https://github.com/microsoft/rayfin) desarrollado por Microsoft.

Con estos elementos tenemos todo lo necesario para construir, con la ayuda de agentes de IA generativa, un cuadro de mando que se conecte a un modelo semántico de Power BI, o incluso a varios. 

También podemos implementar una aplicación para gestionar una base de datos Fabric SQL. 

O una aplicación que combine las dos anteriores. 

Las posibilidades son infinitas. Pero vayamos paso a paso. 

En este post me centraré en lo más básico y mostraré **tres ejemplos que utilizan únicamente el front-end**. 

En realidad, lo único que tienen de Fabric Apps es que están publicados en Fabric.


### Hola mundo

Voy a comenzar mostrando paso a paso como crear una Fabric App minimalista, formada con una sola página y **sin ninguna base de datos**.

1. Requisitos antes de comenzar:
   1. Que un administrador de Fabric haya activado la opción: **Habilitar elementos de aplicación de Fabric (versión preliminar)**
   2. Tener acceso a un área de trabajo con capacidad Fabric.
   3. Instalar **Node.js** en tu ordenador, que se puede descargar desde https://nodejs.org/
   4. También te recomiendo instalar **[Visual Studio Code](https://code.visualstudio.com/)**, si es que aún no lo tienes.

2. Rayfin trabaja en la línea de comandos, por lo que debes abrir la aplicación **Terminal de Windows**. Una manera de hacerlo es con la combinación de teclas **Windows** + **R** y luego escribe **wt** y pulsa **Enter**.

3. Para crear la Fabric App, dentro de la terminal ejecuta este comando: **npm create @microsoft/rayfin@latest "Hola Mundo"**, que creará la carpeta **hola-mundo** con la estructura de un proyecto Rayfin e instalará varias librerías.
   1. En el menú que aparece, escoge la primera opción: 📦 **Use a template (built-in)**
   2. Selecciona la primera *template*: 1) **Blank App - Bare-bones Fabric-authenticated React + Vite app — sign-in, routing, and a placeholder home page, with
no data layer to remove**
   1. Espera a que se instalen todos los componentes en la carpeta **hola-mundo**.

4. Cámbiate a dicha carpeta: **hola-mundo**

5. Ya dentro de la carpeta, ejecuta el comando: **npm run dev** 
   1. Este comando te permite probar la Fabric App en tu ordenador antes de la publicación definitiva en Fabric. Aunque actualmente necesita publicar una parte de la aplicación en Fabric para que funcione la autenticación.
   2. Escribe el **nombre del área de trabajo** donde quieres publicar la Fabric App.
   3. Espera hasta que termine de prepararse todo. 
   4. Al finalizar la preparación, en la terminal debe aparecer un texto similar a este: **Local: http://localhost:5173**, que significa que hay un pequeño servidor web en tu ordenador listo para probar la Fabric App.
   5. Para abrir el link (http://localhost:5173) puedes pasar el cursor sobre él y utilizar la combinación **Ctrl** + **clic**.
   6. Primero te pedirá autenticarte con sus credenciales de Fabric, si no estás autenticado ya. 
   7. A continuación te aparecerá una página con el texto "Hello, World".
   
6. Una vez superada la prueba local estamos listos para desplegar la Fabric App para que se pueda utilizar por otros usuarios.
   1. Regresa a la terminal y, situado en la carpeta hola-mundo, ejecuta el comando: **npx rayfin up**
   2. Esto despliega en Fabric la versión definitiva de la Fabric App.
   3. Si vas al área de trabajo verás que hay un elemento con el nombre **hola-mundo**.
   4. Hay dos maneras de acceder a la Fabric App:
      - Utilizando un URL como este: https://app.fabric.microsoft.com/groups/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/appbackends/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                
        Para navegar a este URL basta con hacer clic en el elemento dentro del área de trabajo.
        
        La Fabric App se ve dentro del portal de Fabric.


      - Utilizando un URL como este: https://xxxxxxxxxxxxxxxxxxxxx-westeurope.webapp.fabricapps.net/ 
   
        Este URL se puede ver en los mensajes que imprimió en la pantalla el comando que ejecutamos para publicar: npx rayfin up

        La Fabric App se ve como una aplicación web independiente, sin los elementos de Fabric.

        En **ambos casos** es necesario **autenticarse** con un usuario de Fabric.


¡Felicidades! Has creado tu primera Fabric App. 

![Pantallazo con una Fabric App generada con la plantilla "Blank App" y que solo dice "Hello, World."](/assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-hello-world.png)

Pero, **aún no hemos terminado este primer ejemplo**. Porque te había prometido que no utilizaríamos una base de datos, y de hecho no la estamos usando, pero si se está creando una en Fabric.

Si entras al área de trabajo de Fabric verás que bajo el nuevo elemento hola-mundo hay una base de datos SQL y su punto de conexión de SQL analítico. 😯 Y eso que escogimos una *template with no data layer*. Pero parece que ya crean la base de datos aunque esté vacía por si más tarde cambiamos de idea. 

![En el área de trabajo se observa que al crear la Fabric App también se crea una base de datos Fabric SQL](/assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-hello-world-workspace.png)

Pero esto tiene una solución muy fácil, que consiste en modificar un archivo de configuración de Rayfin. 

Para demostrarlo, vamos a **crear otra Fabric App** con el nombre "**Hola Mundo 2**". 

Repite los pasos **2 y 3** anteriores, pero usando en el paso 3 el comando **npm create @microsoft/rayfin@latest "Hola Mundo 2"** (lo único que cambia es el 2 al final). 

Todavía no pruebes la nueva Fabric App, ni mucho menos la despliegues.

Antes has lo siguiente:

- Cámbiate a la carpeta: **hola-mundo-2**
- Ejecuta el comando **code .** para entrar a VS Code con la carpta abierta.
   - Ya en VS Code abre la **subcarpeta rayfin** 
      - Dentro de la subcarpeta, abre el archivo **rayfin.yml** 
      - En el archivo busca la **línea 14** y cambia true por false.
      - Guarda los cambios (Ctrl + s)

Ahora sí, prueba la Fabric App y luego despliégala siguiendo los pasos 5 y 6. Utiliza la misma área de trabajo.

Una vez desplegada, revisa el área de trabajo y debes ver el nuevo elemento **hola-mundo-2**, pero en solitario, **sin la base de datos SQL** 😊.

![La nueva Fabric App no tiene ninguna base de datos asociada](/assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-hello-world-2-workspace.png)

Yo he hecho una versión del "Hola Mundo" en la que además de deshabilitar la base de datos, he modificado algunos detallitos del sitio web generado por la plantilla para poner el texto en español y añadir una imagen y un ícono. 

Todo el código lo he compartido en un repositorio de GitHub: https://github.com/dataxbi/fabapp-hello-world

![Pantallazo de mi Fabric App Hola Mundo](/assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-hola-mundo.png)


### Rayfin y los agentes de IA

Rayfin viene preparado para los agentes de IA generativa, lo que puedes comprobar revisando el código de las Fabric Apps en tu ordenador, o en el repositorio que te compartí con mi "Hola Mundo".
- Archivo [AGENTS.md](https://github.com/dataxbi/fabapp-hello-world/blob/main/AGENTS.md)
- Archivo [SKILL.md](https://github.com/dataxbi/fabapp-hello-world/blob/main/.agents/skills/rayfin/SKILL.md)
    
    Esta skill puede acceder a la documentación de dos maneras:
    - Con un **MCP Server**, si se ha configurado: https://github.com/microsoft/rayfin/tree/main/packages/tools/mcp
    - Utilizando **Rayfin CLI** en la línea de comandos, que se instala cuando generamos el sitio web utilizando la *template*.


Para mostrar cómo trabaja, he utilizado [GitHub Copilot CLI](https://github.com/features/copilot/cli) en la carpeta de mi "Hola Mundo" y le he pedido lo siguiente:

> confirma si la última versión de la fabric app está publicada en fabric en qué área de trabajo y con cual urls puedo acceder  

El resultado lo puedes ver en la imagen, donde se aprecia como: 
- Ha utilizado la *skill* de Rayfin.
- Ha comparado la fecha del último despliegue en Fabric con el último commit en GIT.
- Muestra el nombre y el ID del área de trabajo y si la aplicación está disponible.
- Muestra la URL para acceder a través del portal de Fabric y la URL pública.

![Pantallazo de GitHub Copilot CLI utilizando la skill de Rayfin](/assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-rayfin-skill-github-copilot-cli-1.png)

![Pantallazo de GitHub Copilot CLI con la respuesta a la pregunta que le hice sobre sobre la Fabric App](/assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-rayfin-skill-github-copilot-cli-2.png)


### Fabric Invaders

En el ejemplo "Hola mundo" los cambios fueron muy sencillos y los hice yo mismo, sin la ayuda de la IA.😉 

El segundo ejemplo que te quiero compartir lo he hecho con agentes de IA utilizando GitHub Copilot CLI, aunque no se han utilizado las instrucciones 
ni la *skill* de Rayfin porque los cambios solo afectan al *front-end*.

He implementado un juego del tipo Space Invaders pero utilizando los magníficos [íconos de Microsoft Fabric para Excalidraw](https://libraries.excalidraw.com/?theme=light&sort=default#mwc360-microsoft-fabric-architecture-icons) creados y mantenidos por [Miles Cole](https://www.linkedin.com/in/mileswcole/).

A esta nueva Fabric App le he llamado **Fabric Invaders** y para crearla he seguido los mismos pasos que en mi "Hola Mundo" y luego:
- He descargado el archivo con los íconos de Fabric desde el sitio de Excalidraw hacia la carpeta src/assets de la Fabric App.
- He utilizado el modo plan de GitHub Copilot CLI para crear una especificación para el juego, indicándole el stack técnico, donde encontrar los íconos de Fabric y pidiéndole explícitamente que no toque los archivos de Rayfin porque las modificaciones deben ser solo en el *front-end*.
- Una vez que he considerado que la especificación está lista, le he pedido a GitHub Copilot CLI que cree un plan a partir de ella y que proceda a implementar.

El primer resultado me dejó impresionado porque el juego funcionó perfectamente. 

![Clip con una partida de Fabric Invaders](/assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-fabric-invaders.gif)

Hice algunas iteraciones más para añadirle sonido, incluir un logo y optimizar la carga de los archivos del *front-end*.

Si quieres revisar el código o probarlo por ti mismo, está en GitHub: https://github.com/dataxbi/fabapp-fabric-invaders
- Este es el archivo AGENTS.md modificado para hacer referencias a la especificación del juego: https://github.com/dataxbi/fabapp-fabric-invaders/blob/main/AGENTS.md
- Esta es la especificación: https://github.com/dataxbi/fabapp-fabric-invaders/blob/main/docs/SPEC.md
- Y en el historial de *commits* puedes ver las iteraciones: https://github.com/dataxbi/fabapp-fabric-invaders/commits/main/

### Pokémon Hunter

Mi intención con el ejemplo anterior ha sido mostrar que tenemos libertad para ser creativos en el *front-end*.

En este último ejemplo quiero poner a prueba esa libertad, llamando a una API REST que no tenga nada que ver con Fabric.

La última Fabric App de este post se llama **Pokémon Hunter** y es una versión del juego anterior, pero sustituyendo los íconos de Fabric por imágenes de pokémon y la nave espacial por la [cazadora Pokémon J](https://www.wikidex.net/wiki/Cazadora_Pok%C3%A9mon_J).

La imagen de la cazadora es estática y la he descargado a la carpeta src/assets de la Fabric App.

Pero las imágenes de los pokémons no están guardadas en la aplicación, sino que se obtienen dinámicamente a través de la [PokéAPI](https://pokeapi.co/).

Cada vez que comienza una partida se llama a la PokéAPI para obtener los URLs con las imágenes de 20 pokémons de manera aleatoria.

![Clip con una partida de Pokémon Hunter](/assets/images/posts/2026-06-11-fabric-apps-hola-mundo/dataXbi-fabric-apps-pokemon-hunter.gif)

Este es el repositorio con el código: https://github.com/dataxbi/fabapp-pokemon-hunter
- AGENTS.md: https://github.com/dataxbi/fabapp-pokemon-hunter/blob/main/AGENTS.md
- Especificaciones: https://github.com/dataxbi/fabapp-pokemon-hunter/blob/main/docs/SPEC.md
- En la [historia de commits](https://github.com/dataxbi/fabapp-pokemon-hunter/commits/main/) se puede apreciar que para este último ejemplo partí de clonar el repo de **Fabric Invaders**.

Esta API es sencilla y no requiere autenticación, por lo que no hay ninguna dificultad al llamarla desde el front-end. 

Pero, para utilizar una API que requiera autenticación hay que ser cuidadoso de no exponer credenciales. 


### Continuará...

En los tres ejemplos que te he mostrado, Fabric no pinta casi nada. De hecho, estas aplicaciones web se podrían haber implementado sin Rayfin y desplegarlas en cualquier sitio web.

Lo único que hemos ganado con Rayfin es poderlas desplegar en un área de trabajo de Fabric y controlar el acceso. 

En próximas entregas de esta serie sí utilizaremos elementos de Fabric.





















    









