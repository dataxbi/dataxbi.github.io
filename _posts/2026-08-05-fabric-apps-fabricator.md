---
layout: post
title: "Fabric Apps - Fabricator"
date: 2026-08-05
author: "Nelson López Centeno"
image: /assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator.png
categories: 
  - "sin-categoria"
tags: 
  - "fabric-apps"
  - "fabric"
---
En la cuarta entrega de esta serie quiero presentarte Fabricator, una aplicación de escritorio gratuita y de código abierto desarrollada por Sachin Patney con la que puedes crear tus *Fabric Apps*.

<!--more-->

Todos los ejemplos que te he mostrado en esta serie los he construido en la línea de comandos (Terminal de Windows), por requerimientos de [Rayfin](https://github.com/microsoft/rayfin) y también por preferencias personales. Pero este post va a ser diferente porque mostraré una aplicación de escritorio desde la que puedes controlar todo el ciclo de vida de una *Fabric App*, desde la instalación de los requerimientos, la conexión al modelo semántico, el desarrollo de la aplicación, el control de versiones con Git y el despliegue en Fabric. 

> Si aún no te has leído [las entradas anteriores de la serie](https://www.dataxbi.com/blog/tag/fabric-apps/?orden=asc), te animo a que lo hagas antes de continuar.

## Instalando Fabricator

Todo el código de Fabricator está disponible en GitHub: [https://github.com/spatney/rayfin-fabricator](https://github.com/spatney/rayfin-fabricator).

Su autor, [Sachin Patney](https://www.linkedin.com/in/spatney/), es empleado de Microsoft donde lidera el desarrollo de *Rayfin*, pero **Fabricator es un proyecto personal** que realiza en su tiempo libre por lo que no está soportado por Microsoft.

Desde el repositorio de GitHub se puede descargar el instalador para Windows o para Mac: [https://github.com/spatney/rayfin-fabricator/releases/latest](https://github.com/spatney/rayfin-fabricator/releases/latest)
- El nombre del instalador para Windows tiene este formato: `Rayfin Fabricator_<version>_x64-setup.exe`
- El nombre del instalador para Mac tiene este formato: `Rayfin Fabricator_<version>_aarch64.dmg`

Una vez instalado, lo ejecutamos, y lo primero que hace es comprobar si en el ordenador están las herramientas necesarias:
- Node.js
- Git
- Azure CLI
- GitHub CLI (opcional) 

Si alguna no está, podemos instalarla desde el propio Fabricator.

GitHub CLI solo es necesario si tenemos una cuenta en GitHub y queremos clonar repositorios donde tengamos *Fabric Apps*.

Además de estas herramientas, se requiere: 
- Tener acceso a un área de trabajo de Fabric en un inquilino donde se hayan habilitado las *Fabric Apps*
- Tener una licencia de [GitHub Copilot](https://github.com/features/copilot/plans?locale=es-419) 

Fabricator te permite entrar tus credenciales para conectarte a GitHub Copilot y a Fabric a través de Azure CLI.

![Pantalla inicial de Fabricator donde se comprueba que estén instaladas las herramientas y el acceso a Fabric y GitHub Copilot](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-instalacion.png)


## Creando la *Fabric App*

Después de instalar las herramientas y conectarnos a GitHub Copilot y a Fabric, estamos listos para comenzar a crear nuestra *Fabric App*. Para ello utilizamos el botón "Enter Fabricator →" que encontrarás en la parte inferior derecha de la pantalla.

Se nos presentan tres opciones:
- New project
- Open folder
- Clone from GitHub (esta opción necesita instalar GitHub CLI)

También te recomiendo prestar atención al recuadro que aparece abajo, con la ruta a la carpeta donde Fabricator creará los proyectos, que puedes cambiar si lo deseas.

Vamos a escoger la opción "New project" que nos llevará a una pantalla como la que te muestro abajo, donde debemos escribir el nombre del proyecto y seleccionar una plantilla.

Yo le he puesto el nombre "Hola Fabricator", por lo que el proyecto se creará en la carpeta `hola-fabricator`.

En cuanto a la plantilla, he utilizado "Universal App", que es la predeterminada y es propia de Fabricator, pero también se puede escoger la plantilla "Todo App" (que comenté en el post anterior) u otras plantillas creadas por la comunidad.

> Te adelanto que la próxima entrega de esta serie estará dedicada a las plantillas.

Le damos al botón "Create project" y esperamos unos minutos a que se descarguen los componentes de la plantilla en la carpeta del proyecto.

![Creando una Fabric App con el nombre Hola Fabricator utilizando la plantilla Universal App de Fabricator](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-crear-app-1.png)

Antes de comenzar a trabajar en la *Fabric App* tenemos que desplegarla en un área de trabajo con capacidad Fabric, y para ello Fabricator nos mostrará una pantalla donde podemos buscar entre las áreas de trabajo, o crear una.

Yo he escogido el área de trabajo con el nombre "Fabric_App".

![Antes de comenzar a personalizar la Fabric App hay que publicarla en un áre de trabajo con capacidad Fabric](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-crear-app-2.png)

Cuando haya terminado el despliegue, aparecerá una pantalla como la que te muestro continuación, dividida en dos paneles: a la izquierda tenemos un chat para darle las instrucciones a GitHub Copilot, y a la derecha podemos interactuar con la *Fabric App* que por ahora es poco más que un lienzo en blanco.

Encima de los paneles al centro, tenemos cuatro botones:
- Build
- Code
- Model
- Advisor

![Pantallazo del entorno de trabajo de Fabricator, con el chat a la izquierda y la Fabric App a la derecha](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-crear-app-3.png)

En la pantalla de la imagen anterior estamos en el modo "Build", pero si cambiamos al modo "Code" podemos ver el código de la aplicación con un editor que incorpora Fabricator, o podemos abrir Visual Studio Code mediante el botón que está arriba a la derecha. 

También podemos revisar el historial de cambios, lo que es posible porque Fabricator se encarga de utilizar Git para hacer *commit* cada vez que se hace una modificación.

Y en el mismo modo "Code" también podemos activar y desactivar *skills* con instrucciones y herramientas para los agentes de IA.

![Gestión de las skills disponibles en Fabricator](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-skills.png)


## Construyendo un cuadro de mando

Vamos a regresar al modo "Build" para construir un cuadro de mando de ventas utilizando el mismo modelo semántico del segundo *post* de esta serie.

Recomiendo habilitar el **modo plan** de GitHub Copilot, que en Fabricator está inactivo de inicio por ser una funcionalidad que áun está en pruebas (*beta*). Hay que buscar el botón "Settings" en la esquina superior derecha de la pantalla y dentro de la ventana de configuración abrir la opción EXPERIMENTS, que está al final, y activar la opción "Chat mode selector". 

Después de activarlo, hay que seleccionarlo en el panel de chat.

![Seleccionando el modo plan en el panel de chat](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-chat-modo-plan.png)

De esta manera podemos trabajar siguiendo el mismo proceso de toda la serie: **plan** - **especificación** - **implementación** - **testing** - **despliegue**, en varias iteraciones.

Las primeras instrucciones que le daremos al agente de IA serán para indicarle el modelo semántico que debe utilizar. Fabricator nos ofrece una manera muy practica mediante un botón situado en la esquina inferior derecha del chat, como se muestra en la imagen. Al pulsarlo, aparece una lista con los modelos semánticos disponibles en el área de trabajo donde hemos desplegado la *Fabric App*. Cuando seleccionamos uno, se añaden al chat las instrucciones con los identificadores del modelo semántico y del área de trabajo.

![Seleccionando un modelo semántico en el panel de chat](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-chat-modelo-semantico.png)

También es posible adjuntar imágenes en el chat, por ejemplo, un boceto del cuadro de mando, o un logotipo, pero en este caso no he utilizado ninguna imagen.

Por cierto, otra de las maravillas de Fabricator es que podemos revisar la estructura del modelo semántico seleccionado, con el botón "Model" de la parte superior de la pantalla. 

![Explorando el modelo semántico seleccionado](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-modelo-semantico.png)

Para continuar, escribimos en el chat algunas instrucciones generales sobre el cuadro de mando, para que el agente de IA nos proponga un plan.

Yo comencé con estas instrucciones:

```
Crea un cuadro de mandos que ofrezca una visión general de las ventas utilizando las medidas que ya existen en el modelo. Que los indicadores se comparen con el año anterior.
```

El agente me hizo algunas preguntas y yo le hice algunas sugerencias adicionales, y este fue el plan acordado:

```
- Primera entrega: crear únicamente docs/especificaciones-dashboard.md con alcance, KPIs, comparación interanual, visuales, filtros, estados y criterios de aceptación.
- Detener todo trabajo después de crear el documento para que puedas revisarlo.
- Mantener bloqueados el pack analytics, la conexión al modelo, el DAX y el dashboard hasta recibir tu aprobación explícita de las especificaciones.
- Tras aprobarlas, continuar con la conexión ventas, descubrimiento del esquema e implementación validada contra datos reales.
```

Revisé el documento con las especificaciones dentro del propio fabricator utilizando el botón "Code", y le di el OK al agente de IA para que implementara el plan.

Después de trabajar durante un rato, el agente de IA tuvo lista y desplegada una primera versión del cuadro de mando, que te muestro en el vídeo.

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-cuadro-mando-version-inicial.mp4" type="video/mp4">
</video>

> Como esta *Fabric App* utiliza un modelo semántico, he tenido que utilizar el botón "Fabric", de la esquina superior derecha, para que se abra dentro del portal de Fabric.

## Modo diseño

El cuadro de mando ha quedado bastante bien, pero quiero dos mejoras:
- Cambiar el gráfico de *donut* por uno de columnas
- Quitar los títulos de los ejes de los gráficos

Para el primer cambio, Fabricator nos ofrece otra herramienta maravillosa: el modo diseño, que se activa con el botón "Design" ubicado en la esquina superior derecha, junto al botón "Fabric".

En dicho modo podemos modificar el aspecto de la *Fabric App* de manera visual, por ejemplo, seleccionar un elemento para cambiar sus dimensiones, el font o el color. O seleccionar un gráfico para cambiarle el tipo. O incluso, dibujar o escribir comentarios. Es un poco como Power Point o Canvas. 

Pero esto no modifica directamente la *Fabric App*, sino que hay que pulsar el botón "Send tu chat" para que se genere una imagen y unas instrucciones que se envían al chat para que el agente de IA haga las modificaciones en el código.

En este caso, seleccioné el gráfico de donut y cambié el tipo a gráfico de barras, como se aprecia en la imagen.

![Utilizando el modo diseño para cambiar el tipo de un gráfico](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-modo-diseno.png)

Para el segundo cambio no utilicé el modo diseño, sino que se lo pedí directamente en el chat.


## Despliegue

Cada vez que el agente de IA realiza cambios en la *Fabric App*, automáticamente se hace un *commit* con Git, y se vuelve a desplegar en el área de trabajo de Fabric que indicamos al crear el proyecto.

Si necesitamos hacer un despliegue puntual, podemos utilizar el botón "Redeploy" ubicado en la esquina superior derecha. 

Y también podemos añadir otras áreas de trabajo para desplegar la misma *Fabric App*, por ejemplo, para tener un entorno de desarrollo y otro de pruebas, como se muestra en la imagen. 

![Se han configurado dos áreas de trabajo para desplegar la misma Fabric App, uno para desarrollo y otro para pruebas.](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-despliegue.png)


## Advisor

Para finalizar este recorrido por Fabricator quiero mencionar otra maravilla: la pantalla "Advisor", que utiliza a GitHub Copilot para revisar el código de la aplicación y detectar problemas de seguridad, de rendimiento o de accesibilidad. 

Yo lo ejecuté con la aplicación y encontró dos problemas, uno de rendimiento y otro de accesibilidad, como se muestra en la imagen.

Si se pulsa en el botón "Fix with Copilot" de un problema, se copia el texto en el chat para que el agente de IA trate de resolverlo.

![La pantalla "Advisor" con dos problemas que ha encontrado, uno de rendimiento y otro de accesibilidad.](/assets/images/posts/2026-08-05-fabric-apps-fabricator/dataXbi-fabric-apps-fabricator-advisor.png)


## Continuará...

Gracias por llegar hasta aquí. 😊

En la próxima entrega de la serie hablaré sobre las plantillas de Rayfin.