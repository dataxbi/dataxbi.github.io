---
layout: post
title: "Introducci�n al lenguaje DAX"
date: 2018-11-12
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "dax"
---

DAX (Data Analysis Expressions) es un lenguaje espec�fico para an�lisis de datos creado por Microsoft en el a�o 2010 para ser usado con un modelo de datos tabular y que se puede usar en Excel, Analysis Services y Power BI.

<!--more-->

## Modelo de Datos Tabular

Un modelo de datos tabular no es m�s que un conjunto de tablas formadas por filas divididas en columnas y relacionadas entre s�.

Cada tabla est� dividida en columnas con un nombre y algunas de ellas pueden  contener expresiones escritas en DAX, por ejemplo, para hacer un c�lculo usando valores de otras columnas. Cuando los datos se importan en el modelo, se crean filas en cada tabla.

Una relaci�n enlaza dos tablas usando una columna de cada tabla. Las expresiones DAX utilizan las relaciones definidas en el modelo para, por ejemplo, saber como filtrar los datos.

## Tipos de datos

DAX define varios tipos de datos y una columna s�lo puede contener datos de un mismo tipo.

Los principales tipos de datos son

- N�mero entero
- N�mero decimal
- Cadena de texto
- Fecha
- Moneda
- Boolean

## Columnas calculadas

Las columnas calculadas son un tipo especial de columna que contienen una expresi�n DAX que generalmente usa datos de otras columnas para devolver un resultado, por ejemplo, una columna PrecioTotal que utilice las columnas PrecioUnidad y Cantidad.

Este c�lculo se realiza cuando se importan los datos al modelo y el resultado se almacena en cada fila del modelo.

## Medidas

Las medidas son otro tipo de columna especial que tambi�n contienen una expresi�n DAX, pero el c�lculo s�lo se realiza cuando la columna es utilizada en un reporte, y no se almacena en el modelo. Generalmente agregan datos de varias filas de la tabla.

Las medidas son globales, aunque se definan para una tabla, por lo que los nombres tienen que ser �nicos en todo el modelo.

## Relaciones

Para definir una relaci�n entre dos tablas, una de ellas tiene que tener una columna con valores que no se repitan y que ser�a la columna llave de la tabla y la otra debe tener una columna del mismo tipo y conteniendo los mismos valores pero que pueden estar repetidos. Esto es lo que se llama una relaci�n de uno a muchos, porque por cada fila de una tabla pueden existir mucha filas de la tabla relacionada.

La relaci�n puede ser en una sola direcci�n, siempre desde el lado uno hacia el mucho. O puede ser en ambas direcciones. Las expresiones DAX tienen en cuanta la direcci�n de la relaci�n cuando aplican filtros.

## Funciones

DAX es un lenguaje que utiliza funciones a las que se les pasa par�metros y que devuelven un valor de un tipo determinado.  Los par�metros pueden ser a su vez llamadas a otras funciones.

El tipo de datos Tabla, que no hab�amos mencionado antes, puede usarse en las funciones como resultado o como par�metro, pero no puede usarse en las columnas.

Las funciones se pudieran agrupar de la siguiente manera.

- Fecha y hora
- Inteligencia de tiempo
- Filtros
- Informaci�n
- L�gicas
- Matem�ticas
- Estad�sticas
- Textos

A continuaci�n describimos brevemente algunas  funciones DAX.

```
SUM(columna)
```

Es una funci�n de agregaci�n que suma todos los valores de una columna en una tabla. Hay otras funciones de agregaci�n: AVERAGE, MIN, MAX, STDEV, VAR.

```
SUMX(tabla, expresi�n)
```

Itera sobre cada fila de una tabla, calculando la expresi�n y sumando el resultado.

```
COUNT(columna)
```

Cuenta el n�mero de elementos en una columna que contienen n�meros.

```
COUNTROWS(tabla)
```

Cuenta el n�mero de filas de una tabla.

```
FILTER(tabla, condici�n)
```

Devuelve una tabla con las filas de la tabla original que cumplan con la condici�n expresada en el segundo par�metro.

```
DATESYTD(columna)
```

Devuelve una tabla con los del a�o en curso hasta la fecha actual, presentes en la columna pasada como par�metro. La columna tiene que ser de tipo Fecha.

## Expresiones

Para crear las columnas calculadas y las medidas usamos expresiones DAX, que pueden contener operadores y llamadas a funciones.

Para referirse a una columna se utiliza el nombre de la tabla seguido del nombre de la columna entre corchetes, por ejemplo, Producto\[Precio\].

A continuaci�n mostramos algunos ejemplos de expresiones.

```
Producto[Sub Total] = Producto[Precio Unidad] * Producto[Cantidad Unidades]
```

Esta expresi�n crea una columna calculada a partir de otras dos columnas de la misma tabla.

```
Producto[Precio Total] := SUM(Producto[Sub Total])
```

Esta expresi�n crea una medida que calcula el precio total para los productos seleccionados. En ella hemos usado la funci�n SUM y la columna calculada del ejemplo anterior.

```
Producto[Precio Total] := SUMX(
                             Producto, 
                             Producto[Precio Unidad] * Producto[Cantidad Unidades]
                          )
```

Esta expresi�n crea la misma medida del ejemplo anterior, pero utilizando la funci�n SUMX y sin utilizar la columna calculada Producto\[Sub Total\].

```
Producto[Precio Total Verdes] := SUMX(
                                    FILTER(
                                        Producto,
                                        Producto[Color] = "Verde"
                                    ),
                                    Producto[Precio Unidad] * Producto[Cantidad Unidades]
                                 )
```

Esta expresi�n crea una medida que calcula el precio total para los productos de color verde. Hemos usado la funci�n FILTER como primer par�metro de la funci�n SUMX.

## Conclusi�n

Esto ha sido una muy breve introducci�n al lenguaje DAX para destacar que fue concebido para trabajar con un modelo tabular y que es un lenguaje funcional.
