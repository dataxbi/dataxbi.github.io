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

Dentro de las transformaciones para la preparación de los datos en Power Query está Combinar datos. Es una transformación muy útil cuando queremos integrar datos que provienen de distintos orígenes. En la actualización de Power BI Desktop de octubre de 2018 se adicionó la opción de combinar consultas con coincidencias aproximadas (fuzzy matching). En esta entrada explicaremos un caso de uso donde se ha utilizado esta nueva opción.

<!--more-->

## Orígenes de datos del ejemplo

Durante la construcción del modelo del ["El meu Barri"](http://www.dataxbi.com/elmeubarri) combinamos varios orígenes de datos:

- Los barrios y distritos de Barcelona ([http://opendata-ajuntament.barcelona.cat/data/es/dataset/20170706-districtes-barris](http://opendata-ajuntament.barcelona.cat/data/es/dataset/20170706-districtes-barris) )
- Los puntos críticos de limpieza por calles ([http://opendata-ajuntament.barcelona.cat/data/es/dataset/punts-critics-neteja-barcelona](http://opendata-ajuntament.barcelona.cat/data/es/dataset/punts-critics-neteja-barcelona) )
- El paro por barrios

## Modelo de datos

Decidimos crear un modelo que constara de dos tablas Locaton y Services. La tabla Location con la información de los barrios y distritos y la tabla Services con la información del paro y los puntos críticos de limpieza. A la tabla Services podremos añadirle nuevos servicios del catálogo de datos [Open Data BCN.](http://opendata-ajuntament.barcelona.cat/data/en/dataset)

![Tabla Location](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen1.png)

Imagen1. Tabla Location

El elemento común por el que podemos enlazar las dos tablas en el modelo es el barrio. Necesitaremos añadir una columna a la tabla Services con el código del barrio para poderla enlazar con la tabla Location. En el caso del paro por barrio, la consulta ya cuenta con esa columna.

![Tabla Services](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen2.png)

Imagen2. Tabla Services

Como podemos observar en Imagen2, Â la consulta de los puntos críticos de limpieza tiene una columna con el nombre del barrio, pero no con el código.

## Transformación Combinar consultas

Teniendo en cuenta que la tabla Location tiene una columna con el nombre del barrio y otra con el código, decidimos combinar la solución que se nos ocurrió fue usar la transformación Combinar consultas, de la pestaña Inicio del Editor de consultas de Power Query:

![Opción Combinar consultas de la pestaña Inicio](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen3-300x26.png)

Imagen3. Opción Combinar consultas de la pestaña Inicio

Esta transformación nos permite combinar dos consultas que tienen como mínimo un campo en común. Cuando combinamos dos consultas podemos crear una nueva consulta o añadir campos a la consulta seleccionada cuando usamos esta transformación.

Seleccionamos la consulta con los puntos críticos de limpieza y la transformación Combinar consultas para añadirle el campo LocationId a esta consulta. Se muestra la ventana Combinar con la consulta puntos críticos seleccionada. Debemos escoger entonces los campos por los que realizaremos la transformación, en este caso el campo Location. En la lista desplegable debemos seleccionar la tabla con la que vamos hacer la combinación, en este caso Location.

A continuación debemos seleccionar los campos de esta consulta que se correspondan con los seleccionados en la consulta anterior. En el ejemplo el campo Location, el campo tiene el mismo nombre en ambas tablas pero esto no es obligatorio, podrían llamarse de forma diferente en cada consulta pero siempre que el tipo de dato coincida se pueden combinar.

Esta transformación permite combinar dos consultas siempre que tengan al menos una columna en común. Si seleccionamos más de un campo estos deben coincidir en numero (la misma cantidad de columnas en ambas consultas), en orden (los campos que macheen se deben seleccionar en el mismo orden) y en tipo (los campos que macheen deben ser del mismo tipo) pero no tiene que coincidir en nombre.

![Transformación Combinar consultas](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen4-300x280.png)

Imagen4. Transformación Combinar consultas

Como podemos observar en Imagen3 la coincidencia no es total. Hay 109 filas de la tabla Services que no encuentran valor en la tabla Location. Vamos a oprimir el botón Aceptar y expandir la columna que se añade para ver que filas no contienen valor.

![Expandiendo la columna LocationId](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen5-157x300.png)

Imagen5. Expandiendo la columna LocationId

Vamos a filtrar los valores null de la columna LocationId añadida:

![Filtrando la columna LocationId](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen6.png)

Imagen6. Filtrando la columna LocationId

Podemos ver que como resultado que la consulta contiene 109 filas donde la columna LocationId no contiene valor.

![Filas con valor null en la columna LocationId](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen7-300x45.png)

IImagen7. Filas con valor null en la columna LocationId

Uno de los barrios que no encuentra es La Salut pero si comprobamos en la consulta Location vemos que si existe pero no está escrito de la misma forma, sino como la Salut.

![Columna Location de la consulta Location](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen8-300x177.png)

Imagen8. Columna Location de la consulta Location

El que no lo haya reconocido se debe a que el lenguaje M, que es el que está por debajo de esta consulta es sensitivo a mayúsculas y minúsculas, es decir que diferencia mayúsculas y minúsculas.

Pues bien, una forma de resolver esta inconsistencia hasta el mes de octubre era transformar el contenido de las columnas que se iban a relacionar en mayúsculas o minúsculas y luego realizar la combinación, de esta manera no habría diferencia y las podría relacionar.

En la [actualización de Power BI Desktop del pasado mes de octubre](https://powerbi.microsoft.com/en-us/blog/power-bi-desktop-october-2018-feature-summary/#fuzzyMatching), entre las funcionalidades que se añadieron estaban las opciones de coincidencia aproximada para consultas de combinación. Estas opciones todavía están en vista previa pero ya prometen mucho.

  

### Opciones de coincidencia aproximada (fuzzy matching) para consultas combinadas

Cuando marcamos la opción Usar coincidencias aproximadas para comparar la aproximación, una de las opciones que se habilitan es Ignorar mayúsculas y minúsculas que podemos utilizar si volvemos al paso combinar consultas y marcamos esta opción.

![Usar coincidencias aproximadas para comparar la combinación](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen9-252x300.png)

Imagen9. Usar coincidencias aproximadas para comparar la combinación

En la imagen 9 podemos ver que también se habilita la opción Ignorar espacios. Esta opción la podemos necesitar en aquellos casos donde se han dejado espacios vacíos al inicio o al final del texto o más de un espacio entre palabras.

Si volvemos al paso final vemos que solo quedan 24 filas con valor null en el campo LocationId.

![Filas resultantes con la columna LocationId vacía](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen10-300x147.png)

IImagen10. Filas resultantes con la columna LocationId vacía

Si observamos la columna Location en la imagen 10 vemos que en todos los casos aparece el mismo barrio, pero escrito de diferentes formas La Bonanova o Bonanova.

Si buscamos en la tabla Location, en la columna Location la palabra Bonanova vemos que el barrio se llama Sant Gervasi â€“ la Bonanova por lo que tenemos un problema. Ocurre una inconsistencia de los datos, los datos existen pero no están escritos siempre de la misma forma. Este es un error que es muy común cuando se introducen datos manualmente y que podemos encontrarnos frecuentemente.

![Nombre del barrio en la tabla Location](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen11-300x182.png)

Imagen11. Nombre del barrio en la tabla Location

Para resolver estos casos pudiéramos auxiliarnos de una tabla de transformación, otra de las opciones cuando usamos combinación aproximada para comparar consultas. Podemos ver todas las opciones en Imagen8.

### Tabla de transformaciones

Esta opción nos permite utilizar una tabla de mapeo para asignar automáticamente un valor en el caso de inconsistencia de los datos. La tabla debe contener dos columnas una con nombre From, con los valores inconsistentes y otra To con los valores que se utilizarán para reemplazarlos.

Para ello en la tabla Services seleccionaremos la columna Location y copiaremos los valores en una nueva consulta:

![Crear consulta con los valores de la columna Location de la tabla Service](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen16-300x239.png)

Imagen12. Copiar los valores de la columna Location de la tabla Services y añadirlos en una una nueva consulta

Nombraremos a la consulta Location Correction. La única columna de la tabla contendrá valores duplicados que eliminaremos haciendo uso de la transformación Quitar duplicados y cambiaremos el nombre de la columna a From.

Le añadiremos otra columna de nombre To, donde escribiremos los valores que aparecen en la consulta Location. Para ello podemos usar la opción reemplazar valores o crear una columna condicional que es el que hemos usado en este caso:

![](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen13-300x137.png)

Imagen13. Columna To de la tabla Location Corrections

La tablaÂ  de transformación nos queda como se muestra en la siguiente imagen

![Tabla Location Corrections](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen14-300x57.png)

Imagen14. Tabla Location Corrections

Y ahora volvemos al paso Combinar consultas de la consulta Services y en la lista desplegable, Tabla de transformación, la seleccionamos:

![Añadir tabla de transformaciones al combinar consultas](/assets/images/posts/2018-11-19-combinar-consultas-coincidencias-aproximadas/Imagen15-252x300.png)

Imagen15. Añadir tabla de transformaciones al combinar consultas

Si volvemos al paso final vemos que no quedan filas con error y ahora podemos eliminar el último paso, comprobaremos que todas las filas tienen un campo LocationId asociado. Eliminaremos el Campo Location de la tabla porque contiene errores y no nos hace falta tenerlo en el modelo.

## Conclusiones

La transformación Combinar consulta permite unir columnas de dos consultas en una de ellas o en una nueva consulta, siempre que tengan al menos una columna en común.

Podemos necesitar varios campos para realizar la combinación. Estos deben coincidir en número (la misma cantidad de columnas en ambas consultas), en orden (los campos que se quieran enlazar se deben seleccionar en el mismo orden en ambas consultas) y en tipo (los campos que se necesiten enlazar deben ser del mismo tipo en ambas consultas). Lo que no es necesario es que coincidan los nombres de las columnas que se van a enlazar en ambas consultas. Si quieres conocer el resto de opciones de esta transformación, como escoger el tipo de combinación, te invitamos a inscribirte en [Curso del lenguaje de consultas M](www.dataxbi.com/formacion/curso-lenguaje-consultas-m/) donde aprenderás está y otras transformaciones esenciales para la preparación de los datos.

El modelo de datos de este ejemplo lo puedes descargar de [GitHub](https://github.com/dataxbi/power-query), espero que te sirva de ayuda.
