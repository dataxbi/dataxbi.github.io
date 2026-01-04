---
layout: post
title: "Probando la nueva API REST de Power BI para ejecutar consultas DAX"
date: 2021-08-06
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "dax"
  - "powerbi"
  - "python"
---

Esta semana han anunciado la versión preliminar de una nueva API REST de Power BI para hacer consultas DAX y he escrito un script en Python para probarla.

<!--more-->

Los detalles del anuncio se pueden consultar en el [blog de Power BI](https://powerbi.microsoft.com/es-es/blog/announcing-the-public-preview-of-power-bi-rest-api-support-for-dax-queries/)

Hasta ahora para ejecutar consultas DAX sobre un conjunto de datos publicado en el servicio de Power BI había que usar [XMLA](https://www.dataxbi.com/blog/2021/03/29/experimentando-xmla-powerbi/). En mi opinión, hacerlo con esta nueva API tiene dos grandes ventajas:

- Trabaja con licencia Pro, a diferencia de XMLA que requiere una licencia Premium
- Es mucho más sencilla de usar que XMLA, que por lo general requiere usar la biblioteca [ADOMD.NET](https://docs.microsoft.com/es-es/analysis-services/adomd/multidimensional-models-adomd-net-client/retrieving-data-from-an-analytical-data-source?view=asallproducts-allversions)

Como he dicho antes, he implementado un script Python, muy sencillo y basado en el ejemplo del post del anuncio, que he compatido en [GitHub](https://github.com/dataxbi/powerbi-api-dax). Yo lo he probado en Windows, pero debe funcionar en otras plataformas, así que si lo pruebas en Mac o Linux, por favor, házmelo saber.

La llamada a la API se hace en la función que muestro a continuación, donde se utiliza la biblioteca [Requests](https://docs.python-requests.org/en/master/).

![Llamando a la API REST de Power BI para ejecutar una consulta DAX](/assets/images/posts/2021-08-06-probando-api-power-bi-dax/powerbi-api-dax-python-01.png)

El `access_token` se obtiene con la API de Azure Active Directory a través de la biblioteca [MSAL](https://github.com/AzureAD/microsoft-authentication-library-for-python). El ID del conjunto de datos, `dataset_id`, se guarda en una variable del entorno. Y la consulta DAX, `dax_query`, se lee de un fichero.

A continuación se muestra el código principal del script, que lo otro que hace es mostrar en la consola la consulta DAX y el resultado formateado como una tabla, usando la biblioteca [Rich](https://github.com/willmcgugan/rich).

![Llamando a la API REST de Power BI para ejecutar una consulta DAX](/assets/images/posts/2021-08-06-probando-api-power-bi-dax/powerbi-api-dax-python-02.png)

Y para finalizar se muestra el resultado de una ejecución.

![Llamando a la API REST de Power BI para ejecutar una consulta DAX](/assets/images/posts/2021-08-06-probando-api-power-bi-dax/powerbi-api-dax-python-03.png)
