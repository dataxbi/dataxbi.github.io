---
layout: post
title: "Azure Maps en Power BI"
date: 2021-04-16
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "dataviz"
  - "mapas"
---

Azure Maps es una colecci�n de servicios geoespaciales y SDK que emplea datos de mapas recientes para proporcionar contexto geogr�fico a las aplicaciones web y m�viles. El objeto visual Azure Maps est� disponible en Power BI desde julio de 2020, en versi�n preliminar, y se puede utilizar tanto en Power BI Desktop como en el servicio de Power BI. Con esta visualizaci�n podemos representar en un mapa nuestros datos en un contexto de ubicaci�n y ver como este contexto influye en ellos.

<!--more-->

![Azure Maps](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-mapa-de-ventas-1.png)  
  

Este objeto visual tiene 5 �reas de datos:

![Áreas de datos de Azure Maps](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-areas-de-datos-1.png)

La **Longitud** y la **Latitud** son campos obligatorios y la **Leyenda**, el **Tama�o** y la **Informaci�n sobre herramientas** son opcionales.

La latitud y longitud permiten ubicar los lugares en el mapa. Los valores de la latitud deben estar entre -90 y 90 en formato de grados decimales. Los valores de la longitud deben estar entre -180 y 180 en formato de grados decimales.

El campo de la leyenda permite darles color a los datos y el tama�o permite escalar los datos de acuerdo con una medida.

En el �rea Informaci�n sobre herramientas podemos a�adir campos de datos adicionales.

La imagen anterior muestra un ejemplo donde hemos utilizado las coordenadas geogr�ficas de los municipios de Espa�a para la longitud y latitud, en la leyenda hemos a�adido el nombre del municipio y en tama�o hemos situado el importe de las ventas de nuestra tienda de ordenadores.

En el borde superior derecho del mapa hay un men� de configuraci�n con botones para el estilo y la navegaci�n del mapa. Se pueden habilitar y deshabilitar estas y otras opciones en el panel de **Formato**, en la secci�n **Configuraci�n de mapa**.

![Azure Maps botones de configuraci�n del mapa](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-botones-mapa.png)  
  

Con el bot�n selector de estilo podemos cambiar el estilo del mapa. Los estilos disponibles son:

![Configuraci�n de Azure Maps](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-configuraci�n-del-mapa.png)  
  

