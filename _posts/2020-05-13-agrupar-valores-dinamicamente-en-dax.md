---
layout: post
title: "Agrupar valores dinámicamente en DAX"
date: 2020-05-13
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "dax"
---

En Power BI Desktop podemos agrupar datos de acuerdo a criterios específicos. Por ejemplo, supongamos que queremos clasificar las empresas dentro de una categoría (micro, pequeña o mediana empresa). Según la [Definición de PYME en la UE](http://www.ipyme.org/es-ES/UnionEuropea/UnionEuropea/PoliticaEuropea/Marco/Paginas/NuevaDefinicionPYME.aspx) una empresa para pertenecer a una categoría debe cumplir con el límite de número de empleados permitidos y no superar la cifra de volumen de negocio o la de balance general definidos. Tanto para el número de empleados como para el volumen de sus ventas o su balance general hay unos límites definidos que no se pueden superar para pertenecer a una categoría y este sería un buen ejemplo del uso de la agrupación de datos.

<!--more-->

Las agrupaciones de datos pueden ser estáticas o dinámicas. En una [entrada anterior](https://www.dataxbi.com/blog/2019/05/06/crear-usar-funciones-para-agrupar-valores-numericos/) vimos como agrupar valores de forma estática en Power Query M usando la instrucción if y una función personalizada. En esta entrada veremos cómo hacer agrupaciones, de forma dinámica, utilizando DAX.

#### Agrupar valores en Power Query M

En Power Query M, se creó una función personalizada que asignaba un rango a cada valor de una columna que se pasaba como parámetro. Usando esta función añadimos una columna en la tabla de hechos con el identificador del rango de la tabla de clasificación correspondiente.

En el modelo relacionamos la tabla de hechos con la de clasificación usando la columna con el id de la clasificación. De esta manera podíamos usar cualquier columna de la tabla de clasificación en una matriz y ver los valores filtrados en función del rango.

La clasificación siempre era la misma aunque se aplicaran filtros y segmentaciones en el informe y esto puede ser una desventaja en algunos casos. Por ejemplo si queremos ver la clasificación de las ventas para un año en particular y no por el volumen total de ventas.

#### Agrupar valores dinámicamente en DAX

En DAX usaremos medidas en lugar de columnas para la clasificación por lo que si se aplica un filtro a la visualización que contiene las medidas, la clasificación se ajustará a los valores filtrados, lo que hace que la clasificación sea dinámica.

- [Demo disponible en nuestro sitio web](https://www.dataxbi.com/analisis-de-resultados)
- [Vídeo displonible en YouTube](https://youtu.be/s-fwDAO849E)
- [Archivo PIBX disponible en GitHub](https://github.com/dataxbi/dax/blob/master/Agrupar-valores-con-DAX.pbix)

### El modelo de datos que usaremos

El modelo de datos con el que trabajaremos contiene una tabla de hechos con datos de ventas y número de empleados y una tabla de dimensiones con la clasificación de las empresas por volumen de ventas.

La tabla de hechos se llama **Listado Empresas** y contiene un ranking de las empresas españolas según las ventas del 2018. Esta tabla se obtuvo del sitio web de [INFOCIF](http://www.infocif.es/ranking/ventas-empresas/espana)

La tabla Listado Empresas contiene, entre otras columnas, Ventas 2018, Ventas 2017 y Empleados. Después de realizar algunas transformaciones en el editor de Power Query M, la tabla quedó como se muestra en la siguiente imagen.

![dataXbi - Tabla Lista Empresas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-ranking-de-ventas.png)  
  

Las columnas ventas del 2018 y ventas del 2017 se transformaron en una columna con las ventas y otra con el año.

La tabla de dimensiones **Clasif Ventas** contiene la clasificación de las empresas según su volumen de ventas. Tiene una columna con el valor mínimo y otra con el valor máximo de cada rango, dos columnas para la descripción y el campo Id. El campo Id es un identificador único de la tabla, de tipo número entero que ordena los rangos de menor a mayor.

![dataXb i- Tabla Clasif ventasc](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ventas.png)  
  

Las dos tablas no tienen ningún elemento común por lo que en el modelo de datos no están relacionadas, como se puede apreciar en la siguiente imagen.

![dataXbi - vista de relaciones](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-vista-de-relaciones.png)  
  

### Cálculos que realizaremos

Lo primero será crear una medida básica con la suma de los valores de la columna Ventas de la tabla Listado Empresas, el resultado lo dividimos entre 1000 y lo convertimos a un número entero para hacerlo manejable visualmente. Esta medida la crearemos en la tabla Listado Empresas y la llamaremos **Ventas totales**. Debajo tienes el código que usamos para crearla.

![dataXb i- Medida ventas totales](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-ventas-totales.png)  
  

La medida devuelve el total de las ventas y la podemos usar en cualquier visualización, así como filtrar y segmentar por las columnas: Año, Población, Provincia, Sector Actividad y Razón Social, de la tabla Listado Empresas como se muestra en la siguiente imagen.

![dataXbi - Matrix de ventas totalales](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-ventas-totalales.png)  
  

Sin embargo, al no estar relacionadas las tablas **Clasif ventas** y **Listado Empresas** en el modelo, no podemos filtrar o segmentar la medida **Ventas totales** por los campos de la tabla **Clasif ventas** como se puede ver en la imagen de abajo.

![dataXbi - Matrix clasificacion ventas totales sin clasificación](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-totales-sin-clasificacion.png)  
  

Para cada rango de clasificación devuelve el mismo valor lo que nos dice que no hay relación entre las dos tablas y que no se pueden utilizar en una misma visualización.

##### Medidas de agrupación

Para poder ver los valores de las ventas filtrados para cada rango de la tabla de clasificación necesitamos crear dos nuevas medidas a partir de la medida **Ventas totales**. Las medidas serán:

- Clasificacion por Ventas.
- Ventas por rango con SWITCH.

La medida **Clasificacion por Ventas** buscará en la tabla **Clasif Ventas** que rango de la tabla contiene el valor de **Ventas totales** y devolverá el Id de ese rango.

Por ejemplo, en la siguiente imagen al valor **Ventas totales** de la empresa AENA SME SA le corresponderá el Id = 2 en el año 2017 porque sus ventas están entre el valor mínimo y máximo de ese rango.

![dataXbi - Clasificación ventas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ventas-valor-clasificacion.png)  
  

#### Crear la medida Clasificacion por Ventas

En la imagen anterior, la tabla de la derecha contiene los campos de la tabla Clasif ventas y podemos observar que en el último rango de la tabla el valor de la columna Maximo está en blanco, es decir, el último rango no tiene límite superior por lo que no podemos crear la medida comparando el valor de **Ventas totales** con los valores Minimo y Maximo de cada rango, en su lugar compararemos solamente con el Minimo, que si contiene valores para todas las filas.

La medida filtrará los valores de la tabla de clasificación de manera que solo queden las filas donde todos los valores de la columna Minimo sean menores que el valor de Ventas totales. Una vez filtrados los valores de la tabla Clasif Ventas devolveremos el id que tenga el mayor valor y que corresponde con el rango que contiene al valor de la medida Ventas totales.

En el ejemplo de la imagen anterior, para la empresa seleccionada, en la tabla de clasificación solo se mantendrían las dos primeras filas que son las que cumplen la condición de que las Ventas totales sea mayor que el mínimo. Una vez filtrada la tabla de clasificación, devolveremos el mayor valor de la columna Id, que en este caso sería el valor 2.

Debajo tienes el código de la medida:

![dataXbi - medida clasificación por ventas 2](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-por-ventas-2.png)  
  
  
  

#### Uso de la medida Clasificacion por Ventas

Al añadir esta medida a la visualización anterior podemos ver que a cada empresa le asigna el id del rango correspondiente en la tabla de clasificación.

![dataXbi - Matrix de clasificación por ventas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-por-ventas.png)  
  

Si cambiamos la razón social por la provincia y el año a 2018 veremos que los valores de las ventas totales varían y los valores de la clasificación de las ventas se ajustan a estos nuevos valores, es decir, la agrupación es dinámica, depende de los filtros y las segmentaciones que apliquemos.

![dataXbi - clasificación de ventas por provincia y año](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ventas-valor-clasificacion-provincia-año.png)  
  

Si queremos mostrar en un informe el volumen de ventas para cada rango de clasificación no podemos hacerlo utilizando esta medida porque las tablas siguen sin estar relacionadas y no podemos relacionarlas utilizando una medida. Para lograrlo crearemos la medida **Ventas por rango con SWITCH** que calculará el volumen de ventas para cada rango de la tabla Clasif ventas. Visualizaremos la medida en el objeto Matrix que es el objeto visual con mayor número de áreas de visualización. En total son 4 áreas: valores, fila de totales, columna de totales y total general y para cada una de ellas la medida debe realizar un cálculo diferente.

#### Crear la medida Ventas por rango con SWITCH

Comenzaremos por calcular los valores de la matriz, a continuación calcularemos la fila de totales, seguido de la columna de totales y finalmente el total general.

#### Cálculo de los valores de la matriz

Este cálculo tendrá en cuenta las ventas para una empresa y un rango seleccionados. Para la empresa utilizaremos la columna Razon Social de la tabla Listado Empresas por ser la de menor granularidad, de está forma la medida podrá ser filtrada no solo por este campo sino por cualquier otro de la tabla Listado Empresas. Para el rango usaremos el campo Id de la tabla Clasif ventas por ser el valor que devolvemos en la medida Clasificacion por ventas.

##### Declaración de variables

Almacenaremos los valores seleccionados de los campos Razon Social e Id en dos variables. Para obtener estos valores utilizaremos la [función SELECTEDVALUE()](https://docs.microsoft.com/es-es/dax/selectedvalue-function). Esta función si se ha seleccionado un único valor de la columna que se le pasa como parámetro devuelve dicho valor en caso contrario, por defecto, devuelve BLANK.

```
VAR clasifId = SELECTEDVALUE ( 'Clasif ventas'[Id] )
```

```
VAR empresa = SELECTEDVALUE('Listado Empresas'[Razon Social])
```

Para devolver el resultado de la medida utilizaremos la [función SWITCH()](https://docs.microsoft.com/es-es/dax/switch-function-dax) que realizará el cálculo de manera diferente en dependencia de los valores de las variables.

##### Función SWITCH()

La función SWITCH evalúa una expresión en una lista de valores y devuelve una de varias expresiones de resultado posibles

###### Sintaxis de la función SWITCH

```
SWITCH(expression, value, result[, value, result]â€¦[, else]) 
```

donde:  
expression: es cualquier expresión DAX que devuelve un único valor escalar, donde la expresión se va a evaluar varias veces (para cada fila o contexto).  
value: valor constante con el que van a coincidir los resultados de expression.  
result: cualquier expresión escalar que se evaluará si los resultados de expression coinciden con el argumento value correspondiente.  
else: cualquier expresión escalar que se evaluará si el resultado de expression no coincide con ninguno de los argumentos value.  

Pasaremos como parametros a la función SWITCH los siguientes valores y expresiones:

En _expression_ pasaremos la función TRUE() indicando que value debe ser una expresión lógica que tome valor verdadero.

En _value_ pasaremos cada una de las posibles combinaciones de las variables clasifId y empresa y que son:

- Ambas variables contengan valor
- clasifId contenga valor pero empresa esté en blanco
- clasifId esté en blanco pero empresa contenga valor
- Las dos variables estén en blanco

En _result_ escribiremos la fórmula del cálculo que para cada opción de _value_ será diferente.

Omitiremos la expresión del _else_

Comenzaremos por el primer caso, donde ambas variables tomen valor distinto de BLANK, es decir, calcularemos los valores de las celdas de la matriz. No se incluyen los totales, ni de filas ni de columnas ni el total general.

Este caso se ilustra en la imagen de abajo donde se ha seleccionado la celda donde el valor de la Razón social es ALCAMPO SA y el Id del rango es 6 (aunque no se muestre el campo Id sino el campo ClasificaciónCorta).

![dataXbi - Clasificación de ventas - filtros](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ventas-filtros.png)  
  

Una vez comprobada esta condición se filtrarán las filas de la tabla Listado empresas donde la razón social sea igual al valor de la variable empresa y la medida **Clasificacion por Ventas** devuelva el valor de la variable _clasifId_, con estos filtros aplicados a la tabla Listado Empresas se calculará la medida Ventas totales.

El código de la medida quedaría como se muestra a continuación:

![dataXbi - Medida clasificación ventas switch I](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-ventas-switch1.png)  
  

##### Visualización de la medida

Situaremos la medida en la visualización anterior y podemos observar que solamente se muestran valores en las celdas de la matriz. Los totales de filas y columnas y el total general están en blanco.

![dataXbi - Matrix clasificación ventas switch I](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-switch-valores-matriz.png)  
  

#### Cálculo de la fila de totales

Modificaremos la medida anterior añadiendo una nueva condición a la función SWITCH, en este caso la variable clasifId seguirá siendo distinta de BLANK pero la variable empresa será BLANK, de esta forma calcularemos el total de cada columna.

Para todos los que satisfagan esta condición devolveremos todas las filas de la columna Razon Social borrado todos los filtros que se le hayan aplicado y mantendremos el filtro a la latabla Lista Empresa para las que cumplan que la medida Calsificacion por Ventas sea igual a la variable clasifId y volveremos a calcular las ventas totales.

La medida quedaría como se muestra a continuación:

![dataXbi - Medida clasificación ventas switch II](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-ventas-switch2.png)

  
  

##### Visualización de la medida

Si abrimos la pestaña del informe que contiene la visualización veremos que ahora además de los valores de la matriz se muestra la fila de totales con la suma de todos los valores de cada columna.

![dataXbi - Matrix clasificación ventas switch II](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-switch-total-columna.png)  
  

#### Cálculo de la columna de totales

Añadiremos otra condición a la función SWITCH para calcular la columna de totales con los totales de cada fila. En este caso la condición es que la variable empresa no esté en blanco y la variable clasifId sí.

Para este caso se filtrará la tabla Lista Empresas para aquellas filas donde la razón social corresponda con el valor de la variable empresa, quedando la medida como se muestra a continuación:

![dataXbi - Medida clasificación ventas switch III](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-ventas-switch3.png)  
  

##### Visualización de la medida

Ahora en la matriz de visualización podemos ver los valores de lasceldas, la fila de totales y la columna de totales, quedando todavía en blanco la celda del total general.

![dataXbi - Matrix clasificación ventas switch III](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-switch-total-fila-y-columna.png)  
  

#### Cálculo del total general

Añadiremos una última condición a la función SWITCH, que es el caso cuando las dos variables empresa y clasifId estén en blanco. Para este caso se devolverá el resultado de la medida Ventas totales.

Finalmente, la medida quedaría:

![dataXbi - Matrix clasificación ventas switch](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-medida-clasificacion-ventas-switch.png)  
  

##### Visualización de la medida

Como podemos observar en la siguiente imagen ya está llena la celda del total general y de esta forma hemos añadido un valor para cada una de las 4 áreas de la visualización.

![dataXbi - Matrix clasificación ventas switch](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-switch-total-general-fila-columna.png)  
  

### Conclusiones

- Las tablas de clasificación junto con las medidas DAX brindan una forma sencilla de agrupación dinámica.
- La agrupación dinámica permite que cuando se modifiquen los filtros y las segmentaciones de datos los cálculos se ajusten automáticamente a esta nueva segmentación. Por ejemplo, podemos ver la segmentación de las ventas para un año en particular o para el volumen total de las ventas.
![dataXbi - Matrix para clasificacion ventas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-td-clasificacion-ventas-totales.png)  
  
- Es conveniente que las tablas de clasificación estén almacenadas fuera del modelo, de forma que puedan modificarse sin necesidad de modificar el modelo. La tabla de clasificaciones que utilizamos en este caso está en una hoja de Excel. Al ser una fuente externa si los rangos se modifican no tendremos que modificar el modelo, solo actualizarlo. Por ejemplo, podemos dividir el primer rango en varios como se muestra en la imagen.
![dataXbi - rangos de clasificación](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-ampliar-rangos-clasif.png)  
  
- La medida para la clasificación de las ventas no debe referirse directamente a los valores de la columna de clasificación porque si se modifican los rangos habrá que modificar la medida. El siguiente es un ejemplo del mal uso de la agrupación. Si se crea o elimina un rango habrá que modificar la medida:
![dataXbi- Clasificación por ventas](/assets/images/posts/2020-05-13-agrupar-valores-dinamicamente-en-dax/dataXbi-clasif-x-ventas-I-1.png)  
  
- Puedes ver un ejemplo del uso de la agrupación dinámica con DAX en la demo [**Análisis de resultados**](https://www.dataxbi.com/analisis-de-resultados).

- [Demo disponible en nuestro sitio web](https://www.dataxbi.com/analisis-de-resultados)
- [Vídeo displonible en YouTube](https://youtu.be/s-fwDAO849E)
- [Archivo PIBX disponible en GitHub](https://github.com/dataxbi/dax/blob/master/Agrupar-valores-con-DAX.pbix)
