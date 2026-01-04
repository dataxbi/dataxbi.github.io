---
layout: post
title: "Visualizar archivos KML con Icon Map"
date: 2021-02-10
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dataviz"
  - "kml"
  - "mapas"
  - "powerquery"
---

En la entrada [Conectar y visualizar archivos KML con Power BI Desktop](https://www.dataxbi.com/blog/2019/04/18/conectar-visualizar-archivos-kml-power-bi-desktop/) vimos como conectarnos a un archivo KML con el conector XML y transformar los datos para luego representarlos en un mapa con el objeto Route Map. En esta entrada veremos cómo transformar y visualizar estos datos utilizando el objeto Icon Map.

<!--more-->

Utilizaremos la última [versión, beta,](https://icon-map.com/pbiz/IconMap.pbiviz) que se puede descargar de su sitio web. Esta versión contiene opciones para la visualización de los datos en formato Well Known Text (WKT) que no están disponibles en la versión de Microsoft AppSource.

### Well Known Text ( WKT )

La representación Well Known Text ( WKT ) es una codificación o sintaxis en formato ASCII estandarizada diseñada para describir objetos espaciales expresados de forma vectorial. Los objetos que es capaz de describir el formato WKT son los siguientes:

- Puntos
- Multipuntos
- Líneas
- Multilíneas
- Polígonos
- Multipolígonos
- Colecciones de geometría
- Puntos en 3 y 4 dimensiones

Este formato es soportado por los siguientes sistemas de gestión de bases de datos:

- PostgreSQL
- Oracle
- MySQL
- Informix
- MS SQL Server

La sintaxis que utiliza WKT es diferente a la que utilizamos para el objeto ROUTE Map. Necesitamos seguir transformado los datos extraídos de un archivo KML para tengan el formato que corresponde a alguno de los objetos de WKT.

Por ejemplo, en el caso de la visualización Route Map utilizábamos para representar un punto en el mapa dos campos de coordenadas: longitud y latitud. En el caso de WKT tendremos una sintaxis diferente para cada objeto. Veamos algunos ejemplos.

Sintaxis para denotar un punto:

`POINT(x y)`  

donde x representa la longitud y y la latitud. Las coordenadas se separan con un espacio en blanco. Tanto para la longitud como para la latitud el valor es un número decimal que utiliza el punto "." como separador de lugares decimales.

El ejemplo de punto, que tienes debajo, contiene las coordenadas de la Basílica de la Sagrada familia, en Barcelona

`POINT(2.1743558 41.4036299)`  
  

La sintaxis para representar una línea es:

`LINESTRING(x1 y1, x2 y2, x3 y3, ... , xn yn)`  
  

donde cada par xi yi representa un punto por donde pasa la línea. x1 y1 es el punto inicial y xn yn el punto final. Un ejemplo de una línea que pasa por dos puntos:

`LINESTRING(23,1372641016761 -82,3877099673414, 23,1372007307247 -82,3591573577753)`  
  

Para los polígonos existen dos sintaxis:

`POLYGON((x1 y1, x2 y2, x3 y3,..., xn yn))`  
  
`POLYGON( (x4 y4,..., xk yk),..., (x5 y5, x6 y6,...,xl yl),..., (x7 y7, x8 y8, x9 y9,..., xm ym) )`  
  

Más adelante veremos ejemplos de su uso

La sintaxis para un multipunto se parece mucho a la de la línea solo cambia que se utiliza delante la palabra MULTIPOINT.

`MULTIPOINT(x1 y1, x2 y2, x3 y3, x4 y4)`  
  

En el caso de la multilínea la sintaxis sería:

`MULTILINESTRING((x1 y1, x2 y2, x3 y3), (x4 y4, x5 y5, x6 y6))`  
  

En este caso son dos líneas que pasan por tres puntos cada una pero podrían tener 2 o más puntos.

La sintaxis para el Multipolígono se muestra debajo:

`MULTIPOLYGON (((x1 y1, x2 y2, x3 y3)), ((x4 y4, x5 y5, x6 y6), (x7 y7, x8 y8, x9 y9)))`  
  

En este ejemplo el primer polígono es un triángulo pero podría ser cualquier forma geométrica. El segundo polígono es el área comprendida entre dos triángulos. El resultado final será la unión de las dos áreas resultantes.

Las colecciones de geometría y los puntos en 3 y 4 dimensiones no se pueden representar utilizando el control Icon Map por lo que no veremos sus sintaxis aquí.

A continuación veremos ejemplos del uso de Icon Map para cada uno de los objetos descritos anteriormente.

Una vez conectados al archivo KML, extraídas las coordenadas geográficas y transformadas en uno de los formatos anteriores, cargamos los datos al modelo y creamos las medidas necesarias. Ahora estamos listos para descargar y utilizar la visualización Icon Map.

### Importando la visualización

El primer paso es importar la visualización. En este caso no escogeremos el objeto de Microsoft AppSource sino que lo importaremos al PBIX desde un archivo que previamente hemos descargado desde el link del desarrollador.

![Importar vizualización](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-importar-viz.png)  
  

### Configuración del objeto Icon Map

En un lienzo en blanco insertamos la visualización. Dentro del objeto se muestra información sobre el uso de la misma como que podemos insertar círculos, líneas e imágenes en un mapa.

![Icon Map dataviz](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-Icon-Map.png)  
  

En la lista de campos de la visualización podemos observar que los campos Category y Size son obligatorios y que el resto de los campos son opcionales.

El campo Category es de tipo texto y es un identificador único para cada objeto que queremos mostrar en el mapa. Si existe más de un elemento con el mismo valor de categoría, el mapa dibujará un círculo en el punto central de estos elementos.

El campo Size es de tipo numérico y determina el tamaño del circulo que se dibuja en el mapa. Los valores de mínimo y máximo se pueden configurar en las opciones de Data Map Objects.

![Icon Map - Opciones de DataMap Objects](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-opciones-Data-Map-Objects.png)  
  

Para una configuración mínima de la visualización, además de estos dos campos, debemos especificar Longitude y Latitude o "Icon URL / WKT / SVG".

El campo "Icon URL / WKT / SVG" es el que utilizaremos para los objetos WKT junto con los campos obligatorios, .

En la siguiente imagen podemos ver representado un punto en el mapa. Las tarjetas que están encima de la imagen, muestran los valores de los tres campos: Category, Icon URL / WKT / SVG y Size. El valor del campo "Icon URL / WKT / SVG" es el punto de ejemplo que vimos al principio de la entrada y que representa la ubicación de la Basílica de la Sagrada familia de Barcelona como se puede apreciar en el mapa.

![Configuración mínima WKT](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-configuracion-minima-WKT.png)  
  

Además de a estos 3 campos se le ha asignado valor al campo Label, el mismo valor del campo Category, y que muestra una etiqueta con el nombre del lugar. Para que se muestre la etiqueta es necesario en el formato de la visualización habilitar la opción Labels. Este campo se puede utilizar con imágenes y puntos y sirven para mostrar información adicional, en este caso el nombre del lugar.

Para mostrar imágenes, círculos y líneas se deben especificar los campos Longitude y Latitude. En la siguiente imagen se puede ver la misma localización pero utilizando una imagen en lugar del punto. El campo "Icon URL / WKT / SVG" contiene una imagen embebida en una medida en lugar del objeto POINT. Este campo también podría contener la URL de una imagen. Para la ubicación de la imagen en el mapa se han pasado las coordenadas del lugar a los campos latitude y longitude.

![Configuración mínima WKT con imágenes](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-configuracion-minima-WKT-con-imagenes.png)  
  

Si queremos combinar localizaciones con imágenes debemos especificar tanto el campo "Icon URL / WKT / SVG" como los campos Longitude y Latitude. El campo "Icon URL / WKT / SVG" debe contener los objetos WKT y las imágenes (ya sean embebidas o su URL).

![Combinando imágenes con WKT](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-configuracion-minima-WKT-y-imagenes.png)  
  

En el ejemplo de la imagen anterior hemos utilizado el objeto LINESTRING para representar el recorrido de cada línea de autobús que pasa por Esplugues de Llobregat y una imagen para representar las paradas de los autobuses en el lugar. Es decir, hemos combinado recorridos de líneas de bus con paradas. Los recorridos de los buses los hemos mostrado usando el objeto LINESTRING y las paradas con una imagen. Estos datos son datos abiertos y fueron obtenidos del sitio web de TMB.

Si se fijan en la imagen todas las líneas de bus se muestran del mismo color sin embargo en la fuente de datos existe una columna, color\_line, que contiene esa información. Para poder mostrar cada línea de bus con su color debemos rellenar el campo "Circle / Line/ WKT / GeoJson Outline Color" de la visualización.

En la siguiente imagen te mostramos el uso de esa propiedad utilizando el campo color\_linia del origen de datos para todas las líneas de bus de Barcelona.

![Icon Map - campo Circle / Line/ WKT / GeoJson Outline Color](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-campo-color.png)  
  

En la siguiente imagen se muestra el uso del objeto MULTIPOINT agrupando las paradas por población.

![Icon Map multipoint y color](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-multipoint-color.png)  
  

### Representar formas en el mapa

Para representar formas en el mapa debemos utilizar el campo Image URL / WKT / SVG y el objeto POLYGON:

![Icon Map - polígono WKT](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-poligono-WKT-1.png)  
  

En la introducción a WKT vimos que los polígonos se pueden definir de dos formas diferentes. En la imagen anterior se utilizó la primera sintaxis de polígono que vimos y representa el barrio Sant Antoni, en Barcelona. En este ejemplo se ha utilizado un polígono con 8 vértices. Las coordenadas del primero y el último vértice son iguales.

La siguiente imagen nos muestra el área comprendida entre dos figuras geométricas. En este caso se utilizó la segunda forma de representación de polígonos. Es un solo objeto POLYGON que contiene dos conjuntos de puntos. Los dos conjuntos de puntos se encierran entre paréntesis y se separan por coma ",".

![Icon Map - área entre dos polígonos WKT](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-area-entre-dos-poligonos-WKT-1.png)  
  

Podemos intersecar varias formas y en este caso utilizaremos un objeto polígono para cada figura geométrica. Cuando esto ocurra el área común se mostrará más oscura como se observa en la imagen de abajo.

![Icon Map - intersección de polígonos](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-intercepcion-poligonos.png)  
  

También podemos combinar múltiples formas para representar un lugar. En este caso igual que en el anterior se utilizarán múltiples polígonos y el resultado será la unión de todos ellos.

![Icon Map múltiples polígonos](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-multiples-poligonos-WKT.png)  
  

También podemos combinar los polígonos con imágenes que pueden estar tanto dentro como fuera de las áreas resultantes. En la imagen de debajo se muestra un mapa donde hemos añadido en cada polígono una foto del lugar y en el centro, en la PlaÃ§a de Francesc MaciÃ  (en Barcelona) la imagen de una chincheta.

![Icon Map multiples polígonos con imágenes](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-multiples-poligonos-con-imagenes-WKT.png)  
  

Puedes utilizar Google Earth para dibujar los polígonos, almacenarlos en un archivo KML y luego exportarlos para poder conectarlos desde Power BI Desktop.

Finalmente, en el formato WKT podemos combinar varios de los tipos de objetos en un solo mapa: POINT, MULTIPOINT, LINESTRING, MULTILINESTRING, POLYGON y MULTIPOLYGON. En la siguiente imagen puedes ver un ejemplo donde se combinaron imágenes, LINESTRING y MULTIPOINT.

![Icon Map - geometry collection](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-geometry-collection.png)  
  

Quedan muchas opciones de configuración de la visualización Icon Map como imágenes en movimiento, imágenes con líneas de trayectoria continuas y discontinuas, etc, pero lo dejaremos para una próxima entrada.
