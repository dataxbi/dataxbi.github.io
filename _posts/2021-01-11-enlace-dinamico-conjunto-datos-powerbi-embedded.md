---
layout: post
title: "Enlace dinámico de un conjunto de datos en Power BI Embedded"
date: 2021-01-11
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi-embedded"
  - "python"
---

Una de las funcionalidades de Power BI Embedded que más me ha llamado de la atención es la posibilidad de enlazar dinámicamente (dynamic binding) un conjunto de datos a un informe. Para probarla he implementado una demo que describo en esta entrada de blog.

<!--more-->

## Â¿En qué consiste el enlace dinámico (dynamic binding) de un conjunto de datos?

Partimos de tener un conjunto de datos Power BI publicado en el servicio de Power BI y creamos un nuevo PBIX con un informe que se conecta a este conjunto de datos, y ese informe lo incrustamos en una página web utilizando Power BI Embedded.

Si tenemos otro conjunto de datos publicado en el servicio de Power BI que tenga el mismo modelo de datos, con Power BI Embedded podemos indicarle al informe que se conecte a este otro conjunto de datos de forma dinámica, o sea, el cambio es inmediato y no hay que hacer ninguna modificación en el informe.

![Enlace dinámico de un conjunto de datos en Power BI Embedded](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-dynamic-binding.png)

Esto permitiría un escenario en el que podríamos tener un sitio web que brinde servicios a varios clientes y donde compartan un mismo informe, pero que los datos que se visualicen provengan de conjuntos de datos diferentes. Y es de lo que va el demo, pero antes de presentarlo, quisiera explicar el funcionamiento del enlace dinámico.

## Â¿Cómo funciona?

Para incrustar el informe en la página web, primero hay que obtener el "Access Token" y el "Embed Token", como expliqué de manera simplificada en una [entrada anterior](/blog/2020/10/20/power-bi-embedded/), esto se hace en el backend. Y luego en el frontend, hay que configurar la biblioteca JavaScript de Power BI pasándole los parámetros apropiados.

En la imagen siguiente se muestra el código JavaScript para incrustar el reporte. La variable `embedData` contiene los datos que se han generado en el backend. La configuración específica para el enlace dinámico está en las líneas de la 6 a la 9 y consiste en indicar el ID del informe y el ID del conjunto de datos en el servicio de Power BI.

![Configuración en JavaScript para enlace dinámico de un conjunto de datos en Power BI Embedded](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-dynamic-binding-js.jpg)

  
  

Para obtener el ID del informe, que se asigna a la propiedad `id` en la línea 6 del código JavaScript, hay que abrir el informe en el servicio de Power BI y extraerlo del URL en el navegador, como se muestra en la siguiente imagen.  
![Cómo extraer el ID de un informe en el servicio de Power BI](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-dynamic-binding-report-ID.jpg)

  
  

El ID del conjunto de datos, que se asigna a `datasetId` en la línea 8 del código JavaScript, se obtiene de forma similar.

Primero hay que buscar el conjunto de datos en el área de trabajo y entrar en la configuración, como se muestra en la imágen.  
![Cómo entrar a la configuración de un conjunto de datos en el servicio de Power BI](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-dynamic-binding-configuracion-conjunto-de-datos.jpg)

Luego se extrae el ID del URL del navegador, como se muestra en la imagen.  
![Cómo extraer el ID de un conjunto de datos en el servicio de Power BI](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-dynamic-binding-dataset-ID.jpg)

  
  

