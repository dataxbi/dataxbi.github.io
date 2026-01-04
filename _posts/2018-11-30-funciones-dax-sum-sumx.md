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

Las funciones DAX SUM y SUMX calculan la suma de valores num�ricos y cuando pensamos en crear una medida de este tipo pueden surgir dudas entre cu�l de las dos utilizar. En esta entrada de blog las compararemos desde varios puntos de vista como la descripci�n, la sintaxis, la forma en que operan y los resultados que devuelven, adem�s de mostrar algunos ejemplos de su uso. Esperamos que cuando tengas necesidad de realizar este c�lculo te resulte m�s sencilla la elecci�n.

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

Antes de comenzar a crear las m�tricas veamos en detalle las dos funciones.

## Funciones DAX SUM y SUMX

### Comparaci�n:

#### Descripci�n

| SUM() | SUMX() |
| --- | --- |
|   Agrega todos los n�meros en una columna   |   Devuelve la suma de una expresi�n evaluada por cada fila de una tabla   |
|   Ambas funciones suman valores num�ricos   |  |

#### Sintaxis

| SUM() | SUMX() |
| --- | --- |
|   ``` SUM(<columna>) ```  El par�metro <columna> es la columna que contiene los n�meros a sumar. La funci�n acepta valores num�ricos o de fecha y devuelve como resultado un valor decimal. Las filas pueden contener valores en blanco. Los valores de la columna no se pueden filtrar.   |   ``` SUMX(<tabla>, <expresi�n>) ```  El par�metro <tabla> es la tabla que contiene los valores para los cuales se evaluar� la expresi�n. Puede ser el nombre de una tabla o una expresi�n que devuelve una tabla.  El par�metro < expresi�n > es una columna que contiene los n�meros que desea sumar o una expresi�n que se eval�a como una columna.  Solo se tienen en cuenta los n�meros de la columna. Se omiten los espacios en blanco, los valores l�gicos y el texto.   |
|   Admite un solo par�metro que debe ser el nombre de una columna por lo que los valores no se pueden filtrar   |   Admite dos par�metros y ambos pueden ser expresiones por tanto la tabla y los valores se pueden filtrar   |

#### ¿C�mo realiza el c�lculo?

| SUM() | SUMX() |
| --- | --- |
|   Opera solamente sobre la columna que se le pasa como par�metro   |   Opera sobre todas las columnas de la tabla que se le pasa como primer par�metro   |
|   Sumar� directamente los valores de la columna   |   Recorrer� cada fila de la tabla evaluando una expresi�n y realizar� la suma de los valores   |

#### Resultado

| SUM() | SUMX() |
| --- | --- |
|   Ambas funciones devuelven el mismo resultado, un n�mero decimal.   |  |

  

## Medidas

Veamos ahora como crear las medidas para realizar los c�lculos indicados con las dos funciones.

### Calcular la cantidad total de unidades vendidas

Como se puede apreciar en la imagen 2, la tabla Sales contiene la columna OrderQuantity que almacena el n�mero de unidades vendidas de cada producto en cada orden.

Si queremos calcular el total de unidades vendidas, debemos sumar los valores de la columna OrderQuantity. En este caso la funci�n SUM() ser�a la elegida sin pensarlo mucho pues es justo lo que hace la funci�n SUM(). La f�rmula se ver�a as�:

```
Unidades vendidas = SUM(Sales[OrderQuantity])
```

Sin embargo podr�amos utilizar la funci�n SUMX() para realizar el c�lculo y el resultado ser�a el mismo. Como segundo par�metro pasamos la columna en lugar de una expresi�n. La f�rmula ser�a:

```
Unidades vendidas 2 = SUMX (Sales; Sales[OrderQuantity])
```

Por el contrario de lo que puedas pensar las dos funciones son id�nticas en rendimiento y eficiencia. Podemos usar cualquiera de las dos.

### Calcular el importe total de las ventas

Si revisas la lista de campos de la tabla Sales ver�s que no contiene una columna con el importe de cada l�nea. Este importe podemos calcularlo si multiplicamos los valores de las columnas OrderQuantity y UnitPrice fila a fila y sumamos los resultados.

Dos formas de realizar el mismo calculo ser�an:

- Crear una columna calculada que calcule el producto de las dos columnas fila a fila y luego crear una medida que sume de los valores de la columna calculada.

F�rmula de la columna calculada:

```
Ventas l�nea = Sales[OrderQuantity] * Sales[UnitPrice]
```

F�rmula de la medida:

