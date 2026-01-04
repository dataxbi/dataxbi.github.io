---
layout: post
title: "Conectar y visualizar archivos KML con Power BI Desktop"
date: 2019-04-18
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dataviz"
  - "kml"
  - "mapas"
  - "powerquery"
---

En esta entrada veremos los archivos KML y como desde Power BI Desktop podemos conectarnos a ellos usando el conector de XML, transformarlos y crear visualizaciones con mapas.

<!--more-->

<iframe src="https://www.youtube.com/embed/8XslsoW4pvY" width="560" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

  
  

### KML

[KML](https://developers.google.com/kml/documentation/) es un lenguaje de marcado basado en XML para guardar datos geogr�ficos y anotaciones que se puede aplicar sobre los mapas. Fue desarrollado para ser usado con Keyhole LT, de ah� su nombre (formalmente Keyhole Markup Language). KML es un est�ndar internacional mantenido por [Open Geospatial Consortium, Inc. (OGC)](http://www.opengeospatial.org/standards/kml/).

Puedes usar KML para planificar viajes, compartir datos de ubicaci�n con amigos o grabar caminatas en las que has participado. Tambi�n se pueden utilizar para compartir mapas de recursos naturales y tendencias geogr�ficas o para resaltar problemas y promover cambios.

### Archivos KML

Son archivos escritos con lenguaje KML, cuya extensi�n es kml. Contienen longitudes y latitudes, as� como los marcadores de lugar, formas de pol�gonos, im�genes y texto que pueden utilizarse para ilustrar o designar el sitio concreto o zona en el mapa. Pueden contener informaci�n adicional, tales como el �ngulo y altura de c�mara y los enlaces a los objetos 3D texturados tambi�n pueden guardarse para su uso en los programas de vista 3D de la tierra.

Los archivos KML permiten a los desarrolladores crear sus propias capas de datos que pueden superponerse sobre los mapas existentes con el fin de ilustrar o abstraer.

### Estructura del archivo KML.

Si abrimos un archivo KML en un editor de texto como el bloc de notas o Notepad ++ podemos ver un c�digo como el siguiente:

![Archivo KML](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-estructura-archivo-KML.png)  
  

1. Un encabezado XML que es la primera l�nea de todos los archivos KML. Antes de esta l�nea no puede haber caracteres ni espacios.
2. Una declaraci�n de espacio de nombres de KML que es la segunda l�nea de todo archivo KML 2.2.
3. Un objeto de marca de posici�n (Placemark) que contiene otros elementos.

#### Elementos del objeto Placemark

1. un nombre (name) que se utiliza como etiqueta para la marca de posici�n,
2. una descripci�n (description) que aparecer� en una "vi�eta" en el mapa junto a la marca de posici�n,
3. un punto (Point) que especifica la posici�n de la marca de posici�n en la superficie de la Tierra (la longitud, la latitud y, opcionalmente, la altitud).
4. otros elementos geom�tricos como, por ejemplo, una cadena de l�neas (etiqueta LineString), un pol�gono (etiqueta Polygon) o un modelo (etiqueta Model).
5. En KML, las rutas se crean con el elemento LineString. Dentro de un elemento LineString encontramos otros elementos como las coordenadas (etiqueta coordinates) que puedes ver en la imagen siguiente correspondiente a otro archivo KML. Esta etiqueta contendr� dos o m�s tuplas de coordenadas, cada una de las cuales est� formada por tres valores de punto flotante: longitud, latitud y altitud. El componente de altitud es opcional. Las tuplas se separan mediante un espacio.
6. Cualquier elemento puede tener asociado datos de tiempo. Estos datos de tiempo restringen la visibilidad del conjunto de datos a un determinado punto o per�odo de tiempo. La etiqueta intervalo de tiempo (TimeSpan) tiene un atributo de inicio (begin) y otro de final (end) que indican el per�odo de tiempo que tiene visibilidad el elemento. El valor de la fecha se puede expresar como aaaa-mm-ddThh: mm: ss.ssszzzzzz, donde T es el separador entre la fecha y la hora, y la zona horaria es Z (para UTC) o zzzzzz, que representa ± hh: mm en relaci�n a la UTC. El valor puede expresarse solo como fecha.

![Archivo KML](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-estructura-archivo-KML-ruta.png)  
  

### Aplicaciones que exportan datos en formato KML:

- Google Earth
- Google Maps
- Bing Maps
- ArcGIS Earth
- Geomedia
- SketchUp
- Blender

Como ya sabr�s [Google recolecta nuestra ubicaci�n en todo momento](https://support.google.com/accounts/answer/3118687?hl=es), tanto en iOS como en Android, a pesar de que hayamos [desactivado el historial de ubicaciones](https://qz.com/1131515/google-collects-android-users-locations-even-when-location-services-are-disabled/).

Google Maps permite representar ubicaciones geogr�ficas y rutas. Cuando un usuario busca un negocio, la ubicaci�n es marcada por un indicador en forma de pin sobre el mapa.

![Ubicaci�n en Google map](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ubicacion.jpg)  
  

Google Maps permite la creaci�n de rutas, para desplazarse de una ubicaci�n a otra, como una lista de pasos para el recorrido, calculando el tiempo necesario y la distancia a recorrer entre las ubicaciones. Puede calcular las rutas a pie, en coche, en bicicleta, en avi�n y en transporte p�blico.

![Desplazamiento en Google map](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ruta.jpg)  
  

Tanto la ubicaci�n como la ruta generan datos que se pueden exportar en formato KML. Si abres en tu ordenador la versi�n web de [Google Maps](https://www.google.com/maps) y en el men� seleccionas **Tu cronolog�a** podr�s ver para cada fecha los lugares que visitaste y c�mo hiciste para llegar de un lugar a otro. Para cada tramo del recorrido podr�s ver el medio de transporte que utilizaste y la duraci�n del mismo. Si seleccionas un d�a en particular podr�s ver la ruta que realizaste y descargar el archivo KML correspondiente. Para ello has de seleccionar la opci�n Exportar este d�a en formato KML del men� configuraci�n.

![Exportar ruta de Google map](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ruta-exportar-KML-1.jpg)  
  

El archivo se descarga en tu ordenador como archivo KML y podr�s explorar su contenido con cualquier editor de texto.

### Conectarnos a un origen KML con Power BI Desktop

Podemos crear un modelo en Power BI Desktop y conectarnos al archivo KML. Para ello seguiremos los mismos pasos que ya vimos en una [entrada anterior](https://www.dataxbi.com/blog/2018/10/23/conectarse-origenes-datos-power-bi-desktop-excel-2016/), seleccionamos conectarnos dentro de la categor�a Archivo a un documento XML y oprimimos el bot�n Conectar. Buscamos el archivo que descargamos de Google map y oprimimos el bot�n Abrir. En el Navegador seleccionamos Documento y oprimimos el bot�n Editar.

### Transformar los datos KML

Se abre el Editor de consultas y en el panel de resultados se muestra una tabla con una sola fila y varias columnas expandibles.

#### Transformaciones a nivel de columna: expandir columnas

![Expandir columna](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Editor.jpg)  
  

Seleccionamos la columna Placemark y seleccionamos eliminar las otras columnas. Esta columna se corresponde con el elemento Placemark del archivo KML y es donde est� contenida toda la informaci�n de la ruta. A continuaci�n, expandimos la columna Placemark.

![Expandir columnas](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-columna-Placement.jpg)  
  

Como resultado tenemos una nueva tabla con 5 columnas expandibles. El n�mero de filas var�a en cada caso y depende del recorrido que hicimos y los lugares que visitamos.

Podemos observar que los nombres de las columnas se corresponden con los elementos que vimos anteriormente que puede contener un objeto Placemark de un archivo KML.

Expandimos las columnas address, Point, TimerSpan y por �ltimo LineString. En el caso de esta �ltima columna expandimos solo la columna coordinates como se muestra en la siguiente imagen.

![Expandir columnas](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-columna-LineString.jpg)  
  

#### Transformaciones a nivel de columna: renombrar, dividir por delimitador y cambiar tipo de dato

Renombraremos la columna Element:Text (resultado de haber expandido la columna address) como address y la columna coordinates.1 (resultado de expandir la columna LineString) como ruta.

Seleccionaremos la columna coordinates (resultado de expandir la columna Point) y la dividiremos usando como separador la coma “,”. Seguidamente eliminamos el paso Tipo cambiado que se a�adi� a continuaci�n Dividir columna por delimitador.

Seleccionamos las columnas coordinates.1 y coordinates.2 (resultantes de dividir la columna coordinates) y en el men� contextual escogemos cambiar tipo de datos usando configuraci�n regional.

![Cambiar tipo de dato con configuraci�n regional](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-cambiar-tipo-dato-conf-reg.jpg)  
  

Escogemos en Tipo de datos N�mero decimal y en Configuraci�n regional Ingl�s (Estados Unidos).

![Cambiar tipo de dato con configuraci�n regional](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-conf-reg.jpg)  
  

Cambiamos los nombres de las columnas coordinates.1 y coordinates.2 por punto.longitud y punto.latitud y eliminamos la columna coordinates.3. Cambiamos el tipo de dato de las columnas begin y end (resultantes de expandir la columna TimeSpan) a DateTime.

Seleccionamos la columna ruta y la opci�n Dividir columna usando como delimitador el espacio (anteriormente vimos que las tuplas de puntos se separaban usando un espacio) y en Opciones avanzadas Dividir en Filas.

![Dividir columnas por delimitador, opciones avanzadas](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ruta-dividir-en-filas.jpg)  
  

#### Transformaciones a nivel de tabla: eliminar duplicados, a�adir columna, renombrar consulta

Seleccionamos la columna ruta y repetimos el mismo proceso de divisi�n de la columna coordinates. Renombramos las columnas resultantes como ruta.longitud y ruta.latitud.

Seleccionamos todas las columnas de la tabla y eliminamos los duplicados. A continuaci�n a�adimos una nueva columna de �ndice que comience desde 1 y la nombramos Id.

Finalmente cambiamos el nombre de la consulta por Ruta, seleccionamos Cerrar y aplicar y cargamos la tabla en el modelo.

### Modelado de datos

Una vez que se cargan los datos al modelo, seleccionamos la vista de datos y la pesta�a Modelado. En la vista de datos a cada uno de los campos punto.longitud, punto.latitud, ruta.longitud y ruta.latitud le asignamos la categor�a de datos correspondiente.

![Asignar categor�a de datos a las columnas](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ruta-Modelado.jpg)  
  

### Crear visualizaci�n con Mapa

Ya estamos listos para crear nuestra primera visualizaci�n que ser� un mapa con los lugares que hemos visitado ese d�a. En la vista de Informe seleccionamos el objeto visual Mapa y a continuaci�n en la lista de campos de la tabla Ruta los campos punto.latitud y punto.longitud y los asignamos a los correspondientes campos de la visualizaci�n.

En el mapa se muestran los lugares visitados ese d�a. Si seleccionamos el campo nombre y lo a�adimos como leyenda, cada punto se ver� de color diferente. Al pasar por encima del punto se mostrar� el "Tooltip" con el nombre del lugar y las coordenadas.

![Conectar y visualizar archivos KML con Power BI Desktop](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-visualizacion-Mapa-1.png)  
  

### Crear visualizaci�n con Route map

La siguiente visualizaci�n ser� un mapa con la ruta que hemos seguido para desplazarnos de un lugar a otro. Necesitamos importar un mapa de ruta porque no es uno de los objetos visuales que vienen por defecto con Power BI Desktop.

Para importar el mapa, en el panel Visualizaciones seleccionamos Importar un objeto visual personalizado y a continuaci�n elegimos Importar de Marketplace.

En la ventana Objetos visuales de Power BI, en el buscador escribimos Route y a continuaci�n hacemos clic en la lupa. En el panel de la derecha seleccionamos el objeto Route map para agregarlo a nuestro archivo pbix.

![Importar visualizaci�n Route map](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-importar-visualizacion-Route-map.jpg)  
  

A�adimos una nueva pesta�a al informe y seleccionamos el objeto Route map. En la lista de campo elegimos los campos begin, ruta.latitud, ruta.longitud, name y Id para a�adirlos a la visualizaci�n como se muestra en la siguiente imagen. Podemos modificar los valores de formato del control hasta obtener la misma apariencia que en Google map.

![Conectar y visualizar archivos KML con Power BI Desktop](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-visualizacion-Route-map-2.png)  
  

### Conclusiones

Los archivos KML contienen informaci�n geogr�fica. Pueden contener ubicaciones, zonas geogr�ficas y rutas. Esta informaci�n se encuentra contenida dentro del objeto Placemark.

Podemos conectarnos a los archivos KML desde Power BI Desktop usando el conector de archivo XML. Dentro del Editor de consultas seleccionaremos la columna Placemark que es la que se corresponde con el objeto Placemark del archivo KML. Haremos todas las transformaciones necesarias para poder obtener las coordenadas de los puntos, pol�gonos y lineas que nos permitan representar las ubicaciones, zonas geogr�ficas y rutas.

Para la representaci�n gr�fica de los datos obtenidos podemos usar los mapas est�ndar (mapas), que nos permite representar los lugares visitados, y el control personalizado Route map, que nos permite representar las rutas realizadas entre esos lugares.

La plantilla PBIT de este ejemplo est� disponible en [GitHub](https://github.com/dataxbi/powerbi-desktop).

Puedes ver un v�deo de la creaci�n del modelo en [YouTube](https://youtu.be/8XslsoW4pvY).
