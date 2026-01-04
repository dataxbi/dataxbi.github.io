---
layout: post
title: "Nuevos orígenes compatibles con parámetros dinámicos M"
date: 2022-03-06
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

### Parámetros de consulta dinámica M

La característica Parámetros de consulta dinámica M se añadió en la actualización de octubre de 2020. Con esta funcionalidad los usuarios pueden actualizar dinámicamente los parámetros desde la vista de informe. Lo que permite optimizar el rendimiento de las consultas sin sacrificar la interactividad del informe. Para modificar los valores de los parámetros utilizamos los filtros y las segmentaciones de datos.

<!--more-->

Esta característica solo se puede utilizar en orígenes de datos DirectQuery y está en versión preliminar.

En la entrada del blog [Parámetros de consulta dinámica M](https://www.dataxbi.com/blog/2020/11/03/parametros-consulta-dinamica-m/) analizamos un ejemplo de su uso con el conector Azure Data Explorer (Kusto). También comentamos algunas limitaciones de su uso. Entre estás limitaciones que aún continúan están los tipos de parámetros no soportados, las operaciones no soportadas y filtros no soportados.

En la [actualización de Power BI Desktop de febrero de 2022](https://powerbi.microsoft.com/en-us/blog/power-bi-february-2022-feature-summary/) se han añadido otros orígenes de datos DirectQuery que soportan esta capacidad. Entre estos conectores se encuentran SQL Server, Azure SQL, Azure Synapse Analytics, Oracle, Teradata, SAP Hana Relacional y los flujos de datos.

En esta entrada queremos mostrar el uso de esta característica con el conector SQL Server. Veremos dos ejemplos, cada uno utiliza una base de datos local diferente.

![dataXbi-parametros-dinamicos-SQL-server](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametros-dinamicos-SQL-server-1.png)

El primer ejemplo mostrará un parámetro con selección de un único valor y en el segundo un parámetro con selección de múltiples valores.

### Ejemplo 1

La base de datos de este ejemplo es Navision, Demo Database NAV (8-0). Esta base de datos contiene datos de dos empresas y queremos escoger dinámicamente, desde la vista de informe, de cuál empresa queremos ver sus datos usando parámetros dinámicos.

Para hacer uso de los parámetros dinámicos debemos realizar una serie de pasos que ya vimos en la entrada anterior y que repetiremos aquí para cada ejemplo. Por lo que las únicas diferencias que encontraremos son el conector y las condiciones de filtrado. Veamos el primer ejemplo.

#### Pasos en el Editor de Power Query

Lo primero que haremos será crear los parámetros: uno para el servidor, otro para la base de datos y un tercero para la empresa. Puedes ver la configuración del parámetro Empresa en la siguiente imagen.

![ClipbataXbi-parametro-dinamico-EmpresaActual](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/ClipbataXbi-parametro-dinamico-EmpresaActual.png)

  
  
A continuación seleccionaremos nuevo origen de datos SQL Server y configuraremos el cuadro de diálogo como se muestra en la imagen de debajo.

![dataXbi-conector-sql-server](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-conector-sql-server.png)  
  

Después elegiremos las tablas Item y Item Ledger Entry de una de las dos empresas que contiene la base de datos. Estas tablas contienen los datos de los productos y sus movimientos. Como resultado se obtienen dos consultas.

![dataXbi-navegador-origenes-sql-server](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-navegador-origenes-sql-server.png)  
  

Seleccionamos la consulta Item y nos vamos al paso Navegación en el panel de Configuración de Consultas. En la barra de fórmulas, en la opción Item podemos ver el nombre de la empresa seguido del nombre de la tabla.

![dataXbi-parametro-dinamico-configuracion-consulta](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-configuracion-consulta-1.png)  
  

Además reemplazaremos el nombre de la empresa por el parámetro EmpresaActual que hemos creado previamente y lo concatenamos con el nombre de la tabla como se muestra en la imagen.

![dataXbi-parametro-dinamico-configuracion-consulta-seleccion-multiple](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-configuracion-consulta-seleccion-multiple-4.png)  
  

Lo siguiente será crear una tabla con los distintos valores que puede tomar el parámetro. Esta tabla tendrá dos filas, una por cada empresa. El nombre de la columna que se utilizará para filtrar no debe ser igual al de ninguna columna de las tablas del modelo. Si esto ocurriera, esas tablas resultarían filtradas por los valores seleccionados en el filtro o segmentación de datos.

![dataXbi-parametro-dinamico-tabla-filtro](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-tabla-filtro.png)  
  

También es importante comprobar que el tipo de datos del parámetro y de la columna que se utilizará para filtrar sea el mismo.

Finalmente cargamos las tablas en el modelo.

#### Pasos en la vista de Modelo

Cuando se hayan cargado las tablas nos vamos a la vista de Modelo y seleccionamos la tabla Empresas que es la que utilizaremos para filtrar.

![dataXbi-modelo-con-parametros](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-modelo-con-parametros.png)

  
  
Escogemos la columna Empresa que es la que utilizaremos para filtrar los parámetros y en sus propiedades avanzadas la enlazaremos con el parámetro EmpresaActual.

  
  
![dataXbi-parametro-dinamico-configuracion-avanzada-columna](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/ClipbataXbi-parametro-dinamico-configuracion-avanzada-columnal.png)  
  

#### Pasos en la vista de Informe

Finalmente iremos a la vista de informes y mostraremos los datos en alguna visualización.

En este caso hemos utilizado la visualización Tabla y hemos añadido los campos No\_ y Description de la tabla Item y el campo Quantity de la tabla Item Ledge Entry.

![dataXbi-parametro-dinamico-visualización](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-visualización.png)

Una vez que está lista la visualización, añadimos una segmentación con el campo Empresa de la tabla Empresas. Este es el campo que hemos vinculado al parámetro y que usaremos para filtrar los valores. Automáticamente nos mostrará la segmentación con el formato de selección de valor único, como se muestra en la siguiente imagen.

![dataXbi-parametro-dinamicos-segmentacion-datos](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/ClipbataXbi-parametro-dinamicos-segmentacion-datosl.png)  
  

Por defecto se selecciona el primer valor de la lista y si no coincide con el valor actual del parámetro se ejecuta la consulta con el nuevo valor.

![dataXbi-visualizacion-filtro](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-visualizacion-filtro.png)

  
  
Ahora ya podemos elegir la empresa cuyos datos queremos analizar sin necesidad de crear otro modelo o modificar el código Power Query.

### Ejemplo 2

Para este ejemplo hemos escogido la tabla DimGeography de la base de datos AdventureWorksDW2017. La idea es filtrar la tabla por la columna EnglishCountryRegionName que contiene los nombres de los países. Como resultado el filtro debe permitir seleccionar, todos, ninguno o varios países a la vez.

#### Pasos

1.- Primero crearemos un parámetro para la base de datos y otro para el país (PaisParametro). El parámetro del servidor es el mismo del ejemplo anterior.  
  
![dataXbi-parametro-dinamico-PaisParametro](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-PaisParametro-1.png)

  
  

2.- A continuación crearemos una consulta utilizando el conector SQL Server y a diferencia del ejemplo anterior en lugar de seleccionar tablas escribiremos una consulta nativa.  
  
  
![dataXbi-conector-sql-server-consulta-nativa](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-conector-sql-server-consulta-nativa-1.png)

  
  

3.- A continuación modificaremos la consulta en el editor avanzado añadiendo dos pasos. En el primero comprobaremos si el parámetro contiene una lista de valores o un único valor. En el caso que contenga una lista de valores se concatenarán en una única expresión. Para ello utilizaremos como separador la coma y encerraremos cada valor entre comillas simples. En el caso de que solo sea un valor se encerrará entre comillas simples. En el siguiente paso, definimos la consulta que se ejecutará en SQL Server. Para crear esta consulta usaremos la consulta nativa original a la que le añadiremos la cláusula WHERE. Combinaremos la cláusula WHERE con el operador IN de SQL para indicar que valores del campo EnglishCountryRegionName se seleccionaran. En este caso el conjunto de valores es el resultado del paso anterior. Por último, sustituimos en el paso Origen la consulta nativa por el resultado del paso anterior.  
  
![dataXbi-paso-navegacion-consulta-con-parametro-multiples-valores](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-paso-navegacion-consulta-con-parametro-multiples-valores-1.png)

  
  

4.- A partir de la columna EnglishCountryRegionName crearemos la tabla Países como se muestra en la siguiente imagen.  
  
![dataXbi-parametro-dinamico-tabla-filtro-seleccion-multiple](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-parametro-dinamico-tabla-filtro-seleccion-multiple.png)  
  

  
  

5.- Se eliminan los duplicados de la tabla Países, se cambia el nombre de la columna por País. Recordad que el nombre no debe ser el mismo de la columna de la consulta. A continuación se cargan los datos en el modelo.

6.- En la vista de Modelo vincularemos el campo País de la tabla Países con el parámetro PaisParametro y habilitamos la opción Selección múltiple.  
  
![dataXbi-parametro-dinamico-configuracion-avanzada-columna-pais](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/ClipbataXbi-parametro-dinamico-configuracion-avanzada-columna-pais.png)

  
  

7.- Cambiamos a la vista informe donde crearemos una tabla con los campos City, PostalCode, StateProvinceName y EnglishCountryRegionName. A continuación añadimos una Segmentación de datos con el campo País de la tabla Países.  
  
![dataXbi-visualizacion-filtro-seleccion-multiple](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-visualizacion-filtro-seleccion-multiple-1.png)  
  

Podemos observar que en este caso el control permite seleccionar varios países. Una vez hecha la selección de países se lanza la consulta. Como resultado se actualizan los datos de la tabla mostrando solo la información de los países seleccionados.

#### Opción Seleccionar todo

Si además, queremos habilitar la opción Seleccionar Todo de la segmentación debemos realizar una serie de pasos. El primero es volver a la vista de Modelo y seleccionar la columna País y en las opciones avanzadas habilitar la opción Seleccionar Todo. Después de habilitar esta opción debemos definir el valor que mostrará esa opción, por defecto es \_\_SelectAll\_\_. Si cambiamos el valor debemos garantizar que el que escribamos no esté contenido en la lista de valores de la columna.

  
  
![dataXbi-visualizacion-filtro-seleccion-multiple-ALLSELECT](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-visualizacion-filtro-seleccion-multiple-ALLSELECT.png)  
  

Seguidamente debemos volver al Editor de Power Query a modificar la consulta para que tenga en cuenta este valor. También hemos tenido en cuenta la posibilidad de que el parámetro esté en null.

  
  
![dataXbi-conector-sql-server-consulta-nativa-select-all](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-conector-sql-server-consulta-nativa-select-all-2.png)  
  

Después de aplicar los cambios volvemos a la vista de informe. Seleccionamos la segmentación de datos y en Formato habilitamos la opción Seleccionar todo. Ahora podremos usarla para filtrar los valores.

![dataXbi-visualizacion-filtro-seleccion-multiple](/assets/images/posts/2022-03-06-nuevos-origenes-compatibles-con-parametros-dinamicos-m/dataXbi-visualizacion-filtro-seleccion-multiple.png)

## Consideraciones y limitaciones

Si utilizas parámetros dinámicos debes saber que:

- Los nombres de parámetro no pueden ser palabras reservadas de DAX ni contener espacios
- Un parámetro único no se puede enlazar a varios campos ni viceversa
- No admiten seguridad a nivel de filas
- Tampoco admiten agregaciones

Puedes revisar la documentación de Microsoft sobre [Parámetros de consulta M dinámicos en Power BI Desktop (versión preliminar)](https://docs.microsoft.com/es-es/power-bi/connect-data/desktop-dynamic-m-query-parameters) para conocer que otras consideraciones y limitaciones debes tener en cuenta al usar los parámetros dinámicos.
