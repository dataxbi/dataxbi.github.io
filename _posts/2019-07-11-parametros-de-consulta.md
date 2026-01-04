---
layout: post
title: "Parámetros de consulta"
date: 2019-07-11
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

Los parámetros de consulta fueron incorporados en Power BI Desktop en la [actualización de abril de 2016.](https://powerbi.microsoft.com/es-es/blog/power-bi-desktop-april-update-feature-summary/)

Podemos definir uno o varios parámetros para usarlos en las consultas, en el modelo de datos y en los informes. Los parámetros permiten a los usuarios que existan elementos de sus modelos y consultas que dependan del valor de uno o más parámetros.

<!--more-->

### Nuevo parámetro

Los parámetros de consulta se crean desde el Editor de Power Query de una forma fácil. En la pestaña Inicio de la cinta de opciones, dentro del grupo Parámetros encontramos las opciones para administrar, editar y crear parámetros.

![Administrador de parámetros de consultaen Power Query](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro1.png)  
  

Al oprimir el botón Parámetro nuevo se abre el cuadro de diálogo Parámetros donde podemos definir y modificar los parámetros.

![Nuevo parámetro de consulta - Metadatos y configuración de parámetros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro2.png)  
  

Para añadir un nuevo parámetro debemos escribir los metadatos y la configuración del parámetro.

- Nombre de parámetro: nombre con el que se hará referencia al parámetro.
- Descripción del parámetro: texto que ayuda al usuario que está especificando el valor del parámetro a comprender mejor el propósito y la semántica de este parámetro.
- Opcional o requerido: determina si el parámetro es opcional o no.
- Tipos de datos: es una restricción de tipo de datos en el valor de entrada para el parámetro. Si se asigna un tipo de dato al parámetro los valores que se le asignen tendrán en cuenta las limitaciones del tipo de dato seleccionado. El tipo de dato por defecto es Cualquiera y no tiene restricciones para el valor.
- Valores sugeridos: Son restricciones adicionales a los valores permitidos para un parámetro dado. Pueden ser:

- Cualquier valor: no hay restricciones excepto las del tipo de dato.
- Lista de valores: Se define una lista de valores de los que puede tomar valor el parámetro.
- Consulta: Los valores se pueden seleccionar a partir de una consulta que devuelva una lista de valores. La consulta debe ser de tipo Lista.

- Valor por defecto: Si la opción Valores sugeridos es una lista de valores, entonces se muestra esta opción para escoger el valor por defecto de esa lista.
- Valor actual: Especifica el valor de este parámetro en el informe actual.

### Ejemplos de parámetros de consulta

El siguiente ejemplo muestra un parámetro creado a partir de una consulta.

La consulta Provincia es una lista (lo podemos identificar rápidamente por el icono de la consulta) y contiene las provincias de Cataluña. Para el valor actual se ha escrito Barcelona.

![Nuevo parámetro de consulta - Valores sugeridos: Consulta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro3.png)  
  

El siguiente ejemplo muestra un parámetro creado a partir de una lista de valores.

Si en Valores sugeridos seleccionamos Lista de valores se muestra una caja donde debemos escribir los valores de la lista.

Tanto el Valor predeterminado como el Valor actual se seleccionarán de la lista de valores sugeridos.

![Crear parámetros de consulta con valores sugerisdos de una lista de valores](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro4.png)  
  

Cuando el parámetro es requerido necesitará especificar el valor actual.

![Crear parámetro requerido](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro5.png)  
  

En el caso de que los valores sugeridos procedan de una lista de valores tanto el valor predeterminado como el valor actual se seleccionan de la lista.

![Crear parámetros Valor predeterminado y valor actual](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro6.png)  
  

Si los valores sugeridos son Cualquier valor podemos escribir cualquier expresión en Valor actual. La única restricción que tendremos es la de tipo de datos si seleccionamos alguno.

### Administar parámetros de consulta

La opción Administrar parámetros nos permite consultar y editar la configuración de los parámetros existentes, así como crear nuevos parámetros.

![Crear parámetro Valor sugerido: cualquier valor](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro7.png)  
  

### Editar parámetros de consulta

La opción Editar parámetros permite consultar y modificar los valores actuales de los parámetros.

![Editar valores de parámetros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-editar-parametro.png)  
  

### Uso de parámetros en Power Query

Se puede hacer uso de los parámetros de consulta a través de los cuadros de diálogo de UX para las operaciones más comunes cuando nos conectamos a los datos y cuando realizamos transformaciones en el Editor de Power Query. Por ejemplo, los cuadros de diálogo de conexión de la fuente de datos, filtrar filas y reemplazar valores.

A continuación, veamos ejemplos de cada uno de los usos.

#### - Cuadros de diálogos de orígenes de datos

Cuando elegimos conectarnos a un nuevo origen de datos se abre un cuadro de dialogo para seleccionar el nuevo origen del tipo seleccionado.

En la mayoría de los casos el cuadro de dialogo nos da la opción de usar un parámetro existente o crear uno nuevo.

Por ejemplo, en la siguiente imagen el tipo de origen de datos es Carpeta. Este cuadro de diálogo nos da la opción de seleccionar un parámetro existente o crear uno nuevo para la ubicación de la carpeta.

![Parámetros de consulta - Cuadro de diálogo Carpeta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conectar-carpeta.png)  
  

La siguiente imagen nos muestra un ejemplo de origen Web. Donde tenemos la opción de crear o seleccionar un parámetro existente para la URL de la página web.

![Parámetros de consulta - Cuadro de diálogo Web](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conectar-web.png)  
  

La próxima imagen es un ejemplo de origen SQL. En este caso podemos usar parámetros para el nombre del servidor y la base de datos.

![Parámetros de consulta - Cuadro de diálogo SQL Server](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conectar-sql-server.png)  
  

En otros orígenes de datos, como Microsoft Excel, esta opción aún no está disponible en el momento de conectarnos.

![Parámetros de consulta - Cuadro de diálogo Excel](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conectar-excel.png)  
  

Pero una vez creada la consulta, desde el Editor de Power Query, podemos sustituir la ubicación del archivo por uno o varios parámetros concatenados.

### Cambiar ubicación de origen de datos usando parámetros de consulta

Lo primero será seleccionar la consulta en el panel de navegación. Seguidamente, en el panel de configuración de la consulta, oprimir el botón de configuración del paso Origen. Se abrirá entonces el cuadro de diálogo del origen y podremos sustituir la ruta del archivo por parámetros.

Si utilizamos la configuración por defecto, que es la básica, podremos sustituir la ubicación y el archivo utilizando un solo parámetro.

![Conectar con Excel - Configuración de origen básica](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-1.png)  
  

Si escogemos uso avanzado podremos crear varios parámetros. Por ejemplo uno para la carpeta donde se encuentra el archivo y otro para el archivo.

![Conectar con Excel - Configuración de origen avanzada](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-2.png)  
  

Los parámetros no necesitan haber sido creados previamente. Podemos hacerlo en este momento.

#### Crear parámetros de consulta para el origen de datos

![Crear parametro desde configuración origen](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-3.png)  
  

Cuando seleccionamos la opción crear nuevo parámetro se abrirá el cuadro de diálogo Parámetros. En el panel de la izquierda podemos ver todos los parámetros que se han creado previamente. Si seleccionamos un parámetro, en el panel de la derecha podemos ver y modificar su configuración.

![Definir metadatos y configuración de parámetro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-4.png)  
  

Encima del panel que contiene la lista de parámetros está el botón Nuevo que nos permite crear un nuevo parámetro.

En la siguiente imagen se muestra un parámetro nuevo. Su nombre es archivo,es de tipo texto y contendrá el nombre y extensión del documento: aec-925.xls. Este parámetro es requerido.

![Parámetro de consulta para el nombre de archivo Excel](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-5.png)  
  

#### Utilizar parámetros de consulta para el origen de datos

Una vez creados los parámetros directorio y archivo, los utilizaremos en los elementos de la ruta del archivo como se muestra en la siguiente imagen.

![Elegir parámetros en configuración de origen](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-6.png)  
  

Podríamos haber creado un tercer parámetro para la contra barra que separa el nombre del archivo de su ubicación y así no tendríamos que preocuparnos de ella cuando modifiquemos el valor del parámetro directorio.

![Elegir parámetros en configuración de origen](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-7.png)  
  

Cuando desarrollamos los modelos generalmente los archivos que utilizamos no están en la ubicación definitiva. El uso de parámetros en este caso nos permite migrar fácilmente el modelo al entorno de producción sin necesidad de hacer ningún cambio en el mismo, solo sustituyendo el valor de los parámetros.

Otro caso en que conviene usar parámetros es cuando un mismo modelo puede servir para varios clientes. Si definimos parámetros para los orígenes de datos, con sustituir los valores de los parámetros para cada cliente sería suficiente.

#### - Filtros de filas

Los filtros de filas reducen el número de registros o filas que se utilizan en una consulta. Estos filtros sirven para reducir el volumen de datos a la hora de desarrollar y probar el modelo o para utilizar solo una parte de los datos por requerimientos de los datos.

##### - Filtros de valores

Supongamos que tenemos una tabla con todos los municipios y queremos mostrar solo los que contengan la palabra Llobregat en el nombre.

En este caso queremos filtrar los valores de la columna Municipi, de la consulta Municipis.

Tenemos una consulta de nombre Municipis que contiene toda la información de los municipios de Cataluña. La columna Municipi contiene los nombres de los municipios y es de tipo texto.

En el encabezado de la columna Municipi, seleccionaremos el menú que se muestra a la derecha del nombre y dentro de los filtros de texto escogeremos la opción Contieneâ€¦

![Parámetros de consulta - Filtrar filas - Contiene](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-0.png)  
  

Se muestra el cuadro de diálogo Filtrar filas y para el filtro contiene seleccionaremos como valor Parámetro nuevo.

![Parámetro nuevo - Filtrar filas](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-1.png)  
  

Asignaremos al parámetro el nombre Texto a buscar, será requerido, su tipo será texto y en valor actual escribiremos Llobregat. A continuación, oprimimos el botón Aceptar.

![Parámetro tipo texto](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-2.png)  
  

En el cuadro de dialogo Filtrar filas se mostrará el nombre del parámetro creado y a continuación oprimimos el botón Aceptar.

![Filtrar filas - parámetro de tipo texto](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-3.png)  
  

Como resultado el número de filas de la consulta quedará reducido a 9, y mostrará la información de los 9 municipios que contienen en su nombre la palabra Llobregat.

![Panel de resultados filtrado usando parámetro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-4.png)  
  

##### - Filtros de fecha

Supongamos que tenemos almacenados datos de 10 años en una base de datos y estamos desarrollando un modelo con esta base de datos. En lugar de utilizar todos los registros almacenados pudiéramos filtrar los datos para un periodo de tiempo determinado, por ejemplo, los últimos tres años. De esta manera el modelo será más ligero y no habrá tanta demora cuando se realicen las transformaciones y se carguen los datos al modelo.

Si definimos parámetros para indicar la fecha de comienzo y fin del periodo, una vez terminada la fase de desarrollo podemos sustituir el valor de los parámetros para cargar todos los años en el modelo sin modificar las consultas.

Puedes encontrar dos ejemplos de parámetros de Fecha en la entrada del blog [Conectarse a SQL Server desde Power BI Desktop y Excel 2016](https://www.dataxbi.com/blog/2019/02/04/conectarse-sql-server-power-bi-desktop-excel-2016/)

#### - Cuadros de diálogo

##### - Reemplazar valores

Cuando necesitamos reemplazar un valor de una columna por otro. Podemos utilizar parámetros tanto para el valor a buscar como para el valor de reemplazo.

![Reemplazar valores usando parámetro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-reemplazar-valores.png)  
  

##### - Insertar columna condicional

Cuando creamos una columna, usando la opción Columna condicional de la pestaña Agregar columna podemos usar parámetros tanto para los valores de la condición como para los valores de los resultados.

![Columna condicional usando parámetro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-dialogo-columna-condicional.png)  
  

##### - Extraer texto

En las columnas de texto, una de las transformaciones más usadas están en el menú Extraer. Los cuadros de diálogo asociados a los tipos de extracción antes de delimitador, después de delimitador y entre delimitadores permiten el uso de parámetros tanto para los delimitadores como para las opciones avanzadas.

![Extrae texto antes de delimitador usando parámetro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-texto-antes-delimitador.png)  
  

##### - Conservar y quitar filas

Los cuadros de diálogo asociados a conservar o quitar filas (superiores e inferiores), conservar intervalo de filas y quitar filas alternas también permiten el uso de parámetros tanto para el número de filas (en todos los cuadros de dialogo) como para Primera fila (en conservar y quitar intervalo de filas).

![Usar parámetro de consulta para conservar intervalo de filas](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conservar-intervalo-filas.png)  
  

#### - En Plantillas

- Una plantilla de informe de Power BI contiene la definición del informe (páginas, imágenes, etc.), la definición del modelo de datos (esquema, relaciones, medidas, etc.) y la definición de consultas (colección de consultas, incluidos los parámetros de consulta, etc.).
- En otras palabras, una plantilla de Power BI incluye casi todo lo que incluye un archivo PBIX, con la excepción de los datos en sí.
- Cuando un usuario intenta crear una instancia de una plantilla, ya sea haciendo doble clic en el archivo PBIT o utilizando la ruta "Archivo -> Importar -> Plantilla de Power BI" desde Power BI Desktop, se creará un nuevo archivo de Power BI Desktop, que contiene los datos reales basado en las credenciales actuales del usuario para las fuentes de datos, etc.
- Como parte de la importación de una plantilla, se pedirá a los usuarios que proporcionen valores para los parámetros definidos en la plantilla.
- Una vez que se hayan especificado los valores de los Parámetros, se creará un nuevo archivo PBIX, que contiene todas las páginas del Informe, imágenes, artefactos del modelo de datos y consultas como el archivo PBIX original, pero que contiene los datos basados en las credenciales del usuario actual y la selección de parámetros.
- â€¢ Las plantillas están disponibles desde la actualización de Power BI Desktop de abril de 2016.

##### Ejemplo de creación de plantilla.

Si una vez que hemos terminado de crear nuestro modelo, elegimos Guardar como tenemos la opción de almacenarlo como Archivo de plantilla de Power BI (\*.pbit) como se muestra en la siguiente imagen.

![Guardar informe como plantilla](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-guardar-plantilla.png)  
  

Una vez que hemos oprimido el botón Guardar se muestra el cuadro de dialogo Exportar una plantilla donde podemos añadir una descripción de esta. A continuación, oprimimos el botón Aceptar y la plantilla se habrá guardado en la ubicación seleccionada.

![Descripción de la plantilla de Power BI Desktop](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-guardar-plantilla-2.png)  
  

##### Ejemplo de importar plantilla.

Si tenemos una plantilla y hacemos doble clic sobre ella o en el menú Archivo | Importar la seleccionamos:

![Importar plantilla de Power BI](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-0.png)  
  

Se mostrará el cuadro de dialogo Abrir plantilla donde seleccionaremos la ubicación y al archivo pbit.

![Cuadro de diálogo abrir plantilla Power BI](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-05.png)  
  

Inmediatamente se abre el cuadro de dialogo de la plantilla elegida donde debemos introducir los valores para cada uno de los parámetros requeridos.

![Escribir valores de parámetros de consulta de la plantilla](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-1.png)  
  

Una vez que se introduzcan los valores de los parámetros oprimiremos el botón Cargar.

![Valores actuales de los parámetros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-2.png)  
  

A continuación, nos pedirá las credenciales para conectarnos a los orígenes que lo requieran como la base de datos AdventureWorksDW2017.

![Credenciales de los orígenes de datos](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-4.png)  
  

En el caso que hayamos combinado archivos de diferentes niveles de privacidad nos pedirá definir esos niveles de privacidad para cada archivo.

![Definir el nivel de privacidad de los orígenes de datos](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-3.png)  
  

Una vez introducida toda la información se procederá a la carga de los datos en el modelo y se podrán ver todas las visualizaciones con los nuevos datos.

![Informe creado a partir de la plantilla y los valores de los parámetros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-5.png)  
  

#### - En Power BI Desktop

Desde la ventana principal de Power BI Desktop podemos usar los parámetros sin necesidad de abrir el Editor de Power Query.

##### - Editar el valor del parámetro.

Desde la pestaña de inicio, en el grupo Datos externos, debajo de Editar consultas está el botón Editar parámetros que los usuarios pueden utilizar para editar los valores de los parámetros.

![Opción Editar parámetros de consulta Power BI Desktop](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-valor-parametro-1.png)  
  

Se abrirá la ventana de Parámetros y podemos modificar el valor de los parámetros que necesitamos.

![Escribir el valor de los parámetros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-valor-parametro-2.png)  
  

Oprimimos el botón Aceptar y se actualizarán los datos del modelo.

![Aplicar los cambios de la consulta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-valor-parametro-5.png)  
  

Una vez modificados oprimimos el botón Aceptar y se actualizarán los datos e informes visuales basados en los nuevos valores de los parámetros.

![Modelo con los datos actualizados después de sustituir valor de parámetro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-valor-parametro-6.png)  
  

##### - En expresiones DAX.

Si cargamos los parámetros en el modelo de datos al igual que cualquier otra consulta, podemos hacer referencia a ellos en medidas, columnas, tablas calculadas y elementos de informe.

Para cargar los parámetros en el modelo debemos habilitar la carga igual que hacemos con las consultas en el panel de navegación del Editor de Power Query.

![Habilitar carga del parámetro en el modelo de datos](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cargar-parametro-modelo-datos.png)  
  

Una vez que se haya habilitado la carga presionamos "Cerrar y aplicar" en la cinta del Editor de consultas para obtener sus datos y parámetros cargados en el modelo de datos.

![Vista de datos - Parámetro en el modelo de datos](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cargar-parametro-modelo-datos-2.png)  
  

Ahora podemos hacer referencia al parámetro en cualquier expresión DAX.

![Usar parámetro de consulta en expresión DAX](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-usar-parametro-expresion-DAX.png)  
  

Finalmente podemos visualizar la expresión DAX que contiene la referencia al parámetro en un informe.

![Visualizar expresión DAX que contiene parámetro de consulta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-visualizar-expresion-DAX-con-parmetro.png)  
  

#### - En el servicio de Power BI

Si hemos creado un informe en Power BI Desktop que contiene parámetros, podemos actualizar esos parámetros desde el servicio Power BI una vez que el informe se haya publicado.

Por ejemplo, si hemos desarrollado un informe usando un servidor y una base de datos de prueba y hemos definido parámetros para almacenar los valores tanto del servidor como de la base de datos, una vez que hemos publicado el informe en el servicio Power BI podemos modificar los valores de los parámetros con los del servidor y la base de datos de producción sin necesidad de modificar las consultas.

Para ello, en el servicio Power BI, abra la ventana de configuración.

![Abrir el panel de configuración](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-servicio-powerbi-1.png)  
  

Seleccione la pestaña Dataset y en el panel de la izquierda seleccione el conjunto de datos que contiene los parámetros.

![Seleccionar el conjunto de datos para modificar sus parámetros de consulta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-servicio-powerbi-2.png)  
  

En el panel de la derecha despliegue los Parámetros y modifique sus valores.

![Modificar el valor de los parámetros de consulta en el servicio Power BI](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-servicio-powerbi-3.png)  
  

A continuación, oprima el botón Aplicar. Ahora solo resta actualizar el conjunto de datos con los nuevos valores de los parámetros.

### Consideraciones del uso de parámetros de consulta

- Podemos crear parámetros de consulta en el Editor de Power Query de Microsoft Excel de la misma forma que hemos visto en Power BI Desktop.
- Aplique restricciones a los valores que puede tener un parámetro, incluido un tipo de datos, así como la capacidad de proporcionar una lista finita de valores aceptados para ese parámetro.
- A día de hoy solo es posible seleccionar un único valor de una lista de valores del parámetro.
- Se puede hacer referencia a los parámetros a través del lenguaje Power Query M para cualquier paso en sus consultas.
- Los parámetros de consulta también se pueden actualizar usando APIs.

### Conclusiones

- En Power BI Desktop y Excel podemos definir uno o más parámetros y metadatos asociados (nombre, descripción, etc.).
- Se puede hacer referencia a los parámetros de consulta a través de los cuadros de diálogo de UX tanto cuando nos conectamos a un origen de datos como cuando realizamos algunas de las transformaciones más comunes sobre los datos.