El estilo por defecto es la escala de grises claros. Puedes encontrar m�s detalles de estos estilos en [Estilos de mapa de Azure Maps integrados admitidos](https://docs.microsoft.com/es-es/azure/azure-maps/supported-map-styles).

Los controles de navegaci�n a�aden botones para acercar, alejar, rotar e inclinar el mapa. Puedes encontrar m�s informaci�n en [Navegaci�n por el mapa](https://docs.microsoft.com/es-es/azure/azure-maps/map-accessibility#navigating-the-map).

### Las capas de Azure Maps

Hay dos tipos de capas disponibles en Azure Maps. El primer tipo se centra en la representaci�n de los datos que se pasan al panel Campos del objeto visual, y son Capa de burbujas y Capa de gr�fico de barras 3D.

El segundo tipo de capa conecta or�genes de datos externos al mapa para proporcionar m�s contexto, y consta de las siguientes capas: Capa de referencia, Capa de mosaico personalizada y Capa de tr�fico.

#### Capa de burbujas

Esta capa representa los puntos como c�rculos a escala en el mapa y est� habilitada por defecto. En el panel **Formato** se puede habilitar y deshabilitar y tambi�n se pueden configurar las opciones de tama�o m�nimo y m�ximo de las burbujas, el m�todo de escalado de las burbujas, la transparencia del relleno, el contorno, el zoom y la posici�n de la capa.

Si no se pasa valor en el �rea Tama�o del panel de Campos todas las burbujas son del mismo tama�o y ese di�metro se define en la configuraci�n de la capa.

#### Capa de gr�fico de barras

Representa puntos como barras 3D o cilindros en el mapa. Utiliza la m�trica del �rea Tama�o para el alto relativo de la barra.

![Azure Maps Capa de gr�fico de barras](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-grafico-de-barras.png)  
  

Por defecto no est� habilitada y se habilita en el panel Formato, en el control deslizante Gr�fico de barras. Una vez habilitado se puede modificar la forma (cuadro o cilindro), la altura, el grosor, la transparencia, el zoom y la posici�n de la capa.

#### Capa de referencia

Esta capa superpone un conjunto de datos en el mapa para proporcionar contexto adicional. Los datos adicionados son cargados desde un archivo **GeoJSON**, con una extensi�n **.json** o **.geojson**, y contiene datos de ubicaci�n personalizados.

En el siguiente mapa se muestra una capa de referencia que contiene las comunidades aut�nomas de Espa�a.

![Azure Maps Capa de referencia](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-referencia.png)  
  

Para a�adir esta capa debes ir al panel **Formato**, expandir la secci�n Capa de referencia y clicar el bot�n Agregar archivo local y seleccionar el archivo GeoJSON.

![Azure Maps a�adir Capa de referencia](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-a�adir-capa-de-referencia-1.png)  
  

En el archivo **GeoJSON** podemos a�adir propiedades a cada una de las caracter�sticas como relleno, contorno y ancho del contorno como se muestra en la siguiente imagen. Puedes encontrar m�s informaci�n en [Propiedades de estilo predeterminadas admitidas](https://docs.microsoft.com/es-es/azure/azure-maps/spatial-io-add-simple-data-layer#default-supported-style-properties).

![Azure Maps Capa de referencia personalizada](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-referencia-colores.png)  
  

#### Capa de tr�fico en tiempo real

Esta capa superpone los datos de tr�fico en tiempo real encima del mapa. En el ejemplo de la imagen hemos utilizado los datos de las paradas de autobuses de TMB. Cada punto representa una parada y podemos ver el estado del tr�fico en el momento actual. Esto nos brinda muchas posibilidades de uso.

![Azure Maps Capa de tr�fico](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-trafico.png)  
  

Por defecto no est� habilitada. Se habilita en el panel Formato, en el control deslizante Capa de tr�fico. Cuando est� activada esta caracter�stica podemos ver las carreteras codificadas por color de acuerdo al estado del tr�fico. En la imagen de arriba se puede ver el estado del tr�fico del centro de Barcelona el d�a 14-04-2021 a las 10:31 a.m.

![Azure Maps escala de colores de las carreteras en capa de tr�fico](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-escala-colores-trafico-1.png)  
  

Despu�s de habilitada la capa de tr�fico podemos habilitar o deshabilitar la opci�n **Mostrar incidentes** que a�ade iconos al mapa con informaci�n sobre los cierres de carretera, condiciones peligrosas, obras, cierre de carril, atascos, nieve.

En la siguiente imagen podemos ver algunos tipos de incidentes sobre el mapa de Barcelona el d�a 14-04-2021 a las 10:36 a.m.

![Azure Maps Capa de tr�fico](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-trafico-2.png)  
  

Al hacer clic sobre un icono nos muestra una ventana con detalles del incidente. Debajo podemos ver detalles de tres tipos de atasco que podemos identificar por la intensidad del color del relleno del icono.

![Azure Maps atasco en carretera](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-atasco-tr�fico-estacionado-1.png)

![Azure Maps atasco en carretera](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-atasco-cola-tr�fico.png)

![Azure Maps atasco en carretera](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-atasco-tr�fico-lento.png)

Cuando habilitamos la opci�n Control de tr�fico se a�ade un nuevo bot�n al mapa para habilitar y deshabilitar la capa de tr�fico.

![Botones de configuraci�n de Azure Maps](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-boton-capa-de-trafico.png)  
  

En el siguiente video puedes ver el uso de la capa de tr�fico y los botones del mapa

<iframe src="https://www.youtube.com/embed/sNggTWsHuJE" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>

  
  

#### Capa de icono o mosaico

Las capas de mosaico superponen im�genes sobre los mapas. Por ejemplo, datos meteorol�gicos de los servicios meteorol�gicos de Azure Maps o datos de cualquier otro servicio de mosaicos. Es una excelente forma de superponer conjuntos de datos grandes o complejos, como im�genes de drones, o millones de filas de datos en el mapa.

![Azure Maps Capa de mosaico](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-mosaico-transporte-publico.png)  
  

En la imagen se muestra una capa del servicio [Thunderforest Maps](https://www.thunderforest.com/maps/), que contiene informaci�n del transporte p�blico a nivel mundial con gran detalle.

#### Configuraci�n de la capa de mosaico

En el panel **Formato**, desplegar la Capa mosaico. A continuaci�n, especificar la URL del servicio TMS

Esta URL debe tener la siguiente estructura: https://ejemplo.com/{z}/{x}/{y}.png?apikey=\[your-api-key\]

En el caso del servicio de mosaicos de radar meteorol�gico en Azure Maps ser�a:

https://atlas.microsoft.com/map/tile?zoom={z}&x={x}&y={y}&tilesetId=microsoft.weather.radar.main&api-version=2.0&subscription-key=\[subscription-key\]

En el ejemplo de la imagen anterior la URL del servicio es:

https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=\[insert-your-apikey-here\]

Al suscribirte al servicio te asignan una clave que debes sustituir en la URL

Todos los mosaicos de este servicio son archivos PNG de 256 x 256 p�xeles, dispuestos en una cuadr�cula cuadrada, numerados comenzando con 0 en la parte superior izquierda del globo. En el nivel de zoom m�s bajo, zoom 0, un mosaico cubre todo el mundo. Los mosaicos est�n numerados como {z} / {x} / {y}, donde z es zoom, x es el n�mero de mosaico de izquierda a derecha e y es el n�mero de mosaico de arriba a abajo.

Los mosaicos est�n disponibles en los niveles de zoom del 0 al 22.

Para este ejemplo he utilizado un [archivo KML](https://www.dataxbi.com/blog/2019/04/18/conectar-visualizar-archivos-kml-power-bi-desktop/) que contiene todas las paradas de autobuses de TMB. En la siguiente imagen cada punto representa una parada y se puede apreciar la correspondencia de los datos y la capa de iconos. Todas las burbujas tienen el mismo radio porque no se ha especificado ninguna medida en el campo Tama�o.

![Azure Maps capa de mosaico con paradas de bus](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-mosaico-transporte-publico-con-paradas-TMB.png)  
  

### Conclusiones

La mayor ventaja de la visualizaci�n Azure Maps es que nos permite conectar con or�genes de datos externos que al adicionarlos al mapa proporcionan un mayor contexto a nuestros datos.

Azure Maps se integra perfectamente dentro de Power BI permiti�ndonos utilizar sus caracter�sticas dentro del mapa, como informaci�n sobre herramientas, temas de color, as� como la compatibilidad con filtros y segmentaciones.

Algunas limitaciones que podemos encontrar son:

- Este objeto visual no est� disponible para Publicar en la web desde Power BI ni para Power BI Embedded.
- No todos los pa�ses tiene cobertura de tr�nsito en Azure Maps. Puedes encontrar en que pa�ses y que nivel de informaci�n y precisi�n tiene este mapa en [Cobertura de tr�fico en Azure Maps.](https://docs.microsoft.com/es-es/azure/azure-maps/traffic-coverage)
- Todav�a est� en versi�n preliminar por lo que para utilizarlo debemos habilitar la opci�n tanto en Power BI Desktop como en el servicio Power BI.
- Hay muchas caracter�sticas de Azure Maps que puedes ver en [Azure Maps Web SDK Samples](https://azuremapscodesamples.azurewebsites.net/) y que no est�n disponibles en la versi�n para Power BI.
