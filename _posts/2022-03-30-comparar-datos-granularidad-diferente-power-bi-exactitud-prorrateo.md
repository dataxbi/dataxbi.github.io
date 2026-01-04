---
layout: post
title: "Comparar datos con granularidad diferente en Power BI: Exactitud del prorrateo"
date: 2022-03-30
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "powerquery"
---

Esta entrada es una continuaci�n de la anterior, donde mostr� c�mo prorratear para aumentar la granularidad de los datos. Aqu� te comento de un problema que puede existir con la exactitud de los c�lculos, y te doy dos posibles soluciones. Al final comparo el tama�o en memoria de los modelos de datos de estas dos soluciones y el modelo original.

<!--more-->

### Problema con la exactitud del prorrateo

Si no te has le�do la entrada anterior, te invito a que lo hagas antes de continuar: [https://www.dataxbi.com/blog/2022/03/16/comparar-datos-granularidad-diferente-powerbi/](https://www.dataxbi.com/blog/2022/03/16/comparar-datos-granularidad-diferente-powerbi/)

Vamos a trabajar con la segunda soluci�n de dicha entrada, el modelo m�s robusto, donde el prorrateo se hace con Power Query y se obtiene una sola tabla de hechos con una granularidad de d�a, medio de publicidad y producto.

![Modelo de datos para costes de publicidad](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Costo-publicidad-diario-Solucion-Power-Query.png)

Hasta ahora no hab�a mencionado que a la columna `Costo` le asign� en Power Query el tipo de dato `n�mero decimal fijo`, con lo que tiene una precisi�n de 4 lugares decimales.

![La tabla de hechos Costos Publicidad con la columna Costo con el tipo de datos N�mero decimal fijo.](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Precision-prorrateo-numero-decimal-fijo.png)

Y esa es la causa del problema, porque si queremos calcular el coste mensual o anual a partir del coste diario, que se ha prorrateado a partir del coste mensual, puede que el c�lculo no sea exacto porque no se han almacenado suficientes d�gitos decimales.

Para ilustrar mejor el problema, voy a cargar m�s datos que en el ejemplo inicial. Trabajar� con 1000 productos a los que se les hace publicidad todos los d�as, tanto con Google Ads como con carteles y el registro de costes abarcar� tres a�os, desde el 1 de enero de 2019 hasta el 31 de diciembre de 2021. Por lo que al cargar los datos al modelo, para cada medio de publicidad habr� poco m�s de 1 mill�n de filas en la tabla de hechos (1000 productos x 365 d�as x 3 a�os) y en total ser�n unos 2 millones de filas.

Recuerda que los datos, antes de cargarlos al modelo, tienen granularidades diferentes, la de Google Ads es diaria, por lo que directamente tenemos el coste por producto por d�a. Pero para los carteles tenemos el coste por producto por mes, y al cargar los datos al modelo se prorratea el coste de un producto para cada d�a del mes.

Con estos datos he construido una matriz que muestra el coste para cada a�o y mes y he filtrado para que s�lo tenga en cuenta los carteles, que es donde se han guardado los datos prorrateados. Tanto el coste del mes como el del a�o se calculan a partir del coste diario prorrateado.

En otro PBIX he cargado s�lo los costes mensuales de los carteles y he hecho otra matriz con los costes por a�o y mes. Aqu� el coste del mes no se est� calculando y el coste del a�o es la suma de los costes de cada mes.

Al comparar ambas matrices se puede ver que **hay diferencia en los resultados**.

![Diferencias en los costes mensuales y anuales cuando se calcula a partir del coste diario prorrateado y cuando se toma directamente el coste mensual](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Precision-prorrateo.png)

La diferencia es m�nima y afecta s�lo a los decimales, por lo que la forma m�s sencilla de resolver el problema ser�a formatear la medida para mostrar valores enteros. Pero vamos a asumir que tenemos que mostrar los decimales. Tambi�n es posible que con m�s datos, puedan afectarse los enteros.

El coste prorrateado de cada d�a de enero de 2019 es 16151,0846 y si lo multiplicamos por los 31 d�as de enero obtenemos 500683,6226. Sin embargo el coste mensual original de enero de 2019 es 500683,60 y si lo dividimos entre 31 obtenemos un valor diario de 16151,08387096774. Por lo que es evidente que los 4 lugares decimales del n�mero decimal fijo no son suficientes en este caso.

![Coste diario prorrateado de enero de 2019](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Precision-prorrateo-numero-decimal-fijo-dias-enero.png)

Tened en cuenta que el coste diario mostrado es la suma de los costes de 1000 productos, y que cada uno se prorratea de manera independiente y se almacena con 4 cifras decimales. Por esa raz�n, el total prorrateado del d�a no es un redondeo del obtenido al dividir el coste mensual original entre 31 d�as.

Una posible soluci�n ser�a cambiar el tipo de dato de la columna `Costo` a `n�mero decimal` porque permite almacenar m�s lugares decimales. Pero dicho tipo es de punto flotante y puede dar problemas de exactitud cuando se hacen agregaciones, como explica en este art�culo Marco Russo: [https://www.sqlbi.com/articles/choosing-numeric-data-types-in-dax/](https://www.sqlbi.com/articles/choosing-numeric-data-types-in-dax/).

Por tanto, las dos soluciones que voy a proponer utilizan el tipo de dato n�mero decimal fijo. Y adem�s est�n basadas en las propuestas que hace el autor del art�culo mencionado (ver en los comentarios del art�culo).

### Soluci�n 1: Costo x 10000

Esta soluci�n consiste en multiplicar por 10000 el resultado del prorrateo, con lo que los d�gitos se desplazan 4 lugares a la izquierda. Al almacenarlo como n�mero decimal fijo, seguir� teniendo s�lo 4 lugares a la derecha del separador, pero los 4 d�gitos a la izquierda del separador tambi�n formar�an la parte decimal, por lo que podr�amos decir que en total tendr�amos 8 lugares decimales.

Hice las siguientes modificaciones en Power Query.

En la consulta de los carteles, multipliqu� el coste mensual por 10000 antes de dividirlo por los d�as del mes, para obtener el coste prorrateado x 10000.

![Multiplicando por 10000 el coste prorratedao en Power Query](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Exactitud-prorrateo-solucion-1-power-query-carteles.png)

En la consulta de Google Ads, multipliqu� el coste diario por 10000.

![Multiplicando por 10000 el coste diario en Power Query](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Exactitud-prorrateo-solucion-1-power-query-google-ads.png)

Al anexar ambas consultas para obtener la tabla de hechos que se carga en el modelo, queda una columna con el coste diario multiplicado por 10000.

Despu�s de actualizar estos cambios en el modelo, hay que modificar la medida que calcula el coste de publicidad para que divida entre 10000.

```
DIVIDE ( SUM ( 'Costos Publicidad'[Costo] ), 10000 )

```

Si volvemos a hacer la comparaci�n con los costes mensuales originales, vemos que **ahora si son iguales**.

![Comparaci�n de los costes mensuales y anuales cuando se calcula a partir del coste diario prorrateado multiplicado por 10000 y cuando se toma directamente el coste mensual](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Exactitud-prorrateo-solucion-1-comparacion.png)

### Soluci�n 2: Costo ENT y Costo DEC

En esta soluci�n he separado la parte entera y la parte decimal del coste prorrateado y las he almacenado en las columnas `Costo ENT` y `Costo DEC`. La parte decimal tendr� 8 d�gitos como m�ximo. Ambas columnas ser�n del tipo `n�mero entero`.

Este m�todo se describe en est� art�culo: [https://www.fourmoo.com/2019/11/27/how-i-saved-40-on-my-power-bi-dataset-size/](https://www.fourmoo.com/2019/11/27/how-i-saved-40-on-my-power-bi-dataset-size/)

En Power Query hice una serie de transformaciones al coste prorrateado para obtener una tabla de hechos con las dos columnas mencionadas y sin la columna Costo.

![La tabla de hechos Costes Publicidad con las dos columnas Costo ENT y Costo DEC](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Exactitud-prorrateo-solucion-2-power-query.png)

Luego de actualizar el modelo, he modificado la medida que calcula el coste de publicidad para que vuelva a unir la parte entera y la parte decimal.

```
SUM ( 'Costos Publicidad'[Costo ENT] ) + DIVIDE ( SUM ( 'Costos Publicidad'[Costo DEC]) , 100000000 )

```

Al comparar los costes calculados por a�o y mes de esta soluci�n, con los costes mensuales originales, vemos que tambi�n coinciden, como en la soluci�n anterior.

![Comparaci�n de los costes mensuales y anuales cuando se calcula a partir del coste diario prorrateado y almacenado en dos columnas y cuando se toma directamente el coste mensual](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Exactitud-prorrateo-solucion-2-comparacion.png)

### Tama�o en memoria de los modelos de datos

¿Cu�l de las dos soluciones propuestas crees que ocupe m�s espacio en memoria? Para responder a esta pregunta usar� la herramienta gratuita [DAX Studio](https://daxstudio.org/) y en espec�fico [la opci�n de ver las m�tricas del modelo](https://daxstudio.org/documentation/features/model-metrics/).

El resultado es el siguiente:

- El **modelo original**, que tiene el problema con la exactitud, ocupa **7,71 MB**
- El **modelo de la primera soluci�n**, donde se multiplica por 10000 el coste prorrateado, ocupa **8,32 MB**
- El **modelo de la segunda soluci�n**, donde se separan las parte entera y la parte decimal del coste prorrateado en dos columnas, ocupa **7,27 MB**

Aclaro que los datos cargados en los tres modelos son exactamente los mismos.

![Comparaci�n del tama�o que ocupan en memoria los tres modelos de datos descritos en esta entrada](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Exactitud-prorrateo-Tamano-memoria-modelos-datos.png)

As� que tenemos un claro **ganador**, que es la **segunda soluci�n**, a pesar de que tiene una columna de m�s en la tabla de hechos. Y la raz�n tiene que ver con la cardinalidad de las columnas, o sea, la cantidad de valores �nicos dentro de una columna.

Si observamos los detalles sobre cada columna que nos brinda DAX Studio, podemos ver que la columna Costo tiene la mayor cardinalidad en el modelo de la soluci�n 1, debido a que hay una mayor cantidad de d�gitos por la multiplicaci�n por 10000. Mientras que en la soluci�n 2 la cardinalidad de la columna con la parte entera es muy baja porque los valores que contiene no tienen m�s de dos d�gitos, y la cardinalidad de la parte decimal es mayor pero esta muy por debajo de la soluci�n 1 y del modelo original.

![Detalles de la comparaci�n del tama�o que ocupan en memoria los tres modelos de datos descritos en esta entrada](/assets/images/posts/2022-03-30-comparar-datos-granularidad-diferente-power-bi-exactitud-prorrateo/Exactitud-prorrateo-Tamano-memoria-modelos-datos-detalles.png)
