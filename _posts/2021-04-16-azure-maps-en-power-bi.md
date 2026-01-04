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

Azure Maps es una colección de servicios geoespaciales y SDK que emplea datos de mapas recientes para proporcionar contexto geográfico a las aplicaciones web y móviles. El objeto visual Azure Maps está disponible en Power BI desde julio de 2020, en versión preliminar, y se puede utilizar tanto en Power BI Desktop como en el servicio de Power BI. Con esta visualización podemos representar en un mapa nuestros datos en un contexto de ubicación y ver como este contexto influye en ellos.

<!--more-->

![Azure Maps](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-mapa-de-ventas-1.png)  
  

Este objeto visual tiene 5 áreas de datos:

![Ãreas de datos de Azure Maps](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-areas-de-datos-1.png)

La **Longitud** y la **Latitud** son campos obligatorios y la **Leyenda**, el **Tamaño** y la **Información sobre herramientas** son opcionales.

La latitud y longitud permiten ubicar los lugares en el mapa. Los valores de la latitud deben estar entre -90 y 90 en formato de grados decimales. Los valores de la longitud deben estar entre -180 y 180 en formato de grados decimales.

El campo de la leyenda permite darles color a los datos y el tamaño permite escalar los datos de acuerdo con una medida.

En el área Información sobre herramientas podemos añadir campos de datos adicionales.

La imagen anterior muestra un ejemplo donde hemos utilizado las coordenadas geográficas de los municipios de España para la longitud y latitud, en la leyenda hemos añadido el nombre del municipio y en tamaño hemos situado el importe de las ventas de nuestra tienda de ordenadores.

En el borde superior derecho del mapa hay un menú de configuración con botones para el estilo y la navegación del mapa. Se pueden habilitar y deshabilitar estas y otras opciones en el panel de **Formato**, en la sección **Configuración de mapa**.

![Azure Maps botones de configuración del mapa](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-botones-mapa.png)  
  

Con el botón selector de estilo podemos cambiar el estilo del mapa. Los estilos disponibles son:

![Configuración de Azure Maps](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-configuración-del-mapa.png)  
  

