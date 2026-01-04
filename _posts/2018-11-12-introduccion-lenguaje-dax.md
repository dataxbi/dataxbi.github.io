---
layout: post
title: "Introducción al lenguaje DAX"
date: 2018-11-12
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "dax"
---

DAX (Data Analysis Expressions) es un lenguaje específico para análisis de datos creado por Microsoft en el año 2010 para ser usado con un modelo de datos tabular y que se puede usar en Excel, Analysis Services y Power BI.

<!--more-->

## Modelo de Datos Tabular

Un modelo de datos tabular no es más que un conjunto de tablas formadas por filas divididas en columnas y relacionadas entre sí.

Cada tabla está dividida en columnas con un nombre y algunas de ellas puedenÂ  contener expresiones escritas en DAX, por ejemplo, para hacer un cálculo usando valores de otras columnas. Cuando los datos se importan en el modelo, se crean filas en cada tabla.

Una relación enlaza dos tablas usando una columna de cada tabla. Las expresiones DAX utilizan las relaciones definidas en el modelo para, por ejemplo, saber como filtrar los datos.

## Tipos de datos

DAX define varios tipos de datos y una columna sólo puede contener datos de un mismo tipo.

Los principales tipos de datos son

- Número entero
- Número decimal
- Cadena de texto
- Fecha
- Moneda
- Boolean

## Columnas calculadas

Las columnas calculadas son un tipo especial de columna que contienen una expresión DAX que generalmente usa datos de otras columnas para devolver un resultado, por ejemplo, una columna PrecioTotal que utilice las columnas PrecioUnidad y Cantidad.

Este cálculo se realiza cuando se importan los datos al modelo y el resultado se almacena en cada fila del modelo.

## Medidas

Las medidas son otro tipo de columna especial que también contienen una expresión DAX, pero el cálculo sólo se realiza cuando la columna es utilizada en un reporte, y no se almacena en el modelo. Generalmente agregan datos de varias filas de la tabla.

Las medidas son globales, aunque se definan para una tabla, por lo que los nombres tienen que ser únicos en todo el modelo.

## Relaciones

Para definir una relación entre dos tablas, una de ellas tiene que tener una columna con valores que no se repitan y que sería la columna llave de la tabla y la otra debe tener una columna del mismo tipo y conteniendo los mismos valores pero que pueden estar repetidos. Esto es lo que se llama una relación de uno a muchos, porque por cada fila de una tabla pueden existir mucha filas de la tabla relacionada.

La relación puede ser en una sola dirección, siempre desde el lado uno hacia el mucho. O puede ser en ambas direcciones. Las expresiones DAX tienen en cuanta la dirección de la relación cuando aplican filtros.

## Funciones

DAX es un lenguaje que utiliza funciones a las que se les pasa parámetros y que devuelven un valor de un tipo determinado.Â  Los parámetros pueden ser a su vez llamadas a otras funciones.

El tipo de datos Tabla, que no habíamos mencionado antes, puede usarse en las funciones como resultado o como parámetro, pero no puede usarse en las columnas.

Las funciones se pudieran agrupar de la siguiente manera.

- Fecha y hora
- Inteligencia de tiempo
- Filtros
- Información
- Lógicas
- Matemáticas
- Estadísticas
- Textos

A continuación describimos brevemente algunasÂ  funciones DAX.

```
SUM(columna)
```

Es una función de agregación que suma todos los valores de una columna en una tabla. Hay otras funciones de agregación: AVERAGE, MIN, MAX, STDEV, VAR.

```
SUMX(tabla, expresión)
```

Itera sobre cada fila de una tabla, calculando la expresión y sumando el resultado.

```
COUNT(columna)
```

Cuenta el número de elementos en una columna que contienen números.

```
COUNTROWS(tabla)
```

Cuenta el número de filas de una tabla.

```
FILTER(tabla, condición)
```

Devuelve una tabla con las filas de la tabla original que cumplan con la condición expresada en el segundo parámetro.

```
DATESYTD(columna)
```

Devuelve una tabla con los del año en curso hasta la fecha actual, presentes en la columna pasada como parámetro. La columna tiene que ser de tipo Fecha.

## Expresiones

Para crear las columnas calculadas y las medidas usamos expresiones DAX, que pueden contener operadores y llamadas a funciones.

Para referirse a una columna se utiliza el nombre de la tabla seguido del nombre de la columna entre corchetes, por ejemplo, Producto\[Precio\].

A continuación mostramos algunos ejemplos de expresiones.

```
Producto[Sub Total] = Producto[Precio Unidad] * Producto[Cantidad Unidades]
```

Esta expresión crea una columna calculada a partir de otras dos columnas de la misma tabla.

```
Producto[Precio Total] := SUM(Producto[Sub Total])
```

Esta expresión crea una medida que calcula el precio total para los productos seleccionados. En ella hemos usado la función SUM y la columna calculada del ejemplo anterior.

```
Producto[Precio Total] := SUMX(
                             Producto, 
                             Producto[Precio Unidad] * Producto[Cantidad Unidades]
                          )
```

Esta expresión crea la misma medida del ejemplo anterior, pero utilizando la función SUMX y sin utilizar la columna calculada Producto\[Sub Total\].

```
Producto[Precio Total Verdes] := SUMX(
                                    FILTER(
                                        Producto,
                                        Producto[Color] = "Verde"
                                    ),
                                    Producto[Precio Unidad] * Producto[Cantidad Unidades]
                                 )
```

Esta expresión crea una medida que calcula el precio total para los productos de color verde. Hemos usado la función FILTER como primer parámetro de la función SUMX.

## Conclusión

Esto ha sido una muy breve introducción al lenguaje DAX para destacar que fue concebido para trabajar con un modelo tabular y que es un lenguaje funcional.
