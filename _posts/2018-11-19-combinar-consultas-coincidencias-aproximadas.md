---
layout: post
title: "Combinar consultas con coincidencias aproximadas"
date: 2018-11-19
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

Dentro de las transformaciones para la preparaci�n de los datos en Power Query est� Combinar datos. Es una transformaci�n muy �til cuando queremos integrar datos que provienen de distintos or�genes. En la actualizaci�n de Power BI Desktop de octubre de 2018 se adicion� la opci�n de combinar consultas con coincidencias aproximadas (fuzzy matching). En esta entrada explicaremos un caso de uso donde se ha utilizado esta nueva opci�n.

<!--more-->

## Or�genes de datos del ejemplo

Durante la construcci�n del modelo del ["El meu Barri"](http://www.dataxbi.com/elmeubarri) combinamos varios or�genes de datos:

- Los barrios y distritos de Barcelona ([http://opendata-ajuntament.barcelona.cat/data/es/dataset/20170706-districtes-barris](http://opendata-ajuntament.barcelona.cat/data/es/dataset/20170706-districtes-barris) )
- Los puntos cr�ticos de limpieza por calles ([http://opendata-ajuntament.barcelona.cat/data/es/dataset/punts-critics-neteja-barcelona](http://opendata-ajuntament.barcelona.cat/data/es/dataset/punts-critics-neteja-barcelona) )
- El paro por barrios

## Modelo de datos

Decidimos crear un modelo que constara de dos tablas Locaton y Services. La tabla Location con la informaci�n de los barrios y distritos y la tabla Services con la informaci�n del paro y los puntos cr�ticos de limpieza. A la tabla Services podremos a�adirle nuevos servicios del cat�logo de datos [Open Data BCN.](http://opendata-ajuntament.barcelona.cat/data/en/dataset)

![Tabla Location](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen1.png)

Imagen1. Tabla Location

El elemento com�n por el que podemos enlazar las dos tablas en el modelo es el barrio. Necesitaremos a�adir una columna a la tabla Services con el c�digo del barrio para poderla enlazar con la tabla Location. En el caso del paro por barrio, la consulta ya cuenta con esa columna.

![Tabla Services](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen2.png)

Imagen2. Tabla Services

Como podemos observar en Imagen2,  la consulta de los puntos cr�ticos de limpieza tiene una columna con el nombre del barrio, pero no con el c�digo.

## Transformaci�n Combinar consultas

Teniendo en cuenta que la tabla Location tiene una columna con el nombre del barrio y otra con el c�digo, decidimos combinar la soluci�n que se nos ocurri� fue usar la transformaci�n Combinar consultas, de la pesta�a Inicio del Editor de consultas de Power Query:

![Opci�n Combinar consultas de la pesta�a Inicio](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen3-300x26.png)

Imagen3. Opci�n Combinar consultas de la pesta�a Inicio

Esta transformaci�n nos permite combinar dos consultas que tienen como m�nimo un campo en com�n. Cuando combinamos dos consultas podemos crear una nueva consulta o a�adir campos a la consulta seleccionada cuando usamos esta transformaci�n.

Seleccionamos la consulta con los puntos cr�ticos de limpieza y la transformaci�n Combinar consultas para a�adirle el campo LocationId a esta consulta. Se muestra la ventana Combinar con la consulta puntos cr�ticos seleccionada. Debemos escoger entonces los campos por los que realizaremos la transformaci�n, en este caso el campo Location. En la lista desplegable debemos seleccionar la tabla con la que vamos hacer la combinaci�n, en este caso Location.

A continuaci�n debemos seleccionar los campos de esta consulta que se correspondan con los seleccionados en la consulta anterior. En el ejemplo el campo Location, el campo tiene el mismo nombre en ambas tablas pero esto no es obligatorio, podr�an llamarse de forma diferente en cada consulta pero siempre que el tipo de dato coincida se pueden combinar.

Esta transformaci�n permite combinar dos consultas siempre que tengan al menos una columna en com�n. Si seleccionamos m�s de un campo estos deben coincidir en numero (la misma cantidad de columnas en ambas consultas), en orden (los campos que macheen se deben seleccionar en el mismo orden) y en tipo (los campos que macheen deben ser del mismo tipo) pero no tiene que coincidir en nombre.

![Transformaci�n Combinar consultas](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen4-300x280.png)

Imagen4. Transformaci�n Combinar consultas

Como podemos observar en Imagen3 la coincidencia no es total. Hay 109 filas de la tabla Services que no encuentran valor en la tabla Location. Vamos a oprimir el bot�n Aceptar y expandir la columna que se a�ade para ver que filas no contienen valor.

![Expandiendo la columna LocationId](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen5-157x300.png)

Imagen5. Expandiendo la columna LocationId

Vamos a filtrar los valores null de la columna LocationId a�adida:

![Filtrando la columna LocationId](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen6.png)

Imagen6. Filtrando la columna LocationId

Podemos ver que como resultado que la consulta contiene 109 filas donde la columna LocationId no contiene valor.

![Filas con valor null en la columna LocationId](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen7-300x45.png)

IImagen7. Filas con valor null en la columna LocationId

Uno de los barrios que no encuentra es La Salut pero si comprobamos en la consulta Location vemos que si existe pero no est� escrito de la misma forma, sino como la Salut.

![Columna Location de la consulta Location](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen8-300x177.png)

Imagen8. Columna Location de la consulta Location

El que no lo haya reconocido se debe a que el lenguaje M, que es el que est� por debajo de esta consulta es sensitivo a may�sculas y min�sculas, es decir que diferencia may�sculas y min�sculas.

Pues bien, una forma de resolver esta inconsistencia hasta el mes de octubre era transformar el contenido de las columnas que se iban a relacionar en may�sculas o min�sculas y luego realizar la combinaci�n, de esta manera no habr�a diferencia y las podr�a relacionar.

En la [actualizaci�n de Power BI Desktop del pasado mes de octubre](https://powerbi.microsoft.com/en-us/blog/power-bi-desktop-october-2018-feature-summary/#fuzzyMatching), entre las funcionalidades que se a�adieron estaban las opciones de coincidencia aproximada para consultas de combinaci�n. Estas opciones todav�a est�n en vista previa pero ya prometen mucho.

  

### Opciones de coincidencia aproximada (fuzzy matching) para consultas combinadas

Cuando marcamos la opci�n Usar coincidencias aproximadas para comparar la aproximaci�n, una de las opciones que se habilitan es Ignorar may�sculas y min�sculas que podemos utilizar si volvemos al paso combinar consultas y marcamos esta opci�n.

![Usar coincidencias aproximadas para comparar la combinaci�n](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen9-252x300.png)

Imagen9. Usar coincidencias aproximadas para comparar la combinaci�n

En la imagen 9 podemos ver que tambi�n se habilita la opci�n Ignorar espacios. Esta opci�n la podemos necesitar en aquellos casos donde se han dejado espacios vac�os al inicio o al final del texto o m�s de un espacio entre palabras.

Si volvemos al paso final vemos que solo quedan 24 filas con valor null en el campo LocationId.

![Filas resultantes con la columna LocationId vac�a](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen10-300x147.png)

IImagen10. Filas resultantes con la columna LocationId vac�a

Si observamos la columna Location en la imagen 10 vemos que en todos los casos aparece el mismo barrio, pero escrito de diferentes formas La Bonanova o Bonanova.

Si buscamos en la tabla Location, en la columna Location la palabra Bonanova vemos que el barrio se llama Sant Gervasi – la Bonanova por lo que tenemos un problema. Ocurre una inconsistencia de los datos, los datos existen pero no est�n escritos siempre de la misma forma. Este es un error que es muy com�n cuando se introducen datos manualmente y que podemos encontrarnos frecuentemente.

![Nombre del barrio en la tabla Location](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen11-300x182.png)

Imagen11. Nombre del barrio en la tabla Location

Para resolver estos casos pudi�ramos auxiliarnos de una tabla de transformaci�n, otra de las opciones cuando usamos combinaci�n aproximada para comparar consultas. Podemos ver todas las opciones en Imagen8.

### Tabla de transformaciones

Esta opci�n nos permite utilizar una tabla de mapeo para asignar autom�ticamente un valor en el caso de inconsistencia de los datos. La tabla debe contener dos columnas una con nombre From, con los valores inconsistentes y otra To con los valores que se utilizar�n para reemplazarlos.

Para ello en la tabla Services seleccionaremos la columna Location y copiaremos los valores en una nueva consulta:

![Crear consulta con los valores de la columna Location de la tabla Service](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen16-300x239.png)

Imagen12. Copiar los valores de la columna Location de la tabla Services y a�adirlos en una una nueva consulta

Nombraremos a la consulta Location Correction. La �nica columna de la tabla contendr� valores duplicados que eliminaremos haciendo uso de la transformaci�n Quitar duplicados y cambiaremos el nombre de la columna a From.

Le a�adiremos otra columna de nombre To, donde escribiremos los valores que aparecen en la consulta Location. Para ello podemos usar la opci�n reemplazar valores o crear una columna condicional que es el que hemos usado en este caso:

![](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen13-300x137.png)

Imagen13. Columna To de la tabla Location Corrections

La tabla  de transformaci�n nos queda como se muestra en la siguiente imagen

![Tabla Location Corrections](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen14-300x57.png)

Imagen14. Tabla Location Corrections

Y ahora volvemos al paso Combinar consultas de la consulta Services y en la lista desplegable, Tabla de transformaci�n, la seleccionamos:

![A�adir tabla de transformaciones al combinar consultas](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen15-252x300.png)

Imagen15. A�adir tabla de transformaciones al combinar consultas

Si volvemos al paso final vemos que no quedan filas con error y ahora podemos eliminar el �ltimo paso, comprobaremos que todas las filas tienen un campo LocationId asociado. Eliminaremos el Campo Location de la tabla porque contiene errores y no nos hace falta tenerlo en el modelo.

## Conclusiones

La transformaci�n Combinar consulta permite unir columnas de dos consultas en una de ellas o en una nueva consulta, siempre que tengan al menos una columna en com�n.

Podemos necesitar varios campos para realizar la combinaci�n. Estos deben coincidir en n�mero (la misma cantidad de columnas en ambas consultas), en orden (los campos que se quieran enlazar se deben seleccionar en el mismo orden en ambas consultas) y en tipo (los campos que se necesiten enlazar deben ser del mismo tipo en ambas consultas). Lo que no es necesario es que coincidan los nombres de las columnas que se van a enlazar en ambas consultas. Si quieres conocer el resto de opciones de esta transformaci�n, como escoger el tipo de combinaci�n, te invitamos a inscribirte en [Curso del lenguaje de consultas M](www.dataxbi.com/formacion/curso-lenguaje-consultas-m/) donde aprender�s est� y otras transformaciones esenciales para la preparaci�n de los datos.

El modelo de datos de este ejemplo lo puedes descargar de [GitHub](https://github.com/dataxbi/power-query), espero que te sirva de ayuda.
