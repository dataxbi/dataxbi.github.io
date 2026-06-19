---
layout: post
title: "Fabric Apps - Hola DAX"
date: 2026-06-18
author: "Nelson López Centeno"
image: /assets/images/posts/2026-06-18-fabric-apps-hola-dax/dataXbi-fabric-apps-fabric-hola-dax-multi-model.png
categories: 
  - "sin-categoria"
tags: 
  - "fabric-apps"
  - "fabric"
---
Esta es la segunda entrega de la serie sobre Fabric Apps en la que mostraré cómo construir cuadros de mando a partir de modelos semánticos. Tomaré como base la plantilla *Data App* que trae Rayfin para hacer tres ejemplos: un cuadro de mando de ventas, un informe de PyG y un cuadro de mando para la dirección que combine consultas de los dos modelos semánticos anteriores. 

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

A primera vista la estructura de carpetas es similar a la creada por la plantilla que utilizamos en el primer post (*Blank App*,). Pero, hay un tesoro frente a nosotros, y para descubrirlo basta con abrir el archivo [AGENTS.md](https://github.com/dataxbi/fabapp-hello-dax/blob/main/AGENTS.md). 

En *Blank App* este archivo solo contenía las instrucciones de Rayfin, pero ahora tiene una gran cantidad de instrucciones, dirigidas a implementar una aplicación de datos en el *front-end* que es capaz de ejecutar consultas DAX en modelos semánticos de Power BI / Fabric. 

Aquí tenemos un verdadero *framework* dividido en varias capas y totalmente preparado para los agentes de IA generativa.

AGENTS.md es solo el inicio, porque luego cada capa tiene su propia SKILL.md. Las puedes encontrar en la carpeta [.agents/skills](https://github.com/dataxbi/fabapp-hello-dax/tree/main/.agents/skills). Muchas de estas SKILLS hacen referencia a módulos que se han instalado en la carpeta **node_modules**.

Creo que vale la pena revisar los archivos AGENT y SKILLS para comprender el funcionamiento del *framework*. 

Como punto de partida utiliza la documentación oficial: [https://learn.microsoft.com/es-es/fabric/apps/data-apps-template](https://learn.microsoft.com/es-es/fabric/apps/data-apps-template?wt.mc_id=MVP_367391)


Aquí te dejo un resumen de cada capa:

- **Experiencia de aplicación**: 
  Responsable de estructurar la aplicación en páginas y de la navegación.

- **Presentación visual**:
  Responsable de dibujar gráficos, tablas, panels y otros controles de UI, además de capturar las interacciones del usuario. Utiliza [Vega-Lite](https://vega.github.io/vega-lite/) para los gráficos y el componente [@microsoft/fabric-datagrid](https://www.npmjs.com/package/@microsoft/fabric-datagrid) para las tablas.

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
  Responsable de comprobar el comportamiento de la aplicación. Hace tests y validación real utilizando [Playwright CLI](https://playwright.dev/agent-cli/introduction).

- **Plataforma · Rayfin / Fabric embed**:
  Responsable de desplegar la aplicación en Fabric, de la autenticación y la configuración del entorno.

Con estas capas no solo podemos implementar la aplicación, sino que además nos permiten descubrir las estructura del modelo semántico y probar las consultas DAX antes de utilizarlas, hacer *testing* una vez implementada la aplicación, y desplegarla en Fabric.

Me he extendido mucho en este recorrido, y todavía no hemos construido nada, así que vamos allá.

### Hola DAX

Como hemos visto, este *framework* está muy bien preparado para los agentes de IA. Así que vamos a continuar implementando el cuadro de mando de ventas con la ayuda de de nuestra herramienta de IA preferida. En mi caso he utilizado indistintamente [GitHub Copilot CLI](https://github.com/features/copilot/cli) y [Codex CLI](https://developers.openai.com/codex/cli).

Antes de continuar, te recomiendo que le pidas al agente que **compruebe si se puede conectar a Fabric** y con cuál usuario lo está haciendo, para evitar que esté utilizando un usuario incorrecto. O si ya te has conectado antes a Fabric o a Azure desde la terminal, lo puedes tú mismo con el comando `az login`

Cuando trabajo con agentes de IA en un proyecto lo primero que hago es configurar GIT, para mantener la historia de todos los cambios. Y he hecho un primer commit justo después de instalar la plantilla. 

Lo siguiente que hago es elaborar un plan inicial, con la ayuda de la herramienta de IA, que guardo en un archivo de especificaciones y en archivos con las diferentes tareas. Una vez que las especificaciones están revisadas y corregidas por mí, hago un commit, y le pido al agente que lo implemente. 

Para elaborar el plan para una *Data App* (esta plantilla) hay que tener en cuenta el** flujo de trabajo que seguirán los agentes**, como se describe en el archivo AGENTS, y que tiene tres fases:

1. **Fase de diseño y creación de consultas**: Exploración de los datos y validar las consultas. En esta fase todavía no se escribe código de la aplicación.
2. **Fase de diseño de la aplicación**: Diseño de la experiencia de usuario (UX) de la aplicación web antes de escribir cualquier código de ejecución.
3. **Fase de desarrollo de la aplicación**: Implementación de los componentes  que obtienen los datos en tiempo de ejecución utilizando el SDK de Fabric.

Como parte del plan hay que indicar el URL del modelo semántico en Fabric, que tiene un formato como este:
https://app.fabric.microsoft.com/onelake/details/id-area-trabajo/dataset/id-modelo-semantico

Esta información le servirá a los agentes para para configurar la aplicación.

El modelo de ventas con el que trabajé tiene la estructura mostrada en la siguiente imagen, y las medidas ``[Facturacion], [Margen] y [% Margen]``.

![Estructura del modelo de ventas](/assets/images/posts/2026-06-18-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-modelo-semantico-ventas.png)

Como punto de partida del plan utilicé un *prompt* bastante abierto: 

> Construir una Fabric App ejecutiva sobre el modelo semántico Ventas (https://app.fabric.microsoft.com/onelake/details/id-area-trabajo/dataset/id-modelo-semantico) para ofrecer una visión resumida del negocio y páginas de detalle que permitan profundizar en los principales ejes comerciales. 

El agente se encargó de conectarse al modelo para descubrir las tablas y medidas y me propuso un informe con cuatro páginas: 
- Overview
- Regiones
- Portafolio comercial
- Clientes

Continué iterando hasta tener un plan completo que puedes ver en GitHub: [https://github.com/dataxbi/fabapp-hello-dax/blob/main/docs/especificacion-cuadro-mando-ventas.md](https://github.com/dataxbi/fabapp-hello-dax/blob/main/docs/especificacion-cuadro-mando-ventas.md)


Durante la ejecución del plan por parte del agente se puede observar como utiliza las diferentes *skills* y herramientas para crear las consultas DAX que utilizará en cada visual y para probarlas antes de incluirlas en la aplicación.

Y una vez que termina de implementar la aplicación ejecuta comandos como ``npm run test``, ``npm run build`` y ``npm run lint`` que son propios del flujo de desarrollo de aplicaciones front-end.

Al final ejecuta la Fabric App localmente y hace validaciones utilizando Playwright CLI. Aquí me falló algunas veces porque el back-end de la aplicación no se publicaba en Fabric la primera vez.

Para desplegar la aplicación completa en Fabric, se lo puedes pedir al agente o, si te quires ahorrar unos tokens, utilizar directamente el comando ``npx rayfin up``.

La primera versión salió bastante bien, pero no cargabas datos en las tablas, así que le pedí a mi agente que revisara y corrigiera.

También tuve que pedirle que mejorara un poco la parte visual, sobre todo la coherencia, porque puso colores diferentes en los gráficos. Hay que tener en cuenta que en la especificación las únicas indicaciones de diseño que incluí fueron el logo y el URL de nuestro sitio web.

Ten en cuenta que estos resultados dependen del modelo de LLM que utilices. Aquí he utilizado GPT 5.4.

<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/images/posts/2026-06-18-fabric-apps-hola-dax/dataXbi-fabric-apps-hola-dax-ventas.mp4" type="video/mp4">
</video>