El estilo por defecto es la escala de grises claros. Puedes encontrar más detalles de estos estilos en [Estilos de mapa de Azure Maps integrados admitidos](https://docs.microsoft.com/es-es/azure/azure-maps/supported-map-styles).

Los controles de navegación añaden botones para acercar, alejar, rotar e inclinar el mapa. Puedes encontrar más información en [Navegación por el mapa](https://docs.microsoft.com/es-es/azure/azure-maps/map-accessibility#navigating-the-map).

### Las capas de Azure Maps

Hay dos tipos de capas disponibles en Azure Maps. El primer tipo se centra en la representación de los datos que se pasan al panel Campos del objeto visual, y son Capa de burbujas y Capa de gráfico de barras 3D.

El segundo tipo de capa conecta orígenes de datos externos al mapa para proporcionar más contexto, y consta de las siguientes capas: Capa de referencia, Capa de mosaico personalizada y Capa de tráfico.

#### Capa de burbujas

Esta capa representa los puntos como círculos a escala en el mapa y está habilitada por defecto. En el panel **Formato** se puede habilitar y deshabilitar y también se pueden configurar las opciones de tamaño mínimo y máximo de las burbujas, el método de escalado de las burbujas, la transparencia del relleno, el contorno, el zoom y la posición de la capa.

Si no se pasa valor en el área Tamaño del panel de Campos todas las burbujas son del mismo tamaño y ese diámetro se define en la configuración de la capa.

#### Capa de gráfico de barras

Representa puntos como barras 3D o cilindros en el mapa. Utiliza la métrica del área Tamaño para el alto relativo de la barra.

![Azure Maps Capa de gráfico de barras](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-grafico-de-barras.png)  
  

Por defecto no está habilitada y se habilita en el panel Formato, en el control deslizante Gráfico de barras. Una vez habilitado se puede modificar la forma (cuadro o cilindro), la altura, el grosor, la transparencia, el zoom y la posición de la capa.

#### Capa de referencia

Esta capa superpone un conjunto de datos en el mapa para proporcionar contexto adicional. Los datos adicionados son cargados desde un archivo **GeoJSON**, con una extensión **.json** o **.geojson**, y contiene datos de ubicación personalizados.

En el siguiente mapa se muestra una capa de referencia que contiene las comunidades autónomas de España.

![Azure Maps Capa de referencia](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-referencia.png)  
  

Para añadir esta capa debes ir al panel **Formato**, expandir la sección Capa de referencia y clicar el botón Agregar archivo local y seleccionar el archivo GeoJSON.

![Azure Maps añadir Capa de referencia](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-añadir-capa-de-referencia-1.png)  
  

En el archivo **GeoJSON** podemos añadir propiedades a cada una de las características como relleno, contorno y ancho del contorno como se muestra en la siguiente imagen. Puedes encontrar más información en [Propiedades de estilo predeterminadas admitidas](https://docs.microsoft.com/es-es/azure/azure-maps/spatial-io-add-simple-data-layer#default-supported-style-properties).

![Azure Maps Capa de referencia personalizada](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-referencia-colores.png)  
  

#### Capa de tráfico en tiempo real

Esta capa superpone los datos de tráfico en tiempo real encima del mapa. En el ejemplo de la imagen hemos utilizado los datos de las paradas de autobuses de TMB. Cada punto representa una parada y podemos ver el estado del tráfico en el momento actual. Esto nos brinda muchas posibilidades de uso.

![Azure Maps Capa de tráfico](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-trafico.png)  
  

Por defecto no está habilitada. Se habilita en el panel Formato, en el control deslizante Capa de tráfico. Cuando está activada esta característica podemos ver las carreteras codificadas por color de acuerdo al estado del tráfico. En la imagen de arriba se puede ver el estado del tráfico del centro de Barcelona el día 14-04-2021 a las 10:31 a.m.

![Azure Maps escala de colores de las carreteras en capa de tráfico](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-escala-colores-trafico-1.png)  
  

Después de habilitada la capa de tráfico podemos habilitar o deshabilitar la opción **Mostrar incidentes** que añade iconos al mapa con información sobre los cierres de carretera, condiciones peligrosas, obras, cierre de carril, atascos, nieve.

En la siguiente imagen podemos ver algunos tipos de incidentes sobre el mapa de Barcelona el día 14-04-2021 a las 10:36 a.m.

![Azure Maps Capa de tráfico](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-trafico-2.png)  
  

Al hacer clic sobre un icono nos muestra una ventana con detalles del incidente. Debajo podemos ver detalles de tres tipos de atasco que podemos identificar por la intensidad del color del relleno del icono.

![Azure Maps atasco en carretera](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-atasco-tráfico-estacionado-1.png)

![Azure Maps atasco en carretera](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-atasco-cola-tráfico.png)

![Azure Maps atasco en carretera](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-atasco-tráfico-lento.png)

Cuando habilitamos la opción Control de tráfico se añade un nuevo botón al mapa para habilitar y deshabilitar la capa de tráfico.

![Botones de configuración de Azure Maps](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-boton-capa-de-trafico.png)  
  

En el siguiente video puedes ver el uso de la capa de tráfico y los botones del mapa

<iframe src="https://www.youtube.com/embed/sNggTWsHuJE" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>

  
  

#### Capa de icono o mosaico

Las capas de mosaico superponen imágenes sobre los mapas. Por ejemplo, datos meteorológicos de los servicios meteorológicos de Azure Maps o datos de cualquier otro servicio de mosaicos. Es una excelente forma de superponer conjuntos de datos grandes o complejos, como imágenes de drones, o millones de filas de datos en el mapa.

![Azure Maps Capa de mosaico](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-mosaico-transporte-publico.png)  
  

En la imagen se muestra una capa del servicio [Thunderforest Maps](https://www.thunderforest.com/maps/), que contiene información del transporte público a nivel mundial con gran detalle.

#### Configuración de la capa de mosaico

En el panel **Formato**, desplegar la Capa mosaico. A continuación, especificar la URL del servicio TMS

Esta URL debe tener la siguiente estructura: https://ejemplo.com/{z}/{x}/{y}.png?apikey=\[your-api-key\]

En el caso del servicio de mosaicos de radar meteorológico en Azure Maps sería:

https://atlas.microsoft.com/map/tile?zoom={z}&x={x}&y={y}&tilesetId=microsoft.weather.radar.main&api-version=2.0&subscription-key=\[subscription-key\]

En el ejemplo de la imagen anterior la URL del servicio es:

https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=\[insert-your-apikey-here\]

Al suscribirte al servicio te asignan una clave que debes sustituir en la URL

Todos los mosaicos de este servicio son archivos PNG de 256 x 256 píxeles, dispuestos en una cuadrícula cuadrada, numerados comenzando con 0 en la parte superior izquierda del globo. En el nivel de zoom más bajo, zoom 0, un mosaico cubre todo el mundo. Los mosaicos están numerados como {z} / {x} / {y}, donde z es zoom, x es el número de mosaico de izquierda a derecha e y es el número de mosaico de arriba a abajo.

Los mosaicos están disponibles en los niveles de zoom del 0 al 22.

Para este ejemplo he utilizado un [archivo KML](https://www.dataxbi.com/blog/2019/04/18/conectar-visualizar-archivos-kml-power-bi-desktop/) que contiene todas las paradas de autobuses de TMB. En la siguiente imagen cada punto representa una parada y se puede apreciar la correspondencia de los datos y la capa de iconos. Todas las burbujas tienen el mismo radio porque no se ha especificado ninguna medida en el campo Tamaño.

![Azure Maps capa de mosaico con paradas de bus](/assets/images/posts/2021-04-16-azure-maps-en-power-bi/dataXbi-capa-de-mosaico-transporte-publico-con-paradas-TMB.png)  
  

### Conclusiones

La mayor ventaja de la visualización Azure Maps es que nos permite conectar con orígenes de datos externos que al adicionarlos al mapa proporcionan un mayor contexto a nuestros datos.

Azure Maps se integra perfectamente dentro de Power BI permitiéndonos utilizar sus características dentro del mapa, como información sobre herramientas, temas de color, así como la compatibilidad con filtros y segmentaciones.

Algunas limitaciones que podemos encontrar son:

- Este objeto visual no está disponible para Publicar en la web desde Power BI ni para Power BI Embedded.
- No todos los países tiene cobertura de tránsito en Azure Maps. Puedes encontrar en que países y que nivel de información y precisión tiene este mapa en [Cobertura de tráfico en Azure Maps.](https://docs.microsoft.com/es-es/azure/azure-maps/traffic-coverage)
- Todavía está en versión preliminar por lo que para utilizarlo debemos habilitar la opción tanto en Power BI Desktop como en el servicio Power BI.
- Hay muchas características de Azure Maps que puedes ver en [Azure Maps Web SDK Samples](https://azuremapscodesamples.azurewebsites.net/) y que no están disponibles en la versión para Power BI.
