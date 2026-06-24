---
layout: post
title: "Fabric Apps - Hola DAX"
date: 2026-06-20
author: "Nelson López Centeno"
image: /assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-multi-modelo.png
categories: 
  - "sin-categoria"
tags: 
  - "fabric-apps"
  - "fabric"
---
Esta es la segunda entrega de la serie sobre Fabric Apps en la que mostraré cómo construir cuadros de mando a partir de modelos semánticos. Tomaré como base la plantilla *Data App* que trae Rayfin para hacer tres ejemplos: un cuadro de mando de ventas, un informe de PyG y un cuadro de mando para la dirección general que combine consultas de los dos modelos semánticos anteriores. 

Si en el post anterior me di el capricho de regresar por unos momentos a mi niñez para jugar 😉, en este me enfoco más en mostrar el *business value* que pueden tener las Fabric Apps. 

<!--more-->

### La plantilla *Data App* de Rayfin

Para comenzar, voy a implementar un cuadro de mando de ventas, a partir de un modelo semántico que ya esta publicado en un área de trabajo de Fabric. 

Más adelante hablaré del modelo, porque ahora utilizaré Rayfin para sentar los cimientos de esta Fabric App. 

Si quieres seguir cada paso, te recomiendo revisar los requisitos y la forma de trabajar con Rayfin en el [post anterior](https://www.dataxbi.com/blog/2026/06/11/fabric-apps-hola-mundo/).

Pues si ya tienes todos los requisitos, manos a la obra con la nueva Fabric App.
1. Abre la **Terminal** y ejecuta el comando `npm create @microsoft/rayfin@latest "Hola DAX"`
   1. En el menú que aparece, escoge la primera opción: 📦 **Use a template (built-in)**
   2. Selecciona la segunda *template*:  2) **Data App - Build data analytics app based on your data in Fabric**
   3. Espera a que se instalen todos los componentes en la carpeta **hola-dax**. 
2. Cámbiate a la nueva carpeta **hola-dax**.
3. Ya dentro de la carpeta, abre VS Code con el comando: `code .`

Vamos a detenernos en este punto para echarle un vistazo a lo que ha instalado esta plantilla. ¡Yo flipé con lo que me encontré! 

Por cierto, en esta plantilla **si viene deshabilitada la base de datos**, por lo que no hay que recurrir al truco que vimos en el primer post para evitar desplegar en Fabric una base de datos SQL que no vamos a utilizar.

A primera vista la estructura de carpetas es similar a la creada por la plantilla que utilizamos en el primer post (*Blank App*,). 