El `embedUrl`, que se asigna en la línea 5 del código JavaScript, se genera en el backend utilzando la API REST de Power BI. En la imagen siguiente muestro un fragmento de código Python que utiliza la biblioteca [Requests](https://requests.readthedocs.io/en/master/) para generar el "Embed URL".

![Código Python para obtener un Embed URL con la API REST de Power BI](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-embed-url-python.jpg)

- `access_token` contiene el "Access Token" que se ha generado previamente con la API REST de Azure AD
- `report_workspace_id` contiene el ID del área de trabajo donde reside el informe en el servicio de Power BI
- `report_id` contiene el ID del informe en el servicio de Power BI

  
  

El `accessToken` que se asigna en la línea 4 del código JavsScript, es en realidad el "Embed Token" y también se genera en el backend con la API REST de Power BI. Para que la API genere un token con todos los accesos, hay que pasarle el ID del informe, el ID del conjunto de datos y el ID del área de trabajo. En la imagen siguiente muestro otro fragmento de código Python donde se genera el "Embed Token".

![Código Python para obtener un Embed Token con la API REST de Power BI](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-embed-token-python.jpg)

- `access_token` contiene el "Access Token" que se ha generado previamente con la API REST de Azure AD
- `report_id` contiene el ID del informe en el servicio de Power BI
- `dataset_id` contiene el ID del conjunto de datos en el servicio de Power BI
- `report_workspace_id` contiene el ID del área de trabajo donde reside el informe en el servicio de Power BI
- `dataset_workspace_id` contiene el ID del área de trabajo donde reside el conjunto de datos en el servicio de Power BI

Este código admite que el informe y el conjunto de datos residan en diferentes áreas de trabajo.

La API devuelve además del token, la fecha de expiración del mismo, que es de una una hora aproximadamente, lo cuál es una medida de seguridad.

## Demo

La demo consiste en un sitio web que da acceso a un informe de ventas a dos empresas, la empresa BICICLETAS y la empresa ORDENADORES. Se ha creado un usuario para cada empresa y al entrar, cada empresa verá el mismo informe pero con sus datos.

Te invito a probarlo, estos son los datos de acceso:

- Sitio web: [https://dataxbi-powerbi.azurewebsites.net](https://dataxbi-powerbi.azurewebsites.net)/
- Credenciales empresa BICICLETAS

- Usuario: demo-bicicletas
- Contraseña: dataXbi2021

- Credenciales empresa ORDENADORES

- Usuario: demo-ordenadores
- Contraseña: dataXbi2021

Para implementar la demo he creado 4 ficheros PBIX, uno contiene el informe y los otros 3 contienen los conjuntos de datos, uno de ejemplo y uno para cada empresa.

Los 3 conjuntos de datos tienen el mismo modelo, que se muestra a continuación.

![Modelo de datos del demo de Power BI Embedded](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-dynamic-binding-demo-modelo-de-datos.jpg)

Las fuentes de datos son archivos CSV que están en un ordenador, en una carpeta distinta para cada empresa. En los conjuntos de datos he creado un parámetro en Power Query con el camino a la carpeta.  
Lo he hecho de esta manera para simplificar, pero en una situación más realista, las fuentes de datos podrían ser distintas, lo importante es que el modelo de datos siga siendo el mismo.

  
  

El cuarto fichero PBIX contiene el informe, que se conecta al modelo Power BI de ejemplo y que se puede ver en la siguiente imagen.

![Informe del demo de Power BI Embedded](/assets/images/posts/2021-01-11-enlace-dinamico-conjunto-datos-powerbi-embedded/dataXbi-power-bi-embedded-dynamic-binding-demo-informe.jpg)

Para la configuración del sitio web utilizo una base de datos SQL donde se almacena:

- Nombres de las empresas
- Usuarios con credenciales y a qué empresa pertenece
- ID del informe en el servicio de Power BI
- ID de cada conjunto de datos en el servicio de Power BI y a qué empresa pertenece

## Referencias

- [https://github.com/microsoft/PowerBI-JavaScript/wiki/Dynamic-Binding](https://github.com/microsoft/PowerBI-JavaScript/wiki/Dynamic-Binding)
- [https://github.com/microsoft/PowerBI-Developer-Samples](https://github.com/microsoft/PowerBI-Developer-Samples)
