---
layout: post
title: "Reverse ETL con Power BI"
date: 2022-04-29
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi-api"
  - "python"
  - "video"
---

Comparto el v�deo de la presentaci�n que hice en la Power Platform Madrid en noviembre de 2021 sobre casos de uso de la ejecuci�n de consultas DAX con la API REST de Power BI. Tambi�n comparto los enlaces a los repositorios en GitHub del c�digo que us� en las demostraciones.

<!--more-->

### API REST de Power BI

Con la [API REST de Power BI](https://docs.microsoft.com/es-es/rest/api/power-bi/) podemos interactuar con el servicio de Power BI desde nuestras aplicaciones o herramientas para realizar tareas de administraci�n o de desarrollo. Una de las �ltimas incorporaciones a esta API es la posibilidad de ejecutar consultas DAX a un modelo que est� publicado en el servico de Power BI. En una [entrada anterior](/blog/2021/08/06/probando-api-power-bi-dax/) muestro c�mo ejecutar una consulta DAX desde Python, y esta entrada ser�a una continuaci�n.

### Reverse ETL

Con el t�rmino Reverse ETL me encontr� hace unos meses atr�s leyendo el [blog de James Serra](https://www.jamesserra.com/archive/2021/04/modern-data-warehouse-reverse-etl/) y se refiere al proceso de mover algunos de los datos que tenemos en un almac�n de datos (data warehouse) hacia sistemas externos, de manera que dichos sistemas puedan tomar decisiones operativas a partir de esos datos.

He extrapolado un poco este concepto para aplicarlo a un modelo de Power BI donde tenemos las dimensiones y las medidas que nos permiten hacer an�lisis, pero ha surgido la necesidad de utilizar algunas de dichas medidas en otros sistemas que no son anal�ticos.

### Ejecutar consultas DAX desde un script Python

La primera demostraci�n del v�deo es con un script Python, que es el mismo que us� en la [entrada anterior sobre este mismo tema](/blog/2021/08/06/probando-api-power-bi-dax/).

El c�digo est� disponible en GitHub: [https://github.com/dataxbi/powerbi-api-dax](https://github.com/dataxbi/powerbi-api-dax)

### Ejecutar consultas DAX desde un sitio web

El siguiente caso de uso es utilizar algunas medidas DAX en un sitio web. Una alternativa podr�a ser Power BI Embedded, pero no se quiere inscrustar visualizaciones Power BI en el sitio, sino que se quiere poder acceder a los valores de las medidas desde el backend del sitio web.

El sitio web est� implementado con ASP.NET MVC y tiene dos p�ginas donde se se utilizan consultas DAX. En la portada se se hace una consulta DAX que devuelve 3 valores y que se dibujan en el sitio web desde el backend. En otra p�gina se utiliza la biblioteca JavaScript [AG Grid](https://www.ag-grid.com/javascript-charts/overview/) para dibujar gr�ficods de barras y de l�neas a partir de la ejecuci�n de consultas DAX.

El c�digo est� disponible en GitHub:

Tengo una demostraci�n de un sitio web que hace lo mismo, pero utilizando XMLA en lugar de la API REST y que puedes ver en [esta entrada de blog sobre varios casos de uso de XMLA](https://www.dataxbi.com/blog/2021/03/29/experimentando-xmla-powerbi/).

### Ejecutar consultas DAX desde Power Automate

En el v�deo tambi�n hago demuestro c�mo hacer consultas DAX desde un flujo de Power Automate. La clave est� en crear un conector personalizado a partir de un fichero OpenAPI con la definici�n de la API REST de Power BI. En Power Automate hay disponible un conector oficial de Power BI, pero a�n no permite hacer consultas DAX.

El fichero OpenAPI est� disponible en GitHub: [https://github.com/dataxbi/powerbi-api-swagger](https://github.com/dataxbi/powerbi-api-swagger)

Planteo dos casos de uso para los flujos. El primero es la creaci�n de una alerta que sea m�s flexible que las que podemos hacer con el conector oficial de Power BI. La segunda propuesta es guardar los resultados de una consulta DAX en una lista de SharePoint y luego usar la lista en Power Apps.

### Ejecutar consultas DAX desde Azure Data Factory

En la �ltima demostraci�n utilizo Azure Data Factory para ejecutar una consulta DAX y guardar los resultados en un fichero CSV en Azure Data Lake. Para ello creo una canalizaci�n con una actividad de copia que usa como origen un servicio REST y como destino Azure Data Lake Storage Gen2.

### V�deo

<iframe src="https://www.youtube.com/embed/5JxRFblUINY" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
