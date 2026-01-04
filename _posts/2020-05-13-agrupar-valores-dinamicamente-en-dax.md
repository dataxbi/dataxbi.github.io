---
layout: post
title: "Agrupar valores din�micamente en DAX"
date: 2020-05-13
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dax"
---

En Power BI Desktop podemos agrupar datos de acuerdo a criterios espec�ficos. Por ejemplo, supongamos que queremos clasificar las empresas dentro de una categor�a (micro, peque�a o mediana empresa). Seg�n la [Definici�n de PYME en la UE](http://www.ipyme.org/es-ES/UnionEuropea/UnionEuropea/PoliticaEuropea/Marco/Paginas/NuevaDefinicionPYME.aspx) una empresa para pertenecer a una categor�a debe cumplir con el l�mite de n�mero de empleados permitidos y no superar la cifra de volumen de negocio o la de balance general definidos. Tanto para el n�mero de empleados como para el volumen de sus ventas o su balance general hay unos l�mites definidos que no se pueden superar para pertenecer a una categor�a y este ser�a un buen ejemplo del uso de la agrupaci�n de datos.

<!--more-->

Las agrupaciones de datos pueden ser est�ticas o din�micas. En una [entrada anterior](https://www.dataxbi.com/blog/2019/05/06/crear-usar-funciones-para-agrupar-valores-numericos/) vimos como agrupar valores de forma est�tica en Power Query M usando la instrucci�n if y una funci�n personalizada. En esta entrada veremos c�mo hacer agrupaciones, de forma din�mica, utilizando DAX.

#### Agrupar valores en Power Query M

En Power Query M, se cre� una funci�n personalizada que asignaba un rango a cada valor de una columna que se pasaba como par�metro. Usando esta funci�n a�adimos una columna en la tabla de hechos con el identificador del rango de la tabla de clasificaci�n correspondiente.

En el modelo relacionamos la tabla de hechos con la de clasificaci�n usando la columna con el id de la clasificaci�n. De esta manera pod�amos usar cualquier columna de la tabla de clasificaci�n en una matriz y ver los valores filtrados en funci�n del rango.

La clasificaci�n siempre era la misma aunque se aplicaran filtros y segmentaciones en el informe y esto puede ser una desventaja en algunos casos. Por ejemplo si queremos ver la clasificaci�n de las ventas para un a�o en particular y no por el volumen total de ventas.

#### Agrupar valores din�micamente en DAX

En DAX usaremos medidas en lugar de columnas para la clasificaci�n por lo que si se aplica un filtro a la visualizaci�n que contiene las medidas, la clasificaci�n se ajustar� a los valores filtrados, lo que hace que la clasificaci�n sea din�mica.

- [Demo disponible en nuestro sitio web](https://www.dataxbi.com/analisis-de-resultados)
- [V�deo displonible en YouTube](https://youtu.be/s-fwDAO849E)
- [Archivo PIBX disponible en GitHub](https://github.com/dataxbi/dax/blob/master/Agrupar-valores-con-DAX.pbix)

### El modelo de datos que usaremos

El modelo de datos con el que trabajaremos contiene una tabla de hechos con datos de ventas y n�mero de empleados y una tabla de dimensiones con la clasificaci�n de las empresas por volumen de ventas.

La tabla de hechos se llama **Listado Empresas** y contiene un ranking de las empresas espa�olas seg�n las ventas del 2018. Esta tabla se obtuvo del sitio web de [INFOCIF](http://www.infocif.es/ranking/ventas-empresas/espana)

La tabla Listado Empresas contiene, entre otras columnas, Ventas 2018, Ventas 2017 y Empleados. Despu�s de realizar algunas transformaciones en el editor de Power Query M, la tabla qued� como se muestra en la siguiente imagen.

![dataXbi - Tabla Lista Empresas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-ranking-de-ventas.png)  
  

Las columnas ventas del 2018 y ventas del 2017 se transformaron en una columna con las ventas y otra con el a�o.

La tabla de dimensiones **Clasif Ventas** contiene la clasificaci�n de las empresas seg�n su volumen de ventas. Tiene una columna con el valor m�nimo y otra con el valor m�ximo de cada rango, dos columnas para la descripci�n y el campo Id. El campo Id es un identificador �nico de la tabla, de tipo n�mero entero que ordena los rangos de menor a mayor.

![dataXb i- Tabla Clasif ventasc](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ventas.png)  
  

Las dos tablas no tienen ning�n elemento com�n por lo que en el modelo de datos no est�n relacionadas, como se puede apreciar en la siguiente imagen.

![dataXbi - vista de relaciones](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-vista-de-relaciones.png)  
  

### C�lculos que realizaremos

Lo primero ser� crear una medida b�sica con la suma de los valores de la columna Ventas de la tabla Listado Empresas, el resultado lo dividimos entre 1000 y lo convertimos a un n�mero entero para hacerlo manejable visualmente. Esta medida la crearemos en la tabla Listado Empresas y la llamaremos **Ventas totales**. Debajo tienes el c�digo que usamos para crearla.

![dataXb i- Medida ventas totales](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-ventas-totales.png)  
  

La medida devuelve el total de las ventas y la podemos usar en cualquier visualizaci�n, as� como filtrar y segmentar por las columnas: A�o, Poblaci�n, Provincia, Sector Actividad y Raz�n Social, de la tabla Listado Empresas como se muestra en la siguiente imagen.

![dataXbi - Matrix de ventas totalales](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-ventas-totalales.png)  
  

Sin embargo, al no estar relacionadas las tablas **Clasif ventas** y **Listado Empresas** en el modelo, no podemos filtrar o segmentar la medida **Ventas totales** por los campos de la tabla **Clasif ventas** como se puede ver en la imagen de abajo.

![dataXbi - Matrix clasificacion ventas totales sin clasificaci�n](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-totales-sin-clasificacion.png)  
  

Para cada rango de clasificaci�n devuelve el mismo valor lo que nos dice que no hay relaci�n entre las dos tablas y que no se pueden utilizar en una misma visualizaci�n.

##### Medidas de agrupaci�n

Para poder ver los valores de las ventas filtrados para cada rango de la tabla de clasificaci�n necesitamos crear dos nuevas medidas a partir de la medida **Ventas totales**. Las medidas ser�n:

- Clasificacion por Ventas.
- Ventas por rango con SWITCH.

La medida **Clasificacion por Ventas** buscar� en la tabla **Clasif Ventas** que rango de la tabla contiene el valor de **Ventas totales** y devolver� el Id de ese rango.

Por ejemplo, en la siguiente imagen al valor **Ventas totales** de la empresa AENA SME SA le corresponder� el Id = 2 en el a�o 2017 porque sus ventas est�n entre el valor m�nimo y m�ximo de ese rango.

![dataXbi - Clasificaci�n ventas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ventas-valor-clasificacion.png)  
  

#### Crear la medida Clasificacion por Ventas

En la imagen anterior, la tabla de la derecha contiene los campos de la tabla Clasif ventas y podemos observar que en el �ltimo rango de la tabla el valor de la columna Maximo est� en blanco, es decir, el �ltimo rango no tiene l�mite superior por lo que no podemos crear la medida comparando el valor de **Ventas totales** con los valores Minimo y Maximo de cada rango, en su lugar compararemos solamente con el Minimo, que si contiene valores para todas las filas.

La medida filtrar� los valores de la tabla de clasificaci�n de manera que solo queden las filas donde todos los valores de la columna Minimo sean menores que el valor de Ventas totales. Una vez filtrados los valores de la tabla Clasif Ventas devolveremos el id que tenga el mayor valor y que corresponde con el rango que contiene al valor de la medida Ventas totales.

En el ejemplo de la imagen anterior, para la empresa seleccionada, en la tabla de clasificaci�n solo se mantendr�an las dos primeras filas que son las que cumplen la condici�n de que las Ventas totales sea mayor que el m�nimo. Una vez filtrada la tabla de clasificaci�n, devolveremos el mayor valor de la columna Id, que en este caso ser�a el valor 2.

Debajo tienes el c�digo de la medida:

![dataXbi - medida clasificaci�n por ventas 2](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-por-ventas-2.png)  
  
  
  

#### Uso de la medida Clasificacion por Ventas

Al a�adir esta medida a la visualizaci�n anterior podemos ver que a cada empresa le asigna el id del rango correspondiente en la tabla de clasificaci�n.

![dataXbi - Matrix de clasificaci�n por ventas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-por-ventas.png)  
  

Si cambiamos la raz�n social por la provincia y el a�o a 2018 veremos que los valores de las ventas totales var�an y los valores de la clasificaci�n de las ventas se ajustan a estos nuevos valores, es decir, la agrupaci�n es din�mica, depende de los filtros y las segmentaciones que apliquemos.

![dataXbi - clasificaci�n de ventas por provincia y a�o](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ventas-valor-clasificacion-provincia-a�o.png)  
  

Si queremos mostrar en un informe el volumen de ventas para cada rango de clasificaci�n no podemos hacerlo utilizando esta medida porque las tablas siguen sin estar relacionadas y no podemos relacionarlas utilizando una medida. Para lograrlo crearemos la medida **Ventas por rango con SWITCH** que calcular� el volumen de ventas para cada rango de la tabla Clasif ventas. Visualizaremos la medida en el objeto Matrix que es el objeto visual con mayor n�mero de �reas de visualizaci�n. En total son 4 �reas: valores, fila de totales, columna de totales y total general y para cada una de ellas la medida debe realizar un c�lculo diferente.

#### Crear la medida Ventas por rango con SWITCH

Comenzaremos por calcular los valores de la matriz, a continuaci�n calcularemos la fila de totales, seguido de la columna de totales y finalmente el total general.

#### C�lculo de los valores de la matriz

Este c�lculo tendr� en cuenta las ventas para una empresa y un rango seleccionados. Para la empresa utilizaremos la columna Razon Social de la tabla Listado Empresas por ser la de menor granularidad, de est� forma la medida podr� ser filtrada no solo por este campo sino por cualquier otro de la tabla Listado Empresas. Para el rango usaremos el campo Id de la tabla Clasif ventas por ser el valor que devolvemos en la medida Clasificacion por ventas.

##### Declaraci�n de variables

Almacenaremos los valores seleccionados de los campos Razon Social e Id en dos variables. Para obtener estos valores utilizaremos la [funci�n SELECTEDVALUE()](https://docs.microsoft.com/es-es/dax/selectedvalue-function). Esta funci�n si se ha seleccionado un �nico valor de la columna que se le pasa como par�metro devuelve dicho valor en caso contrario, por defecto, devuelve BLANK.

```
VAR clasifId = SELECTEDVALUE ( 'Clasif ventas'[Id] )
```

```
VAR empresa = SELECTEDVALUE('Listado Empresas'[Razon Social])
```

Para devolver el resultado de la medida utilizaremos la [funci�n SWITCH()](https://docs.microsoft.com/es-es/dax/switch-function-dax) que realizar� el c�lculo de manera diferente en dependencia de los valores de las variables.

##### Funci�n SWITCH()

La funci�n SWITCH eval�a una expresi�n en una lista de valores y devuelve una de varias expresiones de resultado posibles

###### Sintaxis de la funci�n SWITCH

```
SWITCH(expression, value, result[, value, result]…[, else]) 
```

donde:  
expression: es cualquier expresi�n DAX que devuelve un �nico valor escalar, donde la expresi�n se va a evaluar varias veces (para cada fila o contexto).  
value: valor constante con el que van a coincidir los resultados de expression.  
result: cualquier expresi�n escalar que se evaluar� si los resultados de expression coinciden con el argumento value correspondiente.  
else: cualquier expresi�n escalar que se evaluar� si el resultado de expression no coincide con ninguno de los argumentos value.  

Pasaremos como parametros a la funci�n SWITCH los siguientes valores y expresiones:

En _expression_ pasaremos la funci�n TRUE() indicando que value debe ser una expresi�n l�gica que tome valor verdadero.

En _value_ pasaremos cada una de las posibles combinaciones de las variables clasifId y empresa y que son:

- Ambas variables contengan valor
- clasifId contenga valor pero empresa est� en blanco
- clasifId est� en blanco pero empresa contenga valor
- Las dos variables est�n en blanco

En _result_ escribiremos la f�rmula del c�lculo que para cada opci�n de _value_ ser� diferente.

Omitiremos la expresi�n del _else_

Comenzaremos por el primer caso, donde ambas variables tomen valor distinto de BLANK, es decir, calcularemos los valores de las celdas de la matriz. No se incluyen los totales, ni de filas ni de columnas ni el total general.

Este caso se ilustra en la imagen de abajo donde se ha seleccionado la celda donde el valor de la Raz�n social es ALCAMPO SA y el Id del rango es 6 (aunque no se muestre el campo Id sino el campo Clasificaci�nCorta).

![dataXbi - Clasificaci�n de ventas - filtros](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ventas-filtros.png)  
  

Una vez comprobada esta condici�n se filtrar�n las filas de la tabla Listado empresas donde la raz�n social sea igual al valor de la variable empresa y la medida **Clasificacion por Ventas** devuelva el valor de la variable _clasifId_, con estos filtros aplicados a la tabla Listado Empresas se calcular� la medida Ventas totales.

El c�digo de la medida quedar�a como se muestra a continuaci�n:

![dataXbi - Medida clasificaci�n ventas switch I](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-ventas-switch1.png)  
  

##### Visualizaci�n de la medida

Situaremos la medida en la visualizaci�n anterior y podemos observar que solamente se muestran valores en las celdas de la matriz. Los totales de filas y columnas y el total general est�n en blanco.

![dataXbi - Matrix clasificaci�n ventas switch I](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-switch-valores-matriz.png)  
  

#### C�lculo de la fila de totales

Modificaremos la medida anterior a�adiendo una nueva condici�n a la funci�n SWITCH, en este caso la variable clasifId seguir� siendo distinta de BLANK pero la variable empresa ser� BLANK, de esta forma calcularemos el total de cada columna.

Para todos los que satisfagan esta condici�n devolveremos todas las filas de la columna Razon Social borrado todos los filtros que se le hayan aplicado y mantendremos el filtro a la latabla Lista Empresa para las que cumplan que la medida Calsificacion por Ventas sea igual a la variable clasifId y volveremos a calcular las ventas totales.

La medida quedar�a como se muestra a continuaci�n:

![dataXbi - Medida clasificaci�n ventas switch II](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-ventas-switch2.png)

  
  

##### Visualizaci�n de la medida

Si abrimos la pesta�a del informe que contiene la visualizaci�n veremos que ahora adem�s de los valores de la matriz se muestra la fila de totales con la suma de todos los valores de cada columna.

![dataXbi - Matrix clasificaci�n ventas switch II](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-switch-total-columna.png)  
  

#### C�lculo de la columna de totales

A�adiremos otra condici�n a la funci�n SWITCH para calcular la columna de totales con los totales de cada fila. En este caso la condici�n es que la variable empresa no est� en blanco y la variable clasifId s�.

Para este caso se filtrar� la tabla Lista Empresas para aquellas filas donde la raz�n social corresponda con el valor de la variable empresa, quedando la medida como se muestra a continuaci�n:

![dataXbi - Medida clasificaci�n ventas switch III](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-ventas-switch3.png)  
  

##### Visualizaci�n de la medida

Ahora en la matriz de visualizaci�n podemos ver los valores de lasceldas, la fila de totales y la columna de totales, quedando todav�a en blanco la celda del total general.

![dataXbi - Matrix clasificaci�n ventas switch III](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-switch-total-fila-y-columna.png)  
  

#### C�lculo del total general

A�adiremos una �ltima condici�n a la funci�n SWITCH, que es el caso cuando las dos variables empresa y clasifId est�n en blanco. Para este caso se devolver� el resultado de la medida Ventas totales.

Finalmente, la medida quedar�a:

![dataXbi - Matrix clasificaci�n ventas switch](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-ventas-switch.png)  
  

##### Visualizaci�n de la medida

Como podemos observar en la siguiente imagen ya est� llena la celda del total general y de esta forma hemos a�adido un valor para cada una de las 4 �reas de la visualizaci�n.

![dataXbi - Matrix clasificaci�n ventas switch](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-switch-total-general-fila-columna.png)  
  

### Conclusiones

- Las tablas de clasificaci�n junto con las medidas DAX brindan una forma sencilla de agrupaci�n din�mica.
- La agrupaci�n din�mica permite que cuando se modifiquen los filtros y las segmentaciones de datos los c�lculos se ajusten autom�ticamente a esta nueva segmentaci�n. Por ejemplo, podemos ver la segmentaci�n de las ventas para un a�o en particular o para el volumen total de las ventas.
![dataXbi - Matrix para clasificacion ventas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-totales.png)  
  
- Es conveniente que las tablas de clasificaci�n est�n almacenadas fuera del modelo, de forma que puedan modificarse sin necesidad de modificar el modelo. La tabla de clasificaciones que utilizamos en este caso est� en una hoja de Excel. Al ser una fuente externa si los rangos se modifican no tendremos que modificar el modelo, solo actualizarlo. Por ejemplo, podemos dividir el primer rango en varios como se muestra en la imagen.
![dataXbi - rangos de clasificaci�n](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ampliar-rangos-clasif.png)  
  
- La medida para la clasificaci�n de las ventas no debe referirse directamente a los valores de la columna de clasificaci�n porque si se modifican los rangos habr� que modificar la medida. El siguiente es un ejemplo del mal uso de la agrupaci�n. Si se crea o elimina un rango habr� que modificar la medida:
![dataXbi- Clasificaci�n por ventas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-x-ventas-I-1.png)  
  
- Puedes ver un ejemplo del uso de la agrupaci�n din�mica con DAX en la demo [**An�lisis de resultados**](https://www.dataxbi.com/analisis-de-resultados).

- [Demo disponible en nuestro sitio web](https://www.dataxbi.com/analisis-de-resultados)
- [V�deo displonible en YouTube](https://youtu.be/s-fwDAO849E)
- [Archivo PIBX disponible en GitHub](https://github.com/dataxbi/dax/blob/master/Agrupar-valores-con-DAX.pbix)
