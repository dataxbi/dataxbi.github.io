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

[KML](https://developers.google.com/kml/documentation/) es un lenguaje de marcado basado en XML para guardar datos geográficos y anotaciones que se puede aplicar sobre los mapas. Fue desarrollado para ser usado con Keyhole LT, de ahí su nombre (formalmente Keyhole Markup Language). KML es un estándar internacional mantenido por [Open Geospatial Consortium, Inc. (OGC)](http://www.opengeospatial.org/standards/kml/).

Puedes usar KML para planificar viajes, compartir datos de ubicación con amigos o grabar caminatas en las que has participado. También se pueden utilizar para compartir mapas de recursos naturales y tendencias geográficas o para resaltar problemas y promover cambios.

### Archivos KML

Son archivos escritos con lenguaje KML, cuya extensión es kml. Contienen longitudes y latitudes, así como los marcadores de lugar, formas de polígonos, imágenes y texto que pueden utilizarse para ilustrar o designar el sitio concreto o zona en el mapa. Pueden contener información adicional, tales como el ángulo y altura de cámara y los enlaces a los objetos 3D texturados también pueden guardarse para su uso en los programas de vista 3D de la tierra.

Los archivos KML permiten a los desarrolladores crear sus propias capas de datos que pueden superponerse sobre los mapas existentes con el fin de ilustrar o abstraer.

### Estructura del archivo KML.

Si abrimos un archivo KML en un editor de texto como el bloc de notas o Notepad ++ podemos ver un código como el siguiente:

![Archivo KML](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-estructura-archivo-KML.png)  
  

1. Un encabezado XML que es la primera línea de todos los archivos KML. Antes de esta línea no puede haber caracteres ni espacios.
2. Una declaración de espacio de nombres de KML que es la segunda línea de todo archivo KML 2.2.
3. Un objeto de marca de posición (Placemark) que contiene otros elementos.

#### Elementos del objeto Placemark

1. un nombre (name) que se utiliza como etiqueta para la marca de posición,
2. una descripción (description) que aparecerá en una "viñeta" en el mapa junto a la marca de posición,
3. un punto (Point) que especifica la posición de la marca de posición en la superficie de la Tierra (la longitud, la latitud y, opcionalmente, la altitud).
4. otros elementos geométricos como, por ejemplo, una cadena de líneas (etiqueta LineString), un polígono (etiqueta Polygon) o un modelo (etiqueta Model).
5. En KML, las rutas se crean con el elemento LineString. Dentro de un elemento LineString encontramos otros elementos como las coordenadas (etiqueta coordinates) que puedes ver en la imagen siguiente correspondiente a otro archivo KML. Esta etiqueta contendrá dos o más tuplas de coordenadas, cada una de las cuales está formada por tres valores de punto flotante: longitud, latitud y altitud. El componente de altitud es opcional. Las tuplas se separan mediante un espacio.
6. Cualquier elemento puede tener asociado datos de tiempo. Estos datos de tiempo restringen la visibilidad del conjunto de datos a un determinado punto o período de tiempo. La etiqueta intervalo de tiempo (TimeSpan) tiene un atributo de inicio (begin) y otro de final (end) que indican el período de tiempo que tiene visibilidad el elemento. El valor de la fecha se puede expresar como aaaa-mm-ddThh: mm: ss.ssszzzzzz, donde T es el separador entre la fecha y la hora, y la zona horaria es Z (para UTC) o zzzzzz, que representa Â± hh: mm en relación a la UTC. El valor puede expresarse solo como fecha.

![Archivo KML](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-estructura-archivo-KML-ruta.png)  
  

### Aplicaciones que exportan datos en formato KML:

- Google Earth
- Google Maps
- Bing Maps
- ArcGIS Earth
- Geomedia
- SketchUp
- Blender

Como ya sabrás [Google recolecta nuestra ubicación en todo momento](https://support.google.com/accounts/answer/3118687?hl=es), tanto en iOS como en Android, a pesar de que hayamos [desactivado el historial de ubicaciones](https://qz.com/1131515/google-collects-android-users-locations-even-when-location-services-are-disabled/).

Google Maps permite representar ubicaciones geográficas y rutas. Cuando un usuario busca un negocio, la ubicación es marcada por un indicador en forma de pin sobre el mapa.

![Ubicación en Google map](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ubicacion.jpg)  
  

Google Maps permite la creación de rutas, para desplazarse de una ubicación a otra, como una lista de pasos para el recorrido, calculando el tiempo necesario y la distancia a recorrer entre las ubicaciones. Puede calcular las rutas a pie, en coche, en bicicleta, en avión y en transporte público.

![Desplazamiento en Google map](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ruta.jpg)  
  

Tanto la ubicación como la ruta generan datos que se pueden exportar en formato KML. Si abres en tu ordenador la versión web de [Google Maps](https://www.google.com/maps) y en el menú seleccionas **Tu cronología** podrás ver para cada fecha los lugares que visitaste y cómo hiciste para llegar de un lugar a otro. Para cada tramo del recorrido podrás ver el medio de transporte que utilizaste y la duración del mismo. Si seleccionas un día en particular podrás ver la ruta que realizaste y descargar el archivo KML correspondiente. Para ello has de seleccionar la opción Exportar este día en formato KML del menú configuración.

![Exportar ruta de Google map](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ruta-exportar-KML-1.jpg)  
  

El archivo se descarga en tu ordenador como archivo KML y podrás explorar su contenido con cualquier editor de texto.

### Conectarnos a un origen KML con Power BI Desktop

Podemos crear un modelo en Power BI Desktop y conectarnos al archivo KML. Para ello seguiremos los mismos pasos que ya vimos en una [entrada anterior](https://www.dataxbi.com/blog/2018/10/23/conectarse-origenes-datos-power-bi-desktop-excel-2016/), seleccionamos conectarnos dentro de la categoría Archivo a un documento XML y oprimimos el botón Conectar. Buscamos el archivo que descargamos de Google map y oprimimos el botón Abrir. En el Navegador seleccionamos Documento y oprimimos el botón Editar.

### Transformar los datos KML

Se abre el Editor de consultas y en el panel de resultados se muestra una tabla con una sola fila y varias columnas expandibles.

#### Transformaciones a nivel de columna: expandir columnas

![Expandir columna](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Editor.jpg)  
  

Seleccionamos la columna Placemark y seleccionamos eliminar las otras columnas. Esta columna se corresponde con el elemento Placemark del archivo KML y es donde está contenida toda la información de la ruta. A continuación, expandimos la columna Placemark.

![Expandir columnas](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-columna-Placement.jpg)  
  

Como resultado tenemos una nueva tabla con 5 columnas expandibles. El número de filas varía en cada caso y depende del recorrido que hicimos y los lugares que visitamos.

Podemos observar que los nombres de las columnas se corresponden con los elementos que vimos anteriormente que puede contener un objeto Placemark de un archivo KML.

Expandimos las columnas address, Point, TimerSpan y por último LineString. En el caso de esta última columna expandimos solo la columna coordinates como se muestra en la siguiente imagen.

![Expandir columnas](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-columna-LineString.jpg)  
  

#### Transformaciones a nivel de columna: renombrar, dividir por delimitador y cambiar tipo de dato

Renombraremos la columna Element:Text (resultado de haber expandido la columna address) como address y la columna coordinates.1 (resultado de expandir la columna LineString) como ruta.

Seleccionaremos la columna coordinates (resultado de expandir la columna Point) y la dividiremos usando como separador la coma â€œ,â€. Seguidamente eliminamos el paso Tipo cambiado que se añadió a continuación Dividir columna por delimitador.

Seleccionamos las columnas coordinates.1 y coordinates.2 (resultantes de dividir la columna coordinates) y en el menú contextual escogemos cambiar tipo de datos usando configuración regional.

![Cambiar tipo de dato con configuración regional](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-cambiar-tipo-dato-conf-reg.jpg)  
  

Escogemos en Tipo de datos Número decimal y en Configuración regional Inglés (Estados Unidos).

![Cambiar tipo de dato con configuración regional](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-conf-reg.jpg)  
  

Cambiamos los nombres de las columnas coordinates.1 y coordinates.2 por punto.longitud y punto.latitud y eliminamos la columna coordinates.3. Cambiamos el tipo de dato de las columnas begin y end (resultantes de expandir la columna TimeSpan) a DateTime.

Seleccionamos la columna ruta y la opción Dividir columna usando como delimitador el espacio (anteriormente vimos que las tuplas de puntos se separaban usando un espacio) y en Opciones avanzadas Dividir en Filas.

![Dividir columnas por delimitador, opciones avanzadas](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ruta-dividir-en-filas.jpg)  
  

#### Transformaciones a nivel de tabla: eliminar duplicados, añadir columna, renombrar consulta

Seleccionamos la columna ruta y repetimos el mismo proceso de división de la columna coordinates. Renombramos las columnas resultantes como ruta.longitud y ruta.latitud.

Seleccionamos todas las columnas de la tabla y eliminamos los duplicados. A continuación añadimos una nueva columna de índice que comience desde 1 y la nombramos Id.

Finalmente cambiamos el nombre de la consulta por Ruta, seleccionamos Cerrar y aplicar y cargamos la tabla en el modelo.

### Modelado de datos

Una vez que se cargan los datos al modelo, seleccionamos la vista de datos y la pestaña Modelado. En la vista de datos a cada uno de los campos punto.longitud, punto.latitud, ruta.longitud y ruta.latitud le asignamos la categoría de datos correspondiente.

![Asignar categoría de datos a las columnas](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-Ruta-Modelado.jpg)  
  

### Crear visualización con Mapa

Ya estamos listos para crear nuestra primera visualización que será un mapa con los lugares que hemos visitado ese día. En la vista de Informe seleccionamos el objeto visual Mapa y a continuación en la lista de campos de la tabla Ruta los campos punto.latitud y punto.longitud y los asignamos a los correspondientes campos de la visualización.

En el mapa se muestran los lugares visitados ese día. Si seleccionamos el campo nombre y lo añadimos como leyenda, cada punto se verá de color diferente. Al pasar por encima del punto se mostrará el "Tooltip" con el nombre del lugar y las coordenadas.

![Conectar y visualizar archivos KML con Power BI Desktop](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-visualizacion-Mapa-1.png)  
  

### Crear visualización con Route map

La siguiente visualización será un mapa con la ruta que hemos seguido para desplazarnos de un lugar a otro. Necesitamos importar un mapa de ruta porque no es uno de los objetos visuales que vienen por defecto con Power BI Desktop.

Para importar el mapa, en el panel Visualizaciones seleccionamos Importar un objeto visual personalizado y a continuación elegimos Importar de Marketplace.

En la ventana Objetos visuales de Power BI, en el buscador escribimos Route y a continuación hacemos clic en la lupa. En el panel de la derecha seleccionamos el objeto Route map para agregarlo a nuestro archivo pbix.

![Importar visualización Route map](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-importar-visualizacion-Route-map.jpg)  
  

Añadimos una nueva pestaña al informe y seleccionamos el objeto Route map. En la lista de campo elegimos los campos begin, ruta.latitud, ruta.longitud, name y Id para añadirlos a la visualización como se muestra en la siguiente imagen. Podemos modificar los valores de formato del control hasta obtener la misma apariencia que en Google map.

![Conectar y visualizar archivos KML con Power BI Desktop](/assets/images/posts/2019-04-18-conectar-visualizar-archivos-kml-power-bi-desktop/dataXbi-visualizacion-Route-map-2.png)  
  

### Conclusiones

Los archivos KML contienen información geográfica. Pueden contener ubicaciones, zonas geográficas y rutas. Esta información se encuentra contenida dentro del objeto Placemark.

Podemos conectarnos a los archivos KML desde Power BI Desktop usando el conector de archivo XML. Dentro del Editor de consultas seleccionaremos la columna Placemark que es la que se corresponde con el objeto Placemark del archivo KML. Haremos todas las transformaciones necesarias para poder obtener las coordenadas de los puntos, polígonos y lineas que nos permitan representar las ubicaciones, zonas geográficas y rutas.

Para la representación gráfica de los datos obtenidos podemos usar los mapas estándar (mapas), que nos permite representar los lugares visitados, y el control personalizado Route map, que nos permite representar las rutas realizadas entre esos lugares.

La plantilla PBIT de este ejemplo está disponible en [GitHub](https://github.com/dataxbi/powerbi-desktop).

Puedes ver un vídeo de la creación del modelo en [YouTube](https://youtu.be/8XslsoW4pvY).
