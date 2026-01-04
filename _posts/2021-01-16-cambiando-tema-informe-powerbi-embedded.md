---
layout: post
title: "Cambiando el tema de un informe en Power BI Embedded"
date: 2021-01-16
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi-embedded"
---

En esta entrada hablar� sobre c�mo cambiar el tema de un informe en Power BI Embedded y continuar� extendiendo la demo que comenc� en la entrada anterior.

<!--more-->

En Power BI se puede cambiar el dise�o visual de un informe utilizando [temas](https://docs.microsoft.com/es-es/power-bi/create-reports/desktop-report-themes), que son ficheros JSON donde se definen los colores, el formato de los textos y los estilos de las visualizaciones. Power BI Desktop trae varios temas incluidos que se pueden utilizar directamente, o que se pueden modificar y tambi�n hay varios sitios web desde donde se pueden descargar o construir temas, como la [galer�a de temas mantenida por la comunidad Power BI](https://community.powerbi.com/t5/Themes-Gallery/bd-p/ThemesGallery).

La biblioteca JavaScript de Power BI Embedded permite cambiar el tema de un informe que hayamos incrustado en una p�gina web, con lo que podr�amos implementar la funcionalidad que se muestra en el diagrama, donde cada usuario puede ver un mismo informe pero con un tema Power BI diferente, y adem�s tambi�n se podr�an cambiar los estilos del sitio web (CSS) para armonizar con los estilos del informe.

![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-report-theme.jpg)

## ¿C�mo cambiamos el tema?

Cambiar el tema es bastante sencillo y en la siguiente imagen muestro un fragmento de c�digo JavaScript para incrustar un informe con un nuevo tema.

![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-report-theme-config-theme.jpg)

Lo que nos interesa en este caso es la l�nea 7, del resto ya habl� en la [entrada anterior](https://www.dataxbi.com/blog/2021/01/11/enlace-dinamico-conjunto-datos-powerbi-embedded/). La variable `themePowerBi` contiene una cadena de caracteres con el c�digo JSON del tema y la funci�n `JSON.parse()` convierte dicha cadena de caracteres en un objeto JSON, que es lo que necesita la biblioteca JavaScript de PowerBI. El c�digo JSON del tema generalmente se genera en el backend a partir de un fichero o de una base de datos. Al cargar el informe dentro de la p�gina web, el tema original del informe ser� sustituido por el tema del objeto JSON.

Tambi�n es posible cambiar el tema din�micamente a un informe que haya sido incrustado antes, sin tener que volver a cargar el informe. Y para ello s�lo se necesita una l�nea de c�digo JavaScript, como se ve en la siguiente imagen.  
![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-report-theme-applyTheme.jpg)

Y por �ltimo, con otra l�nea de c�digo JavaScript podemos quitar un tema que hayamos aplicado antes, y dejar al informe con su tema original.  
![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-report-theme-resetTheme.jpg)

  

## Demo

En la [entrada anterior](https://www.dataxbi.com/blog/2021/01/11/enlace-dinamico-conjunto-datos-powerbi-embedded/) present� un sitio web que comenc� a implementar para mostrar lo que se puede hacer con Power BI Embedded. Y lo he extendido para permitir cambiar los temas de los informes.

Te recuerdo c�mo acceder.

- Sitio web: [https://dataxbi-powerbi.azurewebsites.net](https://dataxbi-powerbi.azurewebsites.net)/
- Credenciales empresa BICICLETAS

- Usuario: demo-bicicletas
- Contrase�a: dataXbi2021

- Credenciales empresa ORDENADORES

- Usuario: demo-ordenadores
- Contrase�a: dataXbi2021

En la siguiente animaci�n del sitio web, puedes ver que la empresa BICICLETAS tiene dos temas y c�mo se cambia entre ellos sin volver a cargar el informe. Tambi�n se puede ver c�mo cambian los colores de la barra superior y del men� de configuraci�n, que no son parte del informe Power BI, sino que son parte de la p�gina web. Si entras a la demo con las credenciales de la empresa ORDENADORES, podr�s ver que tiene un tema diferente.

![Cambiando el tema de un informe con Power BI Embedded](/assets/images/posts/2021-01-16-cambiando-tema-informe-powerbi-embedded/dataXbi-power-bi-embedded-cambiando-el-tema-del-informe.gif)

Para extender la demo con los temas he creado una nueva tabla en la base de datos SQL que utilizo para la configuraci�n del sitio web. En dicha tabla guardo la configuraci�n de los temas, que consiste en un nombre, un fichero JSON con el tema para Power BI y un fichero CSS para el tema del sitio web.

Tambi�n he creado una relaci�n entre esta tabla de temas y la tabla donde guardo la configuraci�n de las empresas, de forma que una empresa puede tener asociado ninguno, uno, o varios temas.

Luego he hecho cambios en el sitio web para que cuando se vaya a mostrar un informe, comprobar si la empresa tiene temas asociados y aplicar el que corresponda, utilizando la biblioteca JavaScript de Power BI para cargar el JSON del tema de Power BI, y adicionando din�micamente los estilos del fichero CSS al sitio web.

Adem�s he adicionado el men� de configuraci�n a la barra de navegaci�n, donde se listan los temas asociados al informe y se puede cambiar el tema din�micamente.

## Referencias

- [https://github.com/microsoft/PowerBI-JavaScript/wiki/Apply-Report-Themes](https://github.com/microsoft/PowerBI-JavaScript/wiki/Apply-Report-Themes)
- [https://docs.microsoft.com/es-es/power-bi/create-reports/desktop-report-themes](https://docs.microsoft.com/es-es/power-bi/create-reports/desktop-report-themes)
