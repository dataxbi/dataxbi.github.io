---
layout: post
title: "Nuevos or�genes compatibles con par�metros din�micos M"
date: 2022-03-06
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

### Par�metros de consulta din�mica M

La caracter�stica Par�metros de consulta din�mica M se a�adi� en la actualizaci�n de octubre de 2020. Con esta funcionalidad los usuarios pueden actualizar din�micamente los par�metros desde la vista de informe. Lo que permite optimizar el rendimiento de las consultas sin sacrificar la interactividad del informe. Para modificar los valores de los par�metros utilizamos los filtros y las segmentaciones de datos.

<!--more-->

Esta caracter�stica solo se puede utilizar en or�genes de datos DirectQuery y est� en versi�n preliminar.

En la entrada del blog [Par�metros de consulta din�mica M](https://www.dataxbi.com/blog/2020/11/03/parametros-consulta-dinamica-m/) analizamos un ejemplo de su uso con el conector Azure Data Explorer (Kusto). Tambi�n comentamos algunas limitaciones de su uso. Entre est�s limitaciones que a�n contin�an est�n los tipos de par�metros no soportados, las operaciones no soportadas y filtros no soportados.

En la [actualizaci�n de Power BI Desktop de febrero de 2022](https://powerbi.microsoft.com/en-us/blog/power-bi-february-2022-feature-summary/) se han a�adido otros or�genes de datos DirectQuery que soportan esta capacidad. Entre estos conectores se encuentran SQL Server, Azure SQL, Azure Synapse Analytics, Oracle, Teradata, SAP Hana Relacional y los flujos de datos.

En esta entrada queremos mostrar el uso de esta caracter�stica con el conector SQL Server. Veremos dos ejemplos, cada uno utiliza una base de datos local diferente.

![dataXbi-parametros-dinamicos-SQL-server](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametros-dinamicos-SQL-server-1.png)

El primer ejemplo mostrar� un par�metro con selecci�n de un �nico valor y en el segundo un par�metro con selecci�n de m�ltiples valores.

### Ejemplo 1

La base de datos de este ejemplo es Navision, Demo Database NAV (8-0). Esta base de datos contiene datos de dos empresas y queremos escoger din�micamente, desde la vista de informe, de cu�l empresa queremos ver sus datos usando par�metros din�micos.

Para hacer uso de los par�metros din�micos debemos realizar una serie de pasos que ya vimos en la entrada anterior y que repetiremos aqu� para cada ejemplo. Por lo que las �nicas diferencias que encontraremos son el conector y las condiciones de filtrado. Veamos el primer ejemplo.

#### Pasos en el Editor de Power Query

Lo primero que haremos ser� crear los par�metros: uno para el servidor, otro para la base de datos y un tercero para la empresa. Puedes ver la configuraci�n del par�metro Empresa en la siguiente imagen.

![ClipbataXbi-parametro-dinamico-EmpresaActual](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/ClipbataXbi-parametro-dinamico-EmpresaActual.png)

  
  
A continuaci�n seleccionaremos nuevo origen de datos SQL Server y configuraremos el cuadro de di�logo como se muestra en la imagen de debajo.

![dataXbi-conector-sql-server](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-conector-sql-server.png)  
  

Despu�s elegiremos las tablas Item y Item Ledger Entry de una de las dos empresas que contiene la base de datos. Estas tablas contienen los datos de los productos y sus movimientos. Como resultado se obtienen dos consultas.

![dataXbi-navegador-origenes-sql-server](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-navegador-origenes-sql-server.png)  
  

Seleccionamos la consulta Item y nos vamos al paso Navegaci�n en el panel de Configuraci�n de Consultas. En la barra de f�rmulas, en la opci�n Item podemos ver el nombre de la empresa seguido del nombre de la tabla.

![dataXbi-parametro-dinamico-configuracion-consulta](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-configuracion-consulta-1.png)  
  

Adem�s reemplazaremos el nombre de la empresa por el par�metro EmpresaActual que hemos creado previamente y lo concatenamos con el nombre de la tabla como se muestra en la imagen.

![dataXbi-parametro-dinamico-configuracion-consulta-seleccion-multiple](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-configuracion-consulta-seleccion-multiple-4.png)  
  

Lo siguiente ser� crear una tabla con los distintos valores que puede tomar el par�metro. Esta tabla tendr� dos filas, una por cada empresa. El nombre de la columna que se utilizar� para filtrar no debe ser igual al de ninguna columna de las tablas del modelo. Si esto ocurriera, esas tablas resultar�an filtradas por los valores seleccionados en el filtro o segmentaci�n de datos.

![dataXbi-parametro-dinamico-tabla-filtro](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-tabla-filtro.png)  
  

Tambi�n es importante comprobar que el tipo de datos del par�metro y de la columna que se utilizar� para filtrar sea el mismo.

Finalmente cargamos las tablas en el modelo.

#### Pasos en la vista de Modelo

Cuando se hayan cargado las tablas nos vamos a la vista de Modelo y seleccionamos la tabla Empresas que es la que utilizaremos para filtrar.

![dataXbi-modelo-con-parametros](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-modelo-con-parametros.png)

  
  
Escogemos la columna Empresa que es la que utilizaremos para filtrar los par�metros y en sus propiedades avanzadas la enlazaremos con el par�metro EmpresaActual.

  
  
![dataXbi-parametro-dinamico-configuracion-avanzada-columna](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/ClipbataXbi-parametro-dinamico-configuracion-avanzada-columnal.png)  
  

#### Pasos en la vista de Informe

Finalmente iremos a la vista de informes y mostraremos los datos en alguna visualizaci�n.

En este caso hemos utilizado la visualizaci�n Tabla y hemos a�adido los campos No\_ y Description de la tabla Item y el campo Quantity de la tabla Item Ledge Entry.

![dataXbi-parametro-dinamico-visualizaci�n](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-visualizaci�n.png)

Una vez que est� lista la visualizaci�n, a�adimos una segmentaci�n con el campo Empresa de la tabla Empresas. Este es el campo que hemos vinculado al par�metro y que usaremos para filtrar los valores. Autom�ticamente nos mostrar� la segmentaci�n con el formato de selecci�n de valor �nico, como se muestra en la siguiente imagen.

![dataXbi-parametro-dinamicos-segmentacion-datos](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/ClipbataXbi-parametro-dinamicos-segmentacion-datosl.png)  
  

Por defecto se selecciona el primer valor de la lista y si no coincide con el valor actual del par�metro se ejecuta la consulta con el nuevo valor.

![dataXbi-visualizacion-filtro](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-visualizacion-filtro.png)

  
  
Ahora ya podemos elegir la empresa cuyos datos queremos analizar sin necesidad de crear otro modelo o modificar el c�digo Power Query.

### Ejemplo 2

Para este ejemplo hemos escogido la tabla DimGeography de la base de datos AdventureWorksDW2017. La idea es filtrar la tabla por la columna EnglishCountryRegionName que contiene los nombres de los pa�ses. Como resultado el filtro debe permitir seleccionar, todos, ninguno o varios pa�ses a la vez.

#### Pasos

1.- Primero crearemos un par�metro para la base de datos y otro para el pa�s (PaisParametro). El par�metro del servidor es el mismo del ejemplo anterior.  
  
![dataXbi-parametro-dinamico-PaisParametro](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-PaisParametro-1.png)

  
  

2.- A continuaci�n crearemos una consulta utilizando el conector SQL Server y a diferencia del ejemplo anterior en lugar de seleccionar tablas escribiremos una consulta nativa.  
  
  
![dataXbi-conector-sql-server-consulta-nativa](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-conector-sql-server-consulta-nativa-1.png)

  
  

3.- A continuaci�n modificaremos la consulta en el editor avanzado a�adiendo dos pasos. En el primero comprobaremos si el par�metro contiene una lista de valores o un �nico valor. En el caso que contenga una lista de valores se concatenar�n en una �nica expresi�n. Para ello utilizaremos como separador la coma y encerraremos cada valor entre comillas simples. En el caso de que solo sea un valor se encerrar� entre comillas simples. En el siguiente paso, definimos la consulta que se ejecutar� en SQL Server. Para crear esta consulta usaremos la consulta nativa original a la que le a�adiremos la cl�usula WHERE. Combinaremos la cl�usula WHERE con el operador IN de SQL para indicar que valores del campo EnglishCountryRegionName se seleccionaran. En este caso el conjunto de valores es el resultado del paso anterior. Por �ltimo, sustituimos en el paso Origen la consulta nativa por el resultado del paso anterior.  
  
![dataXbi-paso-navegacion-consulta-con-parametro-multiples-valores](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-paso-navegacion-consulta-con-parametro-multiples-valores-1.png)

  
  

4.- A partir de la columna EnglishCountryRegionName crearemos la tabla Pa�ses como se muestra en la siguiente imagen.  
  
![dataXbi-parametro-dinamico-tabla-filtro-seleccion-multiple](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-tabla-filtro-seleccion-multiple.png)  
  

  
  

5.- Se eliminan los duplicados de la tabla Pa�ses, se cambia el nombre de la columna por Pa�s. Recordad que el nombre no debe ser el mismo de la columna de la consulta. A continuaci�n se cargan los datos en el modelo.

6.- En la vista de Modelo vincularemos el campo Pa�s de la tabla Pa�ses con el par�metro PaisParametro y habilitamos la opci�n Selecci�n m�ltiple.  
  
![dataXbi-parametro-dinamico-configuracion-avanzada-columna-pais](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/ClipbataXbi-parametro-dinamico-configuracion-avanzada-columna-pais.png)

  
  

7.- Cambiamos a la vista informe donde crearemos una tabla con los campos City, PostalCode, StateProvinceName y EnglishCountryRegionName. A continuaci�n a�adimos una Segmentaci�n de datos con el campo Pa�s de la tabla Pa�ses.  
  
![dataXbi-visualizacion-filtro-seleccion-multiple](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-visualizacion-filtro-seleccion-multiple-1.png)  
  

Podemos observar que en este caso el control permite seleccionar varios pa�ses. Una vez hecha la selecci�n de pa�ses se lanza la consulta. Como resultado se actualizan los datos de la tabla mostrando solo la informaci�n de los pa�ses seleccionados.

#### Opci�n Seleccionar todo

Si adem�s, queremos habilitar la opci�n Seleccionar Todo de la segmentaci�n debemos realizar una serie de pasos. El primero es volver a la vista de Modelo y seleccionar la columna Pa�s y en las opciones avanzadas habilitar la opci�n Seleccionar Todo. Despu�s de habilitar esta opci�n debemos definir el valor que mostrar� esa opci�n, por defecto es \_\_SelectAll\_\_. Si cambiamos el valor debemos garantizar que el que escribamos no est� contenido en la lista de valores de la columna.

  
  
![dataXbi-visualizacion-filtro-seleccion-multiple-ALLSELECT](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-visualizacion-filtro-seleccion-multiple-ALLSELECT.png)  
  

Seguidamente debemos volver al Editor de Power Query a modificar la consulta para que tenga en cuenta este valor. Tambi�n hemos tenido en cuenta la posibilidad de que el par�metro est� en null.

  
  
![dataXbi-conector-sql-server-consulta-nativa-select-all](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-conector-sql-server-consulta-nativa-select-all-2.png)  
  

Despu�s de aplicar los cambios volvemos a la vista de informe. Seleccionamos la segmentaci�n de datos y en Formato habilitamos la opci�n Seleccionar todo. Ahora podremos usarla para filtrar los valores.

![dataXbi-visualizacion-filtro-seleccion-multiple](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-visualizacion-filtro-seleccion-multiple.png)

## Consideraciones y limitaciones

Si utilizas par�metros din�micos debes saber que:

- Los nombres de par�metro no pueden ser palabras reservadas de DAX ni contener espacios
- Un par�metro �nico no se puede enlazar a varios campos ni viceversa
- No admiten seguridad a nivel de filas
- Tampoco admiten agregaciones

Puedes revisar la documentaci�n de Microsoft sobre [Par�metros de consulta M din�micos en Power BI Desktop (versi�n preliminar)](https://docs.microsoft.com/es-es/power-bi/connect-data/desktop-dynamic-m-query-parameters) para conocer que otras consideraciones y limitaciones debes tener en cuenta al usar los par�metros din�micos.
