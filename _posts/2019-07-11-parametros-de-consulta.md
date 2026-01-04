---
layout: post
title: "Par�metros de consulta"
date: 2019-07-11
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

Los par�metros de consulta fueron incorporados en Power BI Desktop en la [actualizaci�n de abril de 2016.](https://powerbi.microsoft.com/es-es/blog/power-bi-desktop-april-update-feature-summary/)

Podemos definir uno o varios par�metros para usarlos en las consultas, en el modelo de datos y en los informes. Los par�metros permiten a los usuarios que existan elementos de sus modelos y consultas que dependan del valor de uno o m�s par�metros.

<!--more-->

### Nuevo par�metro

Los par�metros de consulta se crean desde el Editor de Power Query de una forma f�cil. En la pesta�a Inicio de la cinta de opciones, dentro del grupo Par�metros encontramos las opciones para administrar, editar y crear par�metros.

![Administrador de par�metros de consultaen Power Query](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro1.png)  
  

Al oprimir el bot�n Par�metro nuevo se abre el cuadro de di�logo Par�metros donde podemos definir y modificar los par�metros.

![Nuevo par�metro de consulta - Metadatos y configuraci�n de par�metros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro2.png)  
  

Para a�adir un nuevo par�metro debemos escribir los metadatos y la configuraci�n del par�metro.

- Nombre de par�metro: nombre con el que se har� referencia al par�metro.
- Descripci�n del par�metro: texto que ayuda al usuario que est� especificando el valor del par�metro a comprender mejor el prop�sito y la sem�ntica de este par�metro.
- Opcional o requerido: determina si el par�metro es opcional o no.
- Tipos de datos: es una restricci�n de tipo de datos en el valor de entrada para el par�metro. Si se asigna un tipo de dato al par�metro los valores que se le asignen tendr�n en cuenta las limitaciones del tipo de dato seleccionado. El tipo de dato por defecto es Cualquiera y no tiene restricciones para el valor.
- Valores sugeridos: Son restricciones adicionales a los valores permitidos para un par�metro dado. Pueden ser:

- Cualquier valor: no hay restricciones excepto las del tipo de dato.
- Lista de valores: Se define una lista de valores de los que puede tomar valor el par�metro.
- Consulta: Los valores se pueden seleccionar a partir de una consulta que devuelva una lista de valores. La consulta debe ser de tipo Lista.

- Valor por defecto: Si la opci�n Valores sugeridos es una lista de valores, entonces se muestra esta opci�n para escoger el valor por defecto de esa lista.
- Valor actual: Especifica el valor de este par�metro en el informe actual.

### Ejemplos de par�metros de consulta

El siguiente ejemplo muestra un par�metro creado a partir de una consulta.

La consulta Provincia es una lista (lo podemos identificar r�pidamente por el icono de la consulta) y contiene las provincias de Catalu�a. Para el valor actual se ha escrito Barcelona.

![Nuevo par�metro de consulta - Valores sugeridos: Consulta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro3.png)  
  

El siguiente ejemplo muestra un par�metro creado a partir de una lista de valores.

Si en Valores sugeridos seleccionamos Lista de valores se muestra una caja donde debemos escribir los valores de la lista.

Tanto el Valor predeterminado como el Valor actual se seleccionar�n de la lista de valores sugeridos.

![Crear par�metros de consulta con valores sugerisdos de una lista de valores](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro4.png)  
  

Cuando el par�metro es requerido necesitar� especificar el valor actual.

![Crear par�metro requerido](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro5.png)  
  

En el caso de que los valores sugeridos procedan de una lista de valores tanto el valor predeterminado como el valor actual se seleccionan de la lista.

![Crear par�metros Valor predeterminado y valor actual](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro6.png)  
  

Si los valores sugeridos son Cualquier valor podemos escribir cualquier expresi�n en Valor actual. La �nica restricci�n que tendremos es la de tipo de datos si seleccionamos alguno.

### Administar par�metros de consulta

La opci�n Administrar par�metros nos permite consultar y editar la configuraci�n de los par�metros existentes, as� como crear nuevos par�metros.

![Crear par�metro Valor sugerido: cualquier valor](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-crear-parametro7.png)  
  

### Editar par�metros de consulta

La opci�n Editar par�metros permite consultar y modificar los valores actuales de los par�metros.

![Editar valores de par�metros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-editar-parametro.png)  
  

### Uso de par�metros en Power Query

Se puede hacer uso de los par�metros de consulta a trav�s de los cuadros de di�logo de UX para las operaciones m�s comunes cuando nos conectamos a los datos y cuando realizamos transformaciones en el Editor de Power Query. Por ejemplo, los cuadros de di�logo de conexi�n de la fuente de datos, filtrar filas y reemplazar valores.

A continuaci�n, veamos ejemplos de cada uno de los usos.

#### - Cuadros de di�logos de or�genes de datos

Cuando elegimos conectarnos a un nuevo origen de datos se abre un cuadro de dialogo para seleccionar el nuevo origen del tipo seleccionado.

En la mayor�a de los casos el cuadro de dialogo nos da la opci�n de usar un par�metro existente o crear uno nuevo.

Por ejemplo, en la siguiente imagen el tipo de origen de datos es Carpeta. Este cuadro de di�logo nos da la opci�n de seleccionar un par�metro existente o crear uno nuevo para la ubicaci�n de la carpeta.

![Par�metros de consulta - Cuadro de di�logo Carpeta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conectar-carpeta.png)  
  

La siguiente imagen nos muestra un ejemplo de origen Web. Donde tenemos la opci�n de crear o seleccionar un par�metro existente para la URL de la p�gina web.

![Par�metros de consulta - Cuadro de di�logo Web](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conectar-web.png)  
  

La pr�xima imagen es un ejemplo de origen SQL. En este caso podemos usar par�metros para el nombre del servidor y la base de datos.

![Par�metros de consulta - Cuadro de di�logo SQL Server](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conectar-sql-server.png)  
  

En otros or�genes de datos, como Microsoft Excel, esta opci�n a�n no est� disponible en el momento de conectarnos.

![Par�metros de consulta - Cuadro de di�logo Excel](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conectar-excel.png)  
  

Pero una vez creada la consulta, desde el Editor de Power Query, podemos sustituir la ubicaci�n del archivo por uno o varios par�metros concatenados.

### Cambiar ubicaci�n de origen de datos usando par�metros de consulta

Lo primero ser� seleccionar la consulta en el panel de navegaci�n. Seguidamente, en el panel de configuraci�n de la consulta, oprimir el bot�n de configuraci�n del paso Origen. Se abrir� entonces el cuadro de di�logo del origen y podremos sustituir la ruta del archivo por par�metros.

Si utilizamos la configuraci�n por defecto, que es la b�sica, podremos sustituir la ubicaci�n y el archivo utilizando un solo par�metro.

![Conectar con Excel - Configuraci�n de origen b�sica](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-1.png)  
  

Si escogemos uso avanzado podremos crear varios par�metros. Por ejemplo uno para la carpeta donde se encuentra el archivo y otro para el archivo.

![Conectar con Excel - Configuraci�n de origen avanzada](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-2.png)  
  

Los par�metros no necesitan haber sido creados previamente. Podemos hacerlo en este momento.

#### Crear par�metros de consulta para el origen de datos

![Crear parametro desde configuraci�n origen](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-3.png)  
  

Cuando seleccionamos la opci�n crear nuevo par�metro se abrir� el cuadro de di�logo Par�metros. En el panel de la izquierda podemos ver todos los par�metros que se han creado previamente. Si seleccionamos un par�metro, en el panel de la derecha podemos ver y modificar su configuraci�n.

![Definir metadatos y configuraci�n de par�metro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-4.png)  
  

Encima del panel que contiene la lista de par�metros est� el bot�n Nuevo que nos permite crear un nuevo par�metro.

En la siguiente imagen se muestra un par�metro nuevo. Su nombre es archivo,es de tipo texto y contendr� el nombre y extensi�n del documento: aec-925.xls. Este par�metro es requerido.

![Par�metro de consulta para el nombre de archivo Excel](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-5.png)  
  

#### Utilizar par�metros de consulta para el origen de datos

Una vez creados los par�metros directorio y archivo, los utilizaremos en los elementos de la ruta del archivo como se muestra en la siguiente imagen.

![Elegir par�metros en configuraci�n de origen](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-6.png)  
  

Podr�amos haber creado un tercer par�metro para la contra barra que separa el nombre del archivo de su ubicaci�n y as� no tendr�amos que preocuparnos de ella cuando modifiquemos el valor del par�metro directorio.

![Elegir par�metros en configuraci�n de origen](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-7.png)  
  

Cuando desarrollamos los modelos generalmente los archivos que utilizamos no est�n en la ubicaci�n definitiva. El uso de par�metros en este caso nos permite migrar f�cilmente el modelo al entorno de producci�n sin necesidad de hacer ning�n cambio en el mismo, solo sustituyendo el valor de los par�metros.

Otro caso en que conviene usar par�metros es cuando un mismo modelo puede servir para varios clientes. Si definimos par�metros para los or�genes de datos, con sustituir los valores de los par�metros para cada cliente ser�a suficiente.

#### - Filtros de filas

Los filtros de filas reducen el n�mero de registros o filas que se utilizan en una consulta. Estos filtros sirven para reducir el volumen de datos a la hora de desarrollar y probar el modelo o para utilizar solo una parte de los datos por requerimientos de los datos.

##### - Filtros de valores

Supongamos que tenemos una tabla con todos los municipios y queremos mostrar solo los que contengan la palabra Llobregat en el nombre.

En este caso queremos filtrar los valores de la columna Municipi, de la consulta Municipis.

Tenemos una consulta de nombre Municipis que contiene toda la informaci�n de los municipios de Catalu�a. La columna Municipi contiene los nombres de los municipios y es de tipo texto.

En el encabezado de la columna Municipi, seleccionaremos el men� que se muestra a la derecha del nombre y dentro de los filtros de texto escogeremos la opci�n Contiene…

![Par�metros de consulta - Filtrar filas - Contiene](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-0.png)  
  

Se muestra el cuadro de di�logo Filtrar filas y para el filtro contiene seleccionaremos como valor Par�metro nuevo.

![Par�metro nuevo - Filtrar filas](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-1.png)  
  

Asignaremos al par�metro el nombre Texto a buscar, ser� requerido, su tipo ser� texto y en valor actual escribiremos Llobregat. A continuaci�n, oprimimos el bot�n Aceptar.

![Par�metro tipo texto](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-2.png)  
  

En el cuadro de dialogo Filtrar filas se mostrar� el nombre del par�metro creado y a continuaci�n oprimimos el bot�n Aceptar.

![Filtrar filas - par�metro de tipo texto](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-3.png)  
  

Como resultado el n�mero de filas de la consulta quedar� reducido a 9, y mostrar� la informaci�n de los 9 municipios que contienen en su nombre la palabra Llobregat.

![Panel de resultados filtrado usando par�metro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-filtrar-datos-4.png)  
  

##### - Filtros de fecha

Supongamos que tenemos almacenados datos de 10 a�os en una base de datos y estamos desarrollando un modelo con esta base de datos. En lugar de utilizar todos los registros almacenados pudi�ramos filtrar los datos para un periodo de tiempo determinado, por ejemplo, los �ltimos tres a�os. De esta manera el modelo ser� m�s ligero y no habr� tanta demora cuando se realicen las transformaciones y se carguen los datos al modelo.

Si definimos par�metros para indicar la fecha de comienzo y fin del periodo, una vez terminada la fase de desarrollo podemos sustituir el valor de los par�metros para cargar todos los a�os en el modelo sin modificar las consultas.

Puedes encontrar dos ejemplos de par�metros de Fecha en la entrada del blog [Conectarse a SQL Server desde Power BI Desktop y Excel 2016](https://www.dataxbi.com/blog/2019/02/04/conectarse-sql-server-power-bi-desktop-excel-2016/)

#### - Cuadros de di�logo

##### - Reemplazar valores

Cuando necesitamos reemplazar un valor de una columna por otro. Podemos utilizar par�metros tanto para el valor a buscar como para el valor de reemplazo.

![Reemplazar valores usando par�metro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-reemplazar-valores.png)  
  

##### - Insertar columna condicional

Cuando creamos una columna, usando la opci�n Columna condicional de la pesta�a Agregar columna podemos usar par�metros tanto para los valores de la condici�n como para los valores de los resultados.

![Columna condicional usando par�metro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-dialogo-columna-condicional.png)  
  

##### - Extraer texto

En las columnas de texto, una de las transformaciones m�s usadas est�n en el men� Extraer. Los cuadros de di�logo asociados a los tipos de extracci�n antes de delimitador, despu�s de delimitador y entre delimitadores permiten el uso de par�metros tanto para los delimitadores como para las opciones avanzadas.

![Extrae texto antes de delimitador usando par�metro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-texto-antes-delimitador.png)  
  

##### - Conservar y quitar filas

Los cuadros de di�logo asociados a conservar o quitar filas (superiores e inferiores), conservar intervalo de filas y quitar filas alternas tambi�n permiten el uso de par�metros tanto para el n�mero de filas (en todos los cuadros de dialogo) como para Primera fila (en conservar y quitar intervalo de filas).

![Usar par�metro de consulta para conservar intervalo de filas](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-conservar-intervalo-filas.png)  
  

#### - En Plantillas

- Una plantilla de informe de Power BI contiene la definici�n del informe (p�ginas, im�genes, etc.), la definici�n del modelo de datos (esquema, relaciones, medidas, etc.) y la definici�n de consultas (colecci�n de consultas, incluidos los par�metros de consulta, etc.).
- En otras palabras, una plantilla de Power BI incluye casi todo lo que incluye un archivo PBIX, con la excepci�n de los datos en s�.
- Cuando un usuario intenta crear una instancia de una plantilla, ya sea haciendo doble clic en el archivo PBIT o utilizando la ruta "Archivo -> Importar -> Plantilla de Power BI" desde Power BI Desktop, se crear� un nuevo archivo de Power BI Desktop, que contiene los datos reales basado en las credenciales actuales del usuario para las fuentes de datos, etc.
- Como parte de la importaci�n de una plantilla, se pedir� a los usuarios que proporcionen valores para los par�metros definidos en la plantilla.
- Una vez que se hayan especificado los valores de los Par�metros, se crear� un nuevo archivo PBIX, que contiene todas las p�ginas del Informe, im�genes, artefactos del modelo de datos y consultas como el archivo PBIX original, pero que contiene los datos basados en las credenciales del usuario actual y la selecci�n de par�metros.
- • Las plantillas est�n disponibles desde la actualizaci�n de Power BI Desktop de abril de 2016.

##### Ejemplo de creaci�n de plantilla.

Si una vez que hemos terminado de crear nuestro modelo, elegimos Guardar como tenemos la opci�n de almacenarlo como Archivo de plantilla de Power BI (\*.pbit) como se muestra en la siguiente imagen.

![Guardar informe como plantilla](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-guardar-plantilla.png)  
  

Una vez que hemos oprimido el bot�n Guardar se muestra el cuadro de dialogo Exportar una plantilla donde podemos a�adir una descripci�n de esta. A continuaci�n, oprimimos el bot�n Aceptar y la plantilla se habr� guardado en la ubicaci�n seleccionada.

![Descripci�n de la plantilla de Power BI Desktop](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-guardar-plantilla-2.png)  
  

##### Ejemplo de importar plantilla.

Si tenemos una plantilla y hacemos doble clic sobre ella o en el men� Archivo | Importar la seleccionamos:

![Importar plantilla de Power BI](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-0.png)  
  

Se mostrar� el cuadro de dialogo Abrir plantilla donde seleccionaremos la ubicaci�n y al archivo pbit.

![Cuadro de di�logo abrir plantilla Power BI](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-05.png)  
  

Inmediatamente se abre el cuadro de dialogo de la plantilla elegida donde debemos introducir los valores para cada uno de los par�metros requeridos.

![Escribir valores de par�metros de consulta de la plantilla](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-1.png)  
  

Una vez que se introduzcan los valores de los par�metros oprimiremos el bot�n Cargar.

![Valores actuales de los par�metros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-2.png)  
  

A continuaci�n, nos pedir� las credenciales para conectarnos a los or�genes que lo requieran como la base de datos AdventureWorksDW2017.

![Credenciales de los or�genes de datos](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-4.png)  
  

En el caso que hayamos combinado archivos de diferentes niveles de privacidad nos pedir� definir esos niveles de privacidad para cada archivo.

![Definir el nivel de privacidad de los or�genes de datos](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-3.png)  
  

Una vez introducida toda la informaci�n se proceder� a la carga de los datos en el modelo y se podr�n ver todas las visualizaciones con los nuevos datos.

![Informe creado a partir de la plantilla y los valores de los par�metros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-abrir-plantilla-5.png)  
  

#### - En Power BI Desktop

Desde la ventana principal de Power BI Desktop podemos usar los par�metros sin necesidad de abrir el Editor de Power Query.

##### - Editar el valor del par�metro.

Desde la pesta�a de inicio, en el grupo Datos externos, debajo de Editar consultas est� el bot�n Editar par�metros que los usuarios pueden utilizar para editar los valores de los par�metros.

![Opci�n Editar par�metros de consulta Power BI Desktop](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-valor-parametro-1.png)  
  

Se abrir� la ventana de Par�metros y podemos modificar el valor de los par�metros que necesitamos.

![Escribir el valor de los par�metros](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-valor-parametro-2.png)  
  

Oprimimos el bot�n Aceptar y se actualizar�n los datos del modelo.

![Aplicar los cambios de la consulta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-valor-parametro-5.png)  
  

Una vez modificados oprimimos el bot�n Aceptar y se actualizar�n los datos e informes visuales basados en los nuevos valores de los par�metros.

![Modelo con los datos actualizados despu�s de sustituir valor de par�metro](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-valor-parametro-6.png)  
  

##### - En expresiones DAX.

Si cargamos los par�metros en el modelo de datos al igual que cualquier otra consulta, podemos hacer referencia a ellos en medidas, columnas, tablas calculadas y elementos de informe.

Para cargar los par�metros en el modelo debemos habilitar la carga igual que hacemos con las consultas en el panel de navegaci�n del Editor de Power Query.

![Habilitar carga del par�metro en el modelo de datos](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cargar-parametro-modelo-datos.png)  
  

Una vez que se haya habilitado la carga presionamos "Cerrar y aplicar" en la cinta del Editor de consultas para obtener sus datos y par�metros cargados en el modelo de datos.

![Vista de datos - Par�metro en el modelo de datos](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cargar-parametro-modelo-datos-2.png)  
  

Ahora podemos hacer referencia al par�metro en cualquier expresi�n DAX.

![Usar par�metro de consulta en expresi�n DAX](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-usar-parametro-expresion-DAX.png)  
  

Finalmente podemos visualizar la expresi�n DAX que contiene la referencia al par�metro en un informe.

![Visualizar expresi�n DAX que contiene par�metro de consulta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-visualizar-expresion-DAX-con-parmetro.png)  
  

#### - En el servicio de Power BI

Si hemos creado un informe en Power BI Desktop que contiene par�metros, podemos actualizar esos par�metros desde el servicio Power BI una vez que el informe se haya publicado.

Por ejemplo, si hemos desarrollado un informe usando un servidor y una base de datos de prueba y hemos definido par�metros para almacenar los valores tanto del servidor como de la base de datos, una vez que hemos publicado el informe en el servicio Power BI podemos modificar los valores de los par�metros con los del servidor y la base de datos de producci�n sin necesidad de modificar las consultas.

Para ello, en el servicio Power BI, abra la ventana de configuraci�n.

![Abrir el panel de configuraci�n](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-servicio-powerbi-1.png)  
  

Seleccione la pesta�a Dataset y en el panel de la izquierda seleccione el conjunto de datos que contiene los par�metros.

![Seleccionar el conjunto de datos para modificar sus par�metros de consulta](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-servicio-powerbi-2.png)  
  

En el panel de la derecha despliegue los Par�metros y modifique sus valores.

![Modificar el valor de los par�metros de consulta en el servicio Power BI](/assets/images/posts/2019-07-11-parametros-de-consulta/dataXbi-cambiar-origen-servicio-powerbi-3.png)  
  

A continuaci�n, oprima el bot�n Aplicar. Ahora solo resta actualizar el conjunto de datos con los nuevos valores de los par�metros.

### Consideraciones del uso de par�metros de consulta

- Podemos crear par�metros de consulta en el Editor de Power Query de Microsoft Excel de la misma forma que hemos visto en Power BI Desktop.
- Aplique restricciones a los valores que puede tener un par�metro, incluido un tipo de datos, as� como la capacidad de proporcionar una lista finita de valores aceptados para ese par�metro.
- A d�a de hoy solo es posible seleccionar un �nico valor de una lista de valores del par�metro.
- Se puede hacer referencia a los par�metros a trav�s del lenguaje Power Query M para cualquier paso en sus consultas.
- Los par�metros de consulta tambi�n se pueden actualizar usando APIs.

### Conclusiones

- En Power BI Desktop y Excel podemos definir uno o m�s par�metros y metadatos asociados (nombre, descripci�n, etc.).
- Se puede hacer referencia a los par�metros de consulta a trav�s de los cuadros de di�logo de UX tanto cuando nos conectamos a un origen de datos como cuando realizamos algunas de las transformaciones m�s comunes sobre los datos.
