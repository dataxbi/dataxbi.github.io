---
layout: post
title: "Cambiando el tema de un informe en Power BI Embedded"
date: 2021-01-16
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi-embedded"
---

En esta entrada hablaré sobre cómo cambiar el tema de un informe en Power BI Embedded y continuaré extendiendo la demo que comencé en la entrada anterior.

<!--more-->

En Power BI se puede cambiar el diseño visual de un informe utilizando [temas](https://docs.microsoft.com/es-es/power-bi/create-reports/desktop-report-themes), que son ficheros JSON donde se definen los colores, el formato de los textos y los estilos de las visualizaciones. Power BI Desktop trae varios temas incluidos que se pueden utilizar directamente, o que se pueden modificar y también hay varios sitios web desde donde se pueden descargar o construir temas, como la [galería de temas mantenida por la comunidad Power BI](https://community.powerbi.com/t5/Themes-Gallery/bd-p/ThemesGallery).

La biblioteca JavaScript de Power BI Embedded permite cambiar el tema de un informe que hayamos incrustado en una página web, con lo que podríamos implementar la funcionalidad que se muestra en el diagrama, donde cada usuario puede ver un mismo informe pero con un tema Power BI diferente, y además también se podrían cambiar los estilos del sitio web (CSS) para armonizar con los estilos del informe.

![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-report-theme.jpg)

## Â¿Cómo cambiamos el tema?

Cambiar el tema es bastante sencillo y en la siguiente imagen muestro un fragmento de código JavaScript para incrustar un informe con un nuevo tema.

![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-report-theme-config-theme.jpg)

Lo que nos interesa en este caso es la línea 7, del resto ya hablé en la [entrada anterior](https://www.dataxbi.com/blog/2021/01/11/enlace-dinamico-conjunto-datos-powerbi-embedded/). La variable `themePowerBi` contiene una cadena de caracteres con el código JSON del tema y la función `JSON.parse()` convierte dicha cadena de caracteres en un objeto JSON, que es lo que necesita la biblioteca JavaScript de PowerBI. El código JSON del tema generalmente se genera en el backend a partir de un fichero o de una base de datos. Al cargar el informe dentro de la página web, el tema original del informe será sustituido por el tema del objeto JSON.

También es posible cambiar el tema dinámicamente a un informe que haya sido incrustado antes, sin tener que volver a cargar el informe. Y para ello sólo se necesita una línea de código JavaScript, como se ve en la siguiente imagen.  
![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-report-theme-applyTheme.jpg)

Y por último, con otra línea de código JavaScript podemos quitar un tema que hayamos aplicado antes, y dejar al informe con su tema original.  
![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-report-theme-resetTheme.jpg)

  

## Demo

En la [entrada anterior](https://www.dataxbi.com/blog/2021/01/11/enlace-dinamico-conjunto-datos-powerbi-embedded/) presenté un sitio web que comencé a implementar para mostrar lo que se puede hacer con Power BI Embedded. Y lo he extendido para permitir cambiar los temas de los informes.

Te recuerdo cómo acceder.

- Sitio web: [https://dataxbi-powerbi.azurewebsites.net](https://dataxbi-powerbi.azurewebsites.net)/
- Credenciales empresa BICICLETAS

- Usuario: demo-bicicletas
- Contraseña: dataXbi2021

- Credenciales empresa ORDENADORES

- Usuario: demo-ordenadores
- Contraseña: dataXbi2021

En la siguiente animación del sitio web, puedes ver que la empresa BICICLETAS tiene dos temas y cómo se cambia entre ellos sin volver a cargar el informe. También se puede ver cómo cambian los colores de la barra superior y del menú de configuración, que no son parte del informe Power BI, sino que son parte de la página web. Si entras a la demo con las credenciales de la empresa ORDENADORES, podrás ver que tiene un tema diferente.

![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-cambiando-el-tema-del-informe.gif)

Para extender la demo con los temas he creado una nueva tabla en la base de datos SQL que utilizo para la configuración del sitio web. En dicha tabla guardo la configuración de los temas, que consiste en un nombre, un fichero JSON con el tema para Power BI y un fichero CSS para el tema del sitio web.

También he creado una relación entre esta tabla de temas y la tabla donde guardo la configuración de las empresas, de forma que una empresa puede tener asociado ninguno, uno, o varios temas.

Luego he hecho cambios en el sitio web para que cuando se vaya a mostrar un informe, comprobar si la empresa tiene temas asociados y aplicar el que corresponda, utilizando la biblioteca JavaScript de Power BI para cargar el JSON del tema de Power BI, y adicionando dinámicamente los estilos del fichero CSS al sitio web.

Además he adicionado el menú de configuración a la barra de navegación, donde se listan los temas asociados al informe y se puede cambiar el tema dinámicamente.

## Referencias

- [https://github.com/microsoft/PowerBI-JavaScript/wiki/Apply-Report-Themes](https://github.com/microsoft/PowerBI-JavaScript/wiki/Apply-Report-Themes)
- [https://docs.microsoft.com/es-es/power-bi/create-reports/desktop-report-themes](https://docs.microsoft.com/es-es/power-bi/create-reports/desktop-report-themes)