```
Total Sales = SUM([Ventas l�nea])
```

- La segunda soluci�n es usar la funci�n SUMX para crear directamente la medida sin necesidad de crear una columna calculada primero. La f�rmula ser�a:

```
Total Sales 1 = SUMX(Sales;Sales[OrderQuantity] * Sales[UnitPrice])
```

Las dos medidas devuelven el mismo resultado. Con la primera soluci�n almacenar�amos en el modelo permanentemente los resultados de multiplicar ambas columnas fila por fila, mientras que en la segunda soluci�n no. La segunda soluci�n es la m�s eficiente, es decir, elegiremos SUMX().

### Calcular la cantidad de productos de color rojo vendidos

Para realizar este c�lculo debemos tener en cuenta que a la funci�n SUM() no se le puede pasar una expresi�n como par�metro, solo admite nombres de columnas. Esto implica que no se pueden filtrar las filas de la tabla sobre la que queremos realizar el c�lculo y para lograrlo necesitamos combinarla con la funci�n CALCULATE(). La f�rmula se ver�a:

```
Quantity_Red_Color = CALCULATE(SUM(Sales[OrderQuantity]), Product[Color] = "Red")
```

Si usamos la funci�n SUMX() para realizar el c�lculo tenemos varias variantes:

#### Primera variante: Combinando las funciones SUMX() y FILTER()

La funci�n SUMX admite como primer par�metro una expresi�n que devuelva una tabla y la funci�n Filter lo hace. Esto nos permite filtrar la tabla Sales de manera que solo devuelva las filas donde el color del producto es rojo y luego sumamos los valores de la columna OrderQuantity. La columna Color est� en la tabla Product y por ello necesitamos usar la funci�n RELATED() para conocer el color del producto relativo a cada fila. La f�rmula resultante ser�a:

```
Quantity_Red_Color_1 =  SUMX(FILTER(Sales, RELATED('Product'[Color]) = "Red"), Sales[OrderQuantity])
```

  

#### Segunda variante: Combinando las funciones SUMX() y funci�n IF().

En este caso el primer par�metro ser� la tabla Sales, sin filtrar, y el segundo una expresi�n. Recorreremos cada fila de la tabla Sales y comprobamos el valor de la expresi�n. Si la expresi�n es verdadera sumaremos los valores de la columna OrderQuantity. La expresi�n a utilizar ser� “Si el color del producto relacionado es rojo la expresi�n es verdadera, en otro caso es falsa”. La f�rmula quedar�:

```
Quantity_Red_Color_2 = SUMX(Sales, IF(RELATED('Product'[Color]) = "Red", Sales[OrderQuantity]))
```

  

#### Tercera variante: Combinando la funci�n SUMX y la funci�n CALCULATE()

Esta ser�a muy similar a la primera variante solo que usando la funci�n SUMX en lugar de SUM.

```
Quantity_Red_Color_3 = CALCULATE(SUMX(Sales, Sales[OrderQuantity]), 'Product'[Color] = "Red")
```

  

Para este c�lculo las f�rmulas m�s convenientes ser�an: Quantity\_Red\_Color, Quantity\_Red\_Color\_1 y Quantity\_Red\_Color\_3 porque primero se filtra la tabla Sales y luego se calcula la suma de los valores de la columna OrderQuantity. La m�s ineficiente es Quantity\_Red\_Color\_2 porque la tabla Sales no se filtra y la expresi�n contiene una declaraci�n de comparaci�n compleja en su f�rmula que ha de ejecutarse fila por fila y que puede hacer lento el rendimiento de la f�rmula. Puede utilizarse cualquiera de las dos funciones

<iframe width="600" height="486" src="https://app.powerbi.com/view?r=eyJrIjoiNmNmNjgyMWQtMzZiYy00NmQwLWJkZjEtM2NmNmNiMjRiODRmIiwidCI6ImU2ODE2ZTI1LTQxZGItNGJiNy1iMWE2LTI1YTcxODc3NmY4YyIsImMiOjl9&amp;pageName=ReportSection" frameborder="0" allowfullscreen="true"></iframe>

## Conclusiones

La decisi�n de cu�l de las dos funciones usar depende en algunos casos de sus preferencias personales, como en el c�lculo de la cantidad total de unidades vendidas, y en otros de la estructura de sus datos como en el c�lculo del importe total de las ventas. En el caso de SUMX tener en cuenta que mientras m�s simple la expresi�n mejor ser� el rendimiento de nuestro modelo.
