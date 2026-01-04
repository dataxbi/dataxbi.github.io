---
layout: post
title: "Funciones DAX SUM y SUMX"
date: 2018-11-30
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dax"
---

Las funciones DAX SUM y SUMX calculan la suma de valores numéricos y cuando pensamos en crear una medida de este tipo pueden surgir dudas entre cuál de las dos utilizar. En esta entrada de blog las compararemos desde varios puntos de vista como la descripción, la sintaxis, la forma en que operan y los resultados que devuelven, además de mostrar algunos ejemplos de su uso. Esperamos que cuando tengas necesidad de realizar este cálculo te resulte más sencilla la elección.

<!--more-->

## Modelo de datos

Empezaremos por crear un proyecto en Power BI Desktop donde nos conectaremos a la base de datos [AdventureWorks](https://github.com/Microsoft/sql-server-samples/releases/tag/adventureworks "Base de datos de ejemplo AdventureWorks") de Microsoft. Seleccionaremos las tablas DimProduct y FactResellerSales y crearemos un [modelo de datos](https://www.dataxbi.com/blog/2018/11/13/introduccion-lenguaje-dax/) con ellas.

A la tabla DimProduct la llamaremos Product y seleccionaremos las columnas ProductKey, ProductAlternateKey, ProductSubcategoryKey, SpanishProductName, StandardCost, Color, ModelName y Status.

![Funciones DAX SUM y SUMX-Vista de la tabla Product](/assets/images/posts/2018-11-30-funciones-dax-sum-sumx/DAX-Vista-de-la-tabla-Product.png)  

Imagen 1. Vista de la tabla Product

A la tabla FactResellerSales la nombraremos Sales y elegiremos las columnas ProductKey, SalesOrderNumber, SalesOrederLineNumber, OrderQuantity, UnitPrice, DiscountAmount, TaxtAmt, OrderDate, DueDate y ShipDate.

![Funciones DAX SUM y SUMX Vista de a tabla Sales de AdventureWorks](/assets/images/posts/2018-11-30-funciones-dax-sum-sumx/DAX-Vista-de-la-tabla-Sales.png)

Imagen 2. Vista de la tabla Sales

Cargaremos las tablas en el modelo y las relacionaremos.

![Funciones DAX SUM y SUMX-Vista de relaciones](/assets/images/posts/2018-11-30-funciones-dax-sum-sumx/DAX-Vista-de-relaciones.png)

Imagen 3. Vista de relaciones

Finalmente usaremos las funciones SUM() y SUMX() para crear distintas medidas donde se calculen:

1. La cantidad total de unidades vendidas
2. El importe total de las ventas
3. Cantidad de productos de color rojo vendidos

Antes de comenzar a crear las métricas veamos en detalle las dos funciones.

## Funciones DAX SUM y SUMX

### Comparación:

#### Descripción

| SUM() | SUMX() |
| --- | --- |
|   Agrega todos los números en una columna   |   Devuelve la suma de una expresión evaluada por cada fila de una tabla   |
|   Ambas funciones suman valores numéricos   |  |

#### Sintaxis

| SUM() | SUMX() |
| --- | --- |
|   ``` SUM(<columna>) ```  El parámetro <columna> es la columna que contiene los números a sumar. La función acepta valores numéricos o de fecha y devuelve como resultado un valor decimal. Las filas pueden contener valores en blanco. Los valores de la columna no se pueden filtrar.   |   ``` SUMX(<tabla>, <expresión>) ```  El parámetro <tabla> es la tabla que contiene los valores para los cuales se evaluará la expresión. Puede ser el nombre de una tabla o una expresión que devuelve una tabla.  El parámetro < expresión > es una columna que contiene los números que desea sumar o una expresión que se evalúa como una columna.  Solo se tienen en cuenta los números de la columna. Se omiten los espacios en blanco, los valores lógicos y el texto.   |
|   Admite un solo parámetro que debe ser el nombre de una columna por lo que los valores no se pueden filtrar   |   Admite dos parámetros y ambos pueden ser expresiones por tanto la tabla y los valores se pueden filtrar   |

#### Â¿Cómo realiza el cálculo?

| SUM() | SUMX() |
| --- | --- |
|   Opera solamente sobre la columna que se le pasa como parámetro   |   Opera sobre todas las columnas de la tabla que se le pasa como primer parámetro   |
|   Sumará directamente los valores de la columna   |   Recorrerá cada fila de la tabla evaluando una expresión y realizará la suma de los valores   |

#### Resultado

| SUM() | SUMX() |
| --- | --- |
|   Ambas funciones devuelven el mismo resultado, un número decimal.   |  |

  

## Medidas

Veamos ahora como crear las medidas para realizar los cálculos indicados con las dos funciones.

### Calcular la cantidad total de unidades vendidas

Como se puede apreciar en la imagen 2, la tabla Sales contiene la columna OrderQuantity que almacena el número de unidades vendidas de cada producto en cada orden.

Si queremos calcular el total de unidades vendidas, debemos sumar los valores de la columna OrderQuantity. En este caso la función SUM() sería la elegida sin pensarlo mucho pues es justo lo que hace la función SUM(). La fórmula se vería así:

```
Unidades vendidas = SUM(Sales[OrderQuantity])
```

Sin embargo podríamos utilizar la función SUMX() para realizar el cálculo y el resultado sería el mismo. Como segundo parámetro pasamos la columna en lugar de una expresión. La fórmula sería:

```
Unidades vendidas 2 = SUMX (Sales; Sales[OrderQuantity])
```

Por el contrario de lo que puedas pensar las dos funciones son idénticas en rendimiento y eficiencia. Podemos usar cualquiera de las dos.

### Calcular el importe total de las ventas

Si revisas la lista de campos de la tabla Sales verás que no contiene una columna con el importe de cada línea. Este importe podemos calcularlo si multiplicamos los valores de las columnas OrderQuantity y UnitPrice fila a fila y sumamos los resultados.

Dos formas de realizar el mismo calculo serían:

- Crear una columna calculada que calcule el producto de las dos columnas fila a fila y luego crear una medida que sume de los valores de la columna calculada.

Fórmula de la columna calculada:

```
Ventas línea = Sales[OrderQuantity] * Sales[UnitPrice]
```

Fórmula de la medida:

```
Total Sales = SUM([Ventas línea])
```

- La segunda solución es usar la función SUMX para crear directamente la medida sin necesidad de crear una columna calculada primero. La fórmula sería:

```
Total Sales 1 = SUMX(Sales;Sales[OrderQuantity] * Sales[UnitPrice])
```

Las dos medidas devuelven el mismo resultado. Con la primera solución almacenaríamos en el modelo permanentemente los resultados de multiplicar ambas columnas fila por fila, mientras que en la segunda solución no. La segunda solución es la más eficiente, es decir, elegiremos SUMX().

### Calcular la cantidad de productos de color rojo vendidos

Para realizar este cálculo debemos tener en cuenta que a la función SUM() no se le puede pasar una expresión como parámetro, solo admite nombres de columnas. Esto implica que no se pueden filtrar las filas de la tabla sobre la que queremos realizar el cálculo y para lograrlo necesitamos combinarla con la función CALCULATE(). La fórmula se vería:

```
Quantity_Red_Color = CALCULATE(SUM(Sales[OrderQuantity]), Product[Color] = "Red")
```

Si usamos la función SUMX() para realizar el cálculo tenemos varias variantes:

#### Primera variante: Combinando las funciones SUMX() y FILTER()

La función SUMX admite como primer parámetro una expresión que devuelva una tabla y la función Filter lo hace. Esto nos permite filtrar la tabla Sales de manera que solo devuelva las filas donde el color del producto es rojo y luego sumamos los valores de la columna OrderQuantity. La columna Color está en la tabla Product y por ello necesitamos usar la función RELATED() para conocer el color del producto relativo a cada fila. La fórmula resultante sería:

```
Quantity_Red_Color_1 = Â SUMX(FILTER(Sales, RELATED('Product'[Color]) = "Red"), Sales[OrderQuantity])
```

  

#### Segunda variante: Combinando las funciones SUMX() y función IF().

En este caso el primer parámetro será la tabla Sales, sin filtrar, y el segundo una expresión. Recorreremos cada fila de la tabla Sales y comprobamos el valor de la expresión. Si la expresión es verdadera sumaremos los valores de la columna OrderQuantity. La expresión a utilizar será â€œSi el color del producto relacionado es rojo la expresión es verdadera, en otro caso es falsaâ€. La fórmula quedará:

```
Quantity_Red_Color_2 = SUMX(Sales, IF(RELATED('Product'[Color]) = "Red", Sales[OrderQuantity]))
```

  

#### Tercera variante: Combinando la función SUMX y la función CALCULATE()

Esta sería muy similar a la primera variante solo que usando la función SUMX en lugar de SUM.

```
Quantity_Red_Color_3 = CALCULATE(SUMX(Sales, Sales[OrderQuantity]), 'Product'[Color] = "Red")
```

  

Para este cálculo las fórmulas más convenientes serían: Quantity\_Red\_Color, Quantity\_Red\_Color\_1 y Quantity\_Red\_Color\_3 porque primero se filtra la tabla Sales y luego se calcula la suma de los valores de la columna OrderQuantity. La más ineficiente es Quantity\_Red\_Color\_2 porque la tabla Sales no se filtra y la expresión contiene una declaración de comparación compleja en su fórmula que ha de ejecutarse fila por fila y que puede hacer lento el rendimiento de la fórmula. Puede utilizarse cualquiera de las dos funciones

<iframe width="600" height="486" src="https://app.powerbi.com/view?r=eyJrIjoiNmNmNjgyMWQtMzZiYy00NmQwLWJkZjEtM2NmNmNiMjRiODRmIiwidCI6ImU2ODE2ZTI1LTQxZGItNGJiNy1iMWE2LTI1YTcxODc3NmY4YyIsImMiOjl9&amp;pageName=ReportSection" frameborder="0" allowfullscreen="true"></iframe>

## Conclusiones

La decisión de cuál de las dos funciones usar depende en algunos casos de sus preferencias personales, como en el cálculo de la cantidad total de unidades vendidas, y en otros de la estructura de sus datos como en el cálculo del importe total de las ventas. En el caso de SUMX tener en cuenta que mientras más simple la expresión mejor será el rendimiento de nuestro modelo.
