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

En la entrada [Conectar y visualizar archivos KML con Power BI Desktop](https://www.dataxbi.com/blog/2019/04/18/conectar-visualizar-archivos-kml-power-bi-desktop/) vimos como conectarnos a un archivo KML con el conector XML y transformar los datos para luego representarlos en un mapa con el objeto Route Map. En esta entrada veremos c�mo transformar y visualizar estos datos utilizando el objeto Icon Map.

<!--more-->

Utilizaremos la �ltima [versi�n, beta,](https://icon-map.com/pbiz/IconMap.pbiviz) que se puede descargar de su sitio web. Esta versi�n contiene opciones para la visualizaci�n de los datos en formato Well Known Text (WKT) que no est�n disponibles en la versi�n de Microsoft AppSource.

### Well Known Text ( WKT )

La representaci�n Well Known Text ( WKT ) es una codificaci�n o sintaxis en formato ASCII estandarizada dise�ada para describir objetos espaciales expresados de forma vectorial. Los objetos que es capaz de describir el formato WKT son los siguientes:

- Puntos
- Multipuntos
- L�neas
- Multil�neas
- Pol�gonos
- Multipol�gonos
- Colecciones de geometr�a
- Puntos en 3 y 4 dimensiones

Este formato es soportado por los siguientes sistemas de gesti�n de bases de datos:

- PostgreSQL
- Oracle
- MySQL
- Informix
- MS SQL Server

La sintaxis que utiliza WKT es diferente a la que utilizamos para el objeto ROUTE Map. Necesitamos seguir transformado los datos extra�dos de un archivo KML para tengan el formato que corresponde a alguno de los objetos de WKT.

Por ejemplo, en el caso de la visualizaci�n Route Map utiliz�bamos para representar un punto en el mapa dos campos de coordenadas: longitud y latitud. En el caso de WKT tendremos una sintaxis diferente para cada objeto. Veamos algunos ejemplos.

Sintaxis para denotar un punto:

`POINT(x y)`  

donde x representa la longitud y y la latitud. Las coordenadas se separan con un espacio en blanco. Tanto para la longitud como para la latitud el valor es un n�mero decimal que utiliza el punto "." como separador de lugares decimales.

El ejemplo de punto, que tienes debajo, contiene las coordenadas de la Bas�lica de la Sagrada familia, en Barcelona

`POINT(2.1743558 41.4036299)`  
  

La sintaxis para representar una l�nea es:

`LINESTRING(x1 y1, x2 y2, x3 y3, ... , xn yn)`  
  

donde cada par xi yi representa un punto por donde pasa la l�nea. x1 y1 es el punto inicial y xn yn el punto final. Un ejemplo de una l�nea que pasa por dos puntos:

`LINESTRING(23,1372641016761 -82,3877099673414, 23,1372007307247 -82,3591573577753)`  
  

Para los pol�gonos existen dos sintaxis:

`POLYGON((x1 y1, x2 y2, x3 y3,..., xn yn))`  
  
`POLYGON( (x4 y4,..., xk yk),..., (x5 y5, x6 y6,...,xl yl),..., (x7 y7, x8 y8, x9 y9,..., xm ym) )`  
  

M�s adelante veremos ejemplos de su uso

La sintaxis para un multipunto se parece mucho a la de la l�nea solo cambia que se utiliza delante la palabra MULTIPOINT.

`MULTIPOINT(x1 y1, x2 y2, x3 y3, x4 y4)`  
  

En el caso de la multil�nea la sintaxis ser�a:

`MULTILINESTRING((x1 y1, x2 y2, x3 y3), (x4 y4, x5 y5, x6 y6))`  
  

En este caso son dos l�neas que pasan por tres puntos cada una pero podr�an tener 2 o m�s puntos.

La sintaxis para el Multipol�gono se muestra debajo:

`MULTIPOLYGON (((x1 y1, x2 y2, x3 y3)), ((x4 y4, x5 y5, x6 y6), (x7 y7, x8 y8, x9 y9)))`  
  

En este ejemplo el primer pol�gono es un tri�ngulo pero podr�a ser cualquier forma geom�trica. El segundo pol�gono es el �rea comprendida entre dos tri�ngulos. El resultado final ser� la uni�n de las dos �reas resultantes.

Las colecciones de geometr�a y los puntos en 3 y 4 dimensiones no se pueden representar utilizando el control Icon Map por lo que no veremos sus sintaxis aqu�.

A continuaci�n veremos ejemplos del uso de Icon Map para cada uno de los objetos descritos anteriormente.

Una vez conectados al archivo KML, extra�das las coordenadas geogr�ficas y transformadas en uno de los formatos anteriores, cargamos los datos al modelo y creamos las medidas necesarias. Ahora estamos listos para descargar y utilizar la visualizaci�n Icon Map.

### Importando la visualizaci�n

El primer paso es importar la visualizaci�n. En este caso no escogeremos el objeto de Microsoft AppSource sino que lo importaremos al PBIX desde un archivo que previamente hemos descargado desde el link del desarrollador.

![Importar vizualizaci�n](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-importar-viz.png)  
  

### Configuraci�n del objeto Icon Map

En un lienzo en blanco insertamos la visualizaci�n. Dentro del objeto se muestra informaci�n sobre el uso de la misma como que podemos insertar c�rculos, l�neas e im�genes en un mapa.

![Icon Map dataviz](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-Icon-Map.png)  
  

En la lista de campos de la visualizaci�n podemos observar que los campos Category y Size son obligatorios y que el resto de los campos son opcionales.

El campo Category es de tipo texto y es un identificador �nico para cada objeto que queremos mostrar en el mapa. Si existe m�s de un elemento con el mismo valor de categor�a, el mapa dibujar� un c�rculo en el punto central de estos elementos.

El campo Size es de tipo num�rico y determina el tama�o del circulo que se dibuja en el mapa. Los valores de m�nimo y m�ximo se pueden configurar en las opciones de Data Map Objects.

![Icon Map - Opciones de DataMap Objects](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-opciones-Data-Map-Objects.png)  
  

Para una configuraci�n m�nima de la visualizaci�n, adem�s de estos dos campos, debemos especificar Longitude y Latitude o "Icon URL / WKT / SVG".

El campo "Icon URL / WKT / SVG" es el que utilizaremos para los objetos WKT junto con los campos obligatorios, .

En la siguiente imagen podemos ver representado un punto en el mapa. Las tarjetas que est�n encima de la imagen, muestran los valores de los tres campos: Category, Icon URL / WKT / SVG y Size. El valor del campo "Icon URL / WKT / SVG" es el punto de ejemplo que vimos al principio de la entrada y que representa la ubicaci�n de la Bas�lica de la Sagrada familia de Barcelona como se puede apreciar en el mapa.

![Configuraci�n m�nima WKT](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-configuracion-minima-WKT.png)  
  

Adem�s de a estos 3 campos se le ha asignado valor al campo Label, el mismo valor del campo Category, y que muestra una etiqueta con el nombre del lugar. Para que se muestre la etiqueta es necesario en el formato de la visualizaci�n habilitar la opci�n Labels. Este campo se puede utilizar con im�genes y puntos y sirven para mostrar informaci�n adicional, en este caso el nombre del lugar.

Para mostrar im�genes, c�rculos y l�neas se deben especificar los campos Longitude y Latitude. En la siguiente imagen se puede ver la misma localizaci�n pero utilizando una imagen en lugar del punto. El campo "Icon URL / WKT / SVG" contiene una imagen embebida en una medida en lugar del objeto POINT. Este campo tambi�n podr�a contener la URL de una imagen. Para la ubicaci�n de la imagen en el mapa se han pasado las coordenadas del lugar a los campos latitude y longitude.

![Configuraci�n m�nima WKT con im�genes](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-configuracion-minima-WKT-con-imagenes.png)  
  

Si queremos combinar localizaciones con im�genes debemos especificar tanto el campo "Icon URL / WKT / SVG" como los campos Longitude y Latitude. El campo "Icon URL / WKT / SVG" debe contener los objetos WKT y las im�genes (ya sean embebidas o su URL).

![Combinando im�genes con WKT](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-configuracion-minima-WKT-y-imagenes.png)  
  

En el ejemplo de la imagen anterior hemos utilizado el objeto LINESTRING para representar el recorrido de cada l�nea de autob�s que pasa por Esplugues de Llobregat y una imagen para representar las paradas de los autobuses en el lugar. Es decir, hemos combinado recorridos de l�neas de bus con paradas. Los recorridos de los buses los hemos mostrado usando el objeto LINESTRING y las paradas con una imagen. Estos datos son datos abiertos y fueron obtenidos del sitio web de TMB.

Si se fijan en la imagen todas las l�neas de bus se muestran del mismo color sin embargo en la fuente de datos existe una columna, color\_line, que contiene esa informaci�n. Para poder mostrar cada l�nea de bus con su color debemos rellenar el campo "Circle / Line/ WKT / GeoJson Outline Color" de la visualizaci�n.

En la siguiente imagen te mostramos el uso de esa propiedad utilizando el campo color\_linia del origen de datos para todas las l�neas de bus de Barcelona.

![Icon Map - campo Circle / Line/ WKT / GeoJson Outline Color](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-campo-color.png)  
  

En la siguiente imagen se muestra el uso del objeto MULTIPOINT agrupando las paradas por poblaci�n.

![Icon Map multipoint y color](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-multipoint-color.png)  
  

### Representar formas en el mapa

Para representar formas en el mapa debemos utilizar el campo Image URL / WKT / SVG y el objeto POLYGON:

![Icon Map - pol�gono WKT](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-poligono-WKT-1.png)  
  

En la introducci�n a WKT vimos que los pol�gonos se pueden definir de dos formas diferentes. En la imagen anterior se utiliz� la primera sintaxis de pol�gono que vimos y representa el barrio Sant Antoni, en Barcelona. En este ejemplo se ha utilizado un pol�gono con 8 v�rtices. Las coordenadas del primero y el �ltimo v�rtice son iguales.

La siguiente imagen nos muestra el �rea comprendida entre dos figuras geom�tricas. En este caso se utiliz� la segunda forma de representaci�n de pol�gonos. Es un solo objeto POLYGON que contiene dos conjuntos de puntos. Los dos conjuntos de puntos se encierran entre par�ntesis y se separan por coma ",".

![Icon Map - �rea entre dos pol�gonos WKT](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-area-entre-dos-poligonos-WKT-1.png)  
  

Podemos intersecar varias formas y en este caso utilizaremos un objeto pol�gono para cada figura geom�trica. Cuando esto ocurra el �rea com�n se mostrar� m�s oscura como se observa en la imagen de abajo.

![Icon Map - intersecci�n de pol�gonos](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-intercepcion-poligonos.png)  
  

Tambi�n podemos combinar m�ltiples formas para representar un lugar. En este caso igual que en el anterior se utilizar�n m�ltiples pol�gonos y el resultado ser� la uni�n de todos ellos.

![Icon Map m�ltiples pol�gonos](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-multiples-poligonos-WKT.png)  
  

Tambi�n podemos combinar los pol�gonos con im�genes que pueden estar tanto dentro como fuera de las �reas resultantes. En la imagen de debajo se muestra un mapa donde hemos a�adido en cada pol�gono una foto del lugar y en el centro, en la Plaça de Francesc Macià (en Barcelona) la imagen de una chincheta.

![Icon Map multiples pol�gonos con im�genes](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-multiples-poligonos-con-imagenes-WKT.png)  
  

Puedes utilizar Google Earth para dibujar los pol�gonos, almacenarlos en un archivo KML y luego exportarlos para poder conectarlos desde Power BI Desktop.

Finalmente, en el formato WKT podemos combinar varios de los tipos de objetos en un solo mapa: POINT, MULTIPOINT, LINESTRING, MULTILINESTRING, POLYGON y MULTIPOLYGON. En la siguiente imagen puedes ver un ejemplo donde se combinaron im�genes, LINESTRING y MULTIPOINT.

![Icon Map - geometry collection](/assets/images/posts/2021-02-10-visualizar-archivos-kml-con-icon-map/dataXbi-geometry-collection.png)  
  

Quedan muchas opciones de configuraci�n de la visualizaci�n Icon Map como im�genes en movimiento, im�genes con l�neas de trayectoria continuas y discontinuas, etc, pero lo dejaremos para una pr�xima entrada.