Pero, hay un tesoro frente a nosotros, y para descubrirlo basta con abrir el archivo [AGENTS.md](https://github.com/dataxbi/fabapp-hello-dax/blob/main/AGENTS.md). 

En *Blank App* este archivo solo contenía las instrucciones de Rayfin, pero ahora tiene una gran cantidad de instrucciones, dirigidas a implementar una aplicación de datos en el *front-end* que es capaz de ejecutar consultas DAX en modelos semánticos de Power BI / Fabric. 

Aquí tenemos un verdadero *framework* dividido en varias capas y totalmente preparado para los agentes de IA generativa.

AGENTS.md es solo el inicio, porque luego cada capa tiene su propia SKILL.md. Las puedes encontrar en la carpeta [.agents/skills](https://github.com/dataxbi/fabapp-hello-dax/tree/main/.agents/skills). Muchas de estas SKILLS hacen referencia a módulos que se han instalado en la carpeta **node_modules**.

Creo que vale la pena revisar los archivos AGENT y SKILLS para comprender el funcionamiento del *framework*. 


![Estructura de carpetas de la plantilla Data App de Rayfin](/assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-vscode-data-app.png)

Como punto de partida utiliza la documentación oficial: [https://learn.microsoft.com/es-es/fabric/apps/data-apps-template](https://learn.microsoft.com/es-es/fabric/apps/data-apps-template?wt.mc_id=MVP_367391)


Aquí te dejo un resumen de cada capa:

- **Experiencia de aplicación**: 
  Responsable de estructurar la aplicación en páginas y de la navegación.

- **Presentación visual**:
  Responsable de dibujar gráficos, tablas, paneles y otros controles de UI, además de capturar las interacciones del usuario. Utiliza [Vega-Lite](https://vega.github.io/vega-lite/) para los gráficos y el componente [@microsoft/fabric-datagrid](https://www.npmjs.com/package/@microsoft/fabric-datagrid) para las tablas.

- **Orquestación de página**:
  Responsable de conectar la UI con la lógica de filtrado, selección y parámetros que alimentan las consultas DAX.

- **Arquitectura de consultas**:
  Responsable de definir qué se consulta, cómo se describe cada visual y qué metadatos acompañan al resultado.

- **Acceso a datos runtime**:
  Responsable de ejecutar consultas DAX en el modelo semántico y de su caché. Utiliza el componente [@microsoft/fabric-app-data](https://www.npmjs.com/package/@microsoft/fabric-app-data)

- **Modelo semántico**:
  Responsable de aportar medidas, dimensiones, relaciones y metadatos del modelo publicado en Fabric/Power BI.

- **Transformación de datos**:
  Responsable de convertir la respuesta cruda de las consultas DAX en un formato visual consumible y enriquecido.

- **Diseño y temas**:
  Responsable de los colores, la tipografía, el *branding* y la consistencia visual entre componentes.

- **Validación y calidad**:
  Responsable de comprobar el comportamiento de la aplicación. Realiza tests y validación real utilizando [Playwright CLI](https://playwright.dev/agent-cli/introduction).

- **Plataforma · Rayfin / Fabric embed**:
  Responsable de desplegar la aplicación en Fabric, de la autenticación y la configuración del entorno.

Con estas capas no solo podemos implementar la aplicación, sino que además nos permiten descubrir las estructura del modelo semántico y probar las consultas DAX antes de utilizarlas, hacer *testing* una vez implementada la aplicación, y desplegarla en Fabric.

### Hola DAX

Como hemos visto, este *framework* está muy bien preparado para los agentes de IA. Así que vamos a continuar implementando el cuadro de mando de ventas con la ayuda de nuestra herramienta de IA preferida. En mi caso he utilizado indistintamente [GitHub Copilot CLI](https://github.com/features/copilot/cli) y [Codex CLI](https://developers.openai.com/codex/cli).

Antes de continuar, te recomiendo que le pidas al agente que **compruebe si se puede conectar a Fabric** y con cuál usuario lo está haciendo, para evitar que esté utilizando un usuario incorrecto. 

O también lo puedes hacer directamente en la terminal con el comando `npx rayfin login status` y así te ahorras un par de tokens. 

Cuando trabajo con agentes de IA en un proyecto lo primero que hago es configurar GIT, para mantener la historia de todos los cambios. Y he hecho un primer commit justo después de instalar la plantilla. 

Lo siguiente que hago es elaborar un plan inicial, con la ayuda de la herramienta de IA, que guardo en un archivo de especificaciones y en archivos con las diferentes tareas. Una vez que las especificaciones están revisadas y corregidas por mí, hago un commit, y le pido al agente que lo implemente. 

Para elaborar el plan para una *Data App* (esta plantilla) hay que tener en cuenta el **flujo de trabajo que seguirán los agentes**, como se describe en el archivo AGENTS, y que tiene tres fases:

1. **Fase de diseño y creación de consultas**: Exploración de los datos y validar las consultas. En esta fase todavía no se escribe código de la aplicación.
2. **Fase de diseño de la aplicación**: Diseño de la experiencia de usuario (UX) de la aplicación web antes de escribir cualquier código de ejecución.
3. **Fase de desarrollo de la aplicación**: Implementación de los componentes  que obtienen los datos en tiempo de ejecución utilizando el SDK de Fabric.

Como parte del plan hay que indicar la URL del modelo semántico en Fabric, que tiene un formato como este:
https://app.fabric.microsoft.com/onelake/details/id-area-trabajo/dataset/id-modelo-semantico

Esta información le servirá a los agentes para para configurar la aplicación.

El modelo de ventas con el que trabajé tiene la estructura mostrada en la siguiente imagen, y las medidas ``[Facturacion], [Margen] y [% Margen]``.

![Estructura del modelo de ventas](/assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-modelo-semantico-ventas.png)

Como punto de partida del plan utilicé un *prompt* bastante abierto: 

> Construir una Fabric App ejecutiva sobre el modelo semántico Ventas (https://app.fabric.microsoft.com/onelake/details/id-area-trabajo/dataset/id-modelo-semantico) para ofrecer una visión resumida del negocio y páginas de detalle que permitan profundizar en los principales ejes comerciales. 

Las únicas indicaciones de diseño que incluí fueron que utilizara el logo y el tono visual de nuestro sitio web, y que los formatos de fechas y números fueran los de España.

El agente se encargó de conectarse al modelo para descubrir las tablas y medidas y me propuso un informe con cuatro páginas: 
- Overview
- Regiones
- Portafolio comercial
- Clientes

Continué iterando hasta tener un plan completo que puedes ver en GitHub: [https://github.com/dataxbi/fabapp-hello-dax/blob/main/docs/especificacion-cuadro-mando-ventas.md](https://github.com/dataxbi/fabapp-hello-dax/blob/main/docs/especificacion-cuadro-mando-ventas.md)


Durante la ejecución del plan por parte del agente se puede observar como utiliza las diferentes *skills* y herramientas para crear las consultas DAX que utilizará en cada visual y para probarlas antes de incluirlas en la aplicación.

Y una vez que termina de implementar la aplicación ejecuta comandos como ``npm run test``, ``npm run build`` y ``npm run lint`` que son propios del flujo de desarrollo de aplicaciones front-end.

Al final, el agente ejecuta la Fabric App localmente y hace validaciones utilizando Playwright CLI. Aquí me falló algunas veces porque el back-end de la aplicación no se publicaba en Fabric la primera vez.

Para desplegar la aplicación completa en Fabric, se lo puedes pedir al agente o, si te quires ahorrar unos tokens, utilizar directamente el comando ``npx rayfin up``.

Ten en cuenta que, por ahora, **las Fabric Apps que se conectan a un modelo semántico solo se pueden abrir dentro del portal Fabric**, no lo pueden hacer de manera independiente como vimos en el primer post. Esto se debe a que la autenticación está implementada de una manera que depende de funcionalidad presente en el portal de Fabric. Pero esto debe cambiar en el futuro.

La primera versión de la aplicación salió bastante bien, pero no cargaba datos en las tablas, así que le pedí a mi agente que revisara y corrigiera.

También tuve que pedirle mejoras en la parte visual, sobre todo en la coherencia, porque utilizó colores diferentes en los gráficos. 

Pienso que estos resultados iniciales podrían haber sido mejores si hubiera incluido más detalles de diseño en la especificación y hubiera utilizado otro modelo de LLM. Aquí he utilizado GPT 5.4.

Así luce la Fabric App:

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-ventas.mp4" type="video/mp4">
</video>

Todo el código esta en GitHub: [https://github.com/dataxbi/fabapp-hello-dax](https://github.com/dataxbi/fabapp-hello-dax)

#### Cross-filter

Aún no hemos terminado con este primer ejemplo, porque esta versión inicial **no tiene *cross-filter*** entre los visuales, a pasar de que el *framework* de *Data App* viene preparado para implementarlo. Aquí también influyen dos factores: 1) la especificación, donde no mencioné que se implementara *cross-filter*, y 2) el modelo de LLM que estoy utilizando.

Bueno, para implementarlo seguí el mismo proceso de planificar primero y que el agente implemente después, enriqueciendo mi propuesta con las sugerencia del modelo LLM. 

El resultado puedes verlo a continuación. Además de aplicar el filtrado entre visuales, hay un panel en la página que muestra los filtros aplicados y botones para limpiarlos.

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-cross-filter.mp4" type="video/mp4">
</video>

#### Panel de filtros dinámicos

Llegados a este punto, me vine un poco arriba, y quise ir un poco más allá, para poner a prueba los límites de lo que se puede hacer.

Con la ayuda de los agentes de IA he implementado un panel de filtros dinámicos, que trabaja de la siguiente manera:
- Al cargar la página utiliza las funciones INFO de DAX para encontrar las dimensiones del modelo semántico, descartando las tablas y columnas ocultas.
- Agrupa cada dimensión por su tipo de dato: texto, numérico o fecha.
- Crea en la página web un panel de filtros con un control específico para cada tipo de dato.
  - Para los números utiliza un rango con mínimo y máximo.
  - Para las fechas utiliza un rango con calendarios.
  - Para los textos utiliza una lista desplegable, pero los datos solo se cargan en el momento en que se abre el filtro.
  
Para implementar estos controles le pedí en la especificación que utilizara la librería de código abierto [shadcn/ui](https://ui.shadcn.com/docs). 

Con esto he extendido la funcionalidad que trae el *framework* de la plantilla Data App, pero solo para esta aplicación.

Para reutilizar este panel de filtros dinámico en otros proyectos, debería haber creado una SKILL. Algo que no descarto hacer en el futuro.

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-filtros-dinamicos.mp4" type="video/mp4">
</video>


### Informe PyG

Para el segundo ejemplo he utilizado otro modelo semántico, esta vez de finanzas, que tiene la estructura que muestro en la imagen y con medidas como ``[Gastos], [Ingresos], [Presupuesto], [Variacion]``

![Estructura del modelo de finanzas](/assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-modelo-semantico-finanzas.png)

Creé un nuevo proyecto con la plantilla Data App y seguí el mismo proceso que he explicado antes.

Esta vez fuí más explicito al crear la especificación:

>Construir una Fabric App ejecutiva sobre el modelo semántico de P&L para ofrecer una visión del resultado económico del negocio con una tabla detallada y tarjetas resumen, usando componentes propios en React.

Puedes leer el texto completo aquí: [https://github.com/dataxbi/fabapp-dax-finance/blob/main/docs/especificacion-informe-pl.md](https://github.com/dataxbi/fabapp-dax-finance/blob/main/docs/especificacion-informe-pl.md), que es el resultado de varias iteraciones.

El fragmento de la especificación termina diciendo "... usando componentes propios..." y si abres la especificación completa verás que en el stack de visuales se indica que para la tabla utilice un componente propio basado en [@tanstack/react-table](https://tanstack.com/table/latest) que es una librería de código abierto.

Además, he modificado la [SKILL de la capa visual](https://github.com/dataxbi/fabapp-dax-finance/blob/main/.agents/skills/visuals/SKILL.md) para que al dibujar tablas se utilice este componente en lugar del original de la plantilla Data App.

Y también he cambiado las [instrucciones para construir las tablas](https://github.com/dataxbi/fabapp-dax-finance/blob/main/.agents/skills/visuals/references/data-grid-visual.md). 

Todo el código está en GitHub: [https://github.com/dataxbi/fabapp-dax-finance](https://github.com/dataxbi/fabapp-dax-finance)

Y el resultado lo puedes ver en este clip:

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-finanzas.mp4" type="video/mp4">
</video>


### Cuadro de mando multi modelo

El tercer ejemplo lo que tiene de novedoso es que combina datos y métricas de los dos modelos de ventas y de finanzas, para hacer un cuadro de mando ejecutivo para la dirección general.

De nuevo creé un proyecto con la plantilla Data App, y seguí el mismo proceso: **plan - especificación - implementación - testing - despliegue**, a través de varias iteraciones.

La especificación final comienza de esta manera:

>Construir un dashboard ejecutivo para Dirección General sobre dos modelos semánticos de Microsoft Fabric, ventas y finanzas.
>
>El dashboard debe presentar una vista clara del negocio con KPIs, comparativa inter anual y al menos un gráfico temporal que combine medidas de ambos modelos mediante su dimension común de fecha.

Puedes ver el texto completo aquí: [https://github.com/dataxbi/fabapp-dax-multi-model/blob/main/docs/especificacion-general.md](https://github.com/dataxbi/fabapp-dax-multi-model/blob/main/docs/especificacion-general.md)

Los modelos semánticos siguen estando separados en Fabric, **la mezcla de los datos ocurre en el *front-end***, luego de hacer consultas DAX independientes para cada modelo.

Todo el código está en GitHub: [https://github.com/dataxbi/fabapp-dax-multi-model](https://github.com/dataxbi/fabapp-dax-multi-model)

Y el resultado lo puedes ver en este clip:

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-06-20-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-multi-modelo.mp4" type="video/mp4">
</video>


### Continuará...

Este post me ha salido un poco largo, así que te agradezco si has llegado hasta aquí. 👏

Mi objetivo ha sido mostrar las posibilidades de la plantilla Data App y cómo se puede personalizar y extender. 

He creado algunos ejemplos que me han parecido interesantes con la esperanza de dejarte con ganas de probar y de innovar.

Recuerda que todo lo que hemos visto hoy ocurre en el **front-end** de la aplicación web.

La próxima entrega de la serie estará dedicada como hacer Fabric Apps para gestionar una base de datos SQL en Fabric.









