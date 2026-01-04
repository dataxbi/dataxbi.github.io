---
layout: post
title: "Crear y usar funciones para agrupar valores num�ricos"
date: 2019-05-06
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

En ocasiones necesitamos categorizar nuestros datos en rangos. Por ejemplo: clientes por rango de edad, las ventas seg�n su volumen, o agrupar bajo un mismo concepto un rango de cuentas contables. En esta entrada de blog explicaremos como crear y usar funciones para agrupar valores num�ricos en categor�as en Power Query.

<!--more-->

Otro ejemplo es la clasificaci�n de las personas por los rangos de edad ni�os, adolescentes, j�venes, adultos y adulto mayor, como se muestra en la siguiente tabla.

![Tabla de clasificaci�n de clientes](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-clasificacion-clientes-1.png)

### Crear columna de clasificaci�n usando if anidado

Tenemos una consulta con la informaci�n de nuestros clientes, como la que se muestra en la siguiente imagen.

![Tabla de clientes](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-clientes.png)  
  

Uno de los campos de la consulta es la edad por lo que ser�a muy f�cil a�adir un nuevo campo a la consulta con el rango de edad que le corresponde a cada cliente seg�n la tabla de clasificaci�n.

Como los rangos en que se agrupa la edad son solo 5 podr�amos crear una columna condicional que compruebe para cada fila de la tabla en que rango se encuentra el valor y le asigne la clasificaci�n correspondiente.

Para crear la columna abrimos el Editor Power Query y seleccionamos la consulta Clientes. En la pesta�a del men� Agregar columna elegimos Columna personalizada. Se muestra el cuadro de di�logo Columna personalizada y en la caja de texto Nuevo nombre de columna escribimos Clasificaci�n. Seguidamente en el cuadro de texto F�rmula de columna personalizada escribimos una instrucci�n if anidada como se muestra en la siguiente imagen.

![Crear columna condicional](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-columna-condicional.png)  
  

La instrucci�n if se escribe 5 veces una por cada fila de la tabla de clasificaci�n. Imaginemos que en lugar de esta tabla de clasificaci�n tuvi�ramos una como la que se muestra en la siguiente imagen y que corresponde a un estudio de la poblaci�n por grupo de edad y sexo.

![Estudio poblaci�n por sexo y edad](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-idescat-poblaci�n-por-sexo-edad.png)  
  

Podemos ver que las edades se han agrupado en rangos de 5 a�os y tenemos un total de 20 rangos. Crear una f�rmula que compare los valores de la columna Edad para 20 rangos usando if anidados es una tarea repetitiva y muy tediosa, adem�s de poco eficiente.

En su lugar podemos crear una funci�n Power Query que permita realizar la clasificaci�n de una manera m�s simple y que se pueda reutilizar para otras clasificaciones teniendo en cuenta solo algunas consideraciones.

  

### Crear columna de clasificaci�n usando una funci�n personalizada.

Para crear la columna de clasificaci�n debemos seguir los siguientes pasos:

1. Tener una consulta con los valores num�ricos que queremos clasificar.
2. A�adir una consulta con los rangos de valores de la clasificaci�n.
3. Definir una funci�n que tenga dos par�metros, uno para la tabla de clasificaci�n y otro para el campo num�rico que queremos utilizar en la clasificaci�n.
4. Crear una columna calculada en la tabla que contiene los valores num�ricos a clasificar invocando la funci�n personalizada.

Veaemos un ejemplo practico de la creaci�n y utilizaci�n de una funci�n en Power Query M para clasificar valores en rangos.

#### Paso 1: Tener una consulta con los valores num�ricos que queremos clasificar.

Como consulta con valores num�ricos a clasificar utilizaremos la tabla “Clasificaci�n de empresas por el n�mero de trabajadores y del volumen de su facturaci�n” que pueden encontrar en la [Wikipedia](https://ca.wikipedia.org/wiki/Llista_d%27empreses_de_Menorca_per_facturaci�). Los datos son del a�o 2012 y corresponden a la isla de Menorca. A la consulta la nombraremos Empresa.

La tabla contiene el nombre de la empresa, la industria a la que pertenece, su volumen de facturaci�n y el n�mero de trabajadores con que cuenta. Estos dos �ltimos campos ser�n los que usaremos en la clasificaci�n. En la imagen que se muestra a continuaci�n tienes una muestra de los datos que contiene.

![Tabla de empresas](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-Empresas.png)  
  

#### Paso 2: A�adir una consulta con los rangos de valores de la clasificaci�n.

Crearemos dos tablas de rangos para clasificaci�n, uno para la facturaci�n y otro para el n�mero de empleados.

Las dos tablas de rango deben tener la misma estructura para que la funci�n pueda ser utilizada en ambos casos. El algoritmo debe funcionar bien aunque los datos no est�n ordenados de menor a mayor.

La siguiente imagen muestra la tabla de clasificaci�n seg�n el volumen de facturaci�n.

![Clasificaci�n por volumen de facturaci�n](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-clasificacion.png)  
  

La tabla tiene un identificador num�rico (Id), el nombre del rango (Clasificaci�n), el valor m�nimo del rango (M�nimo) y el valor m�ximo del rango (M�ximo). El valor m�ximo es opcional.

En la siguiente tabla se muestra la clasificaci�n seg�n el n�mero de empleados.

![Clasificaci�n por n�mero de trabajadores](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-clasificacion-trabajadores.png)  
  

Como puede observarse las dos tablas tienen los mismos campos. Esto es importante para poder utilizar la funci�n en las dos clasificaciones.

A�adiremos las dos consultas en el editor Power Query, ya sea porque introduzcamos directamente los datos o porque los importemos desde un archivo con cualquiera de los formatos que soporta Power BI Desktop (CSV, XSLX, JSON, XML, etc.).

#### Paso 3: Definir la funci�n

En este paso creamos la funci�n. En el Editor de Power Query seleccionamos Nuevo origen | Consulta en blanco.

Seleccionamos la consulta que acabamos de crear y abrimos el Editor avanzado y sustituimos el c�digo que se muestra en el editor por el siguiente:

```
let
    //tabla es la tabla de rangos y numero es el valor a comparar de la tabla Empresas para asignarle un rango
    set_range = (tabla as table, numero as number) => 
        let 
            //devuelve la tabla convertida en lista anidada de filas 
            values =  Table.ToRows(tabla),
            //Devuelve una lista con los elementos que en la tercera columna cuyo valor sea menor que numero
            values_selected = List.Select(values, each _{2} < numero),
            //Devuelve la lista ordenada por la tercera columna de menor a mayor
            values_selected_sorted = List.Sort(values_selected,{each _{2},Order.Ascending}),
            //Devuelve el id del rango del �ltimo elemento de la lista
            Result = List.Last(values_selected_sorted){0} 
        in 
            Result
in
    set_range

```

Como se muestra en la imagen:

  
  
![Crear y usar funciones en Power Query](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-editor-avanzado-1.png)  
  

Oprimimos el bot�n Aceptar y a continuaci�n renombramos la consulta como set\_range.

A continuaci�n analizaremos el c�digo escrito l�nea a l�nea.

##### L�nea 1:

```
let
```

Indica inicio del bloque de instrucciones de la consulta

##### L�neas 2, 5, 7, 9, 11

Son lineas de comentario. Para comentarios de una sola l�nea usar "//". Los comentarios de multiples l�neas van encerrados entre /\* y \*/

##### L�nea 3:

```
set_range = (tabla as table, numero as number) =>
```

Declaraci�n de la funci�n.

Veamos cada uno de los elementos de la declaraci�n.

set\_range --> variable a la que se le asigna la expresi�n a la derecha del s�mbolo “=”. En este caso la expresi�n es la declaraci�n de la funci�n. La sintaxis de la declaraci�n de una funci�n la vimos en una [entrada anterior](https://www.dataxbi.com/blog/2018/12/18/crear-funciones-personalizadas-en-power-query/)

\= --> operador de asignaci�n

() --> Los par�ntesis encierran los par�metros de la funci�n que en este caso son 2.

tabla --> variable de tipo table (as table). En esta variable pasaremos el nombre de la tabla de clasificaci�n

numero --> variable de tipo num�rico (as number). En esta variable pasaremos los valores num�ricos que necesitamos clasificar.

\=> --> indica el comienzo del cuerpo de la funci�n

##### L�nea 4:

```
let
```

\--> Indica inicio del bloque de instrucciones de la funci�n

##### L�nea 6:

```
values =  Table.ToRows(tabla),
```

Devuelve una lista anidada de filas, es decir cada fila se convierte en un elemento de una Lista y a su vez los campos de cada fila se convierten en una lista.

values --> variable a la que se le asigna el resultado de invocar la funci�n Table.ToRows()

Table.ToRows(tabla) es una funci�n de Power Query M que convierte la tabla que se le pasa como par�metro en una lista anidada de filas. Puedes revisar la referencia de esta funci�n en la [documentaci�n de Microsoft](https://docs.microsoft.com/es-es/powerquery-m/table-torows). En este caso la tabla que se le pasa como par�metro es la variable tabla.

###### Ejemplo1: Uso de la funci�n Table.ToRows()

Supongamos que la variable tabla contiene la siguiente tabla de valores

![Tabla de ejemplo](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-ejemplo.png)  
  

Si aplicamos la funci�n Table.ToRows() a esta tabla convertir� cada fila en una lista de valores encerrados entre llaves y separados por coma y cada fila estar� anidada como valores separados por coma dentro de otra lista. Es decir, convierte la tabla en una lista de filas que a su vez son listas. El resultado se le asigna a la variable values.

values = {{1,2}, {3,1}, {5,4}}

##### L�nea 8:

```
values_selected = List.Select(values, each _{2} < numero), 
```

values\_selected --> variable a la que se le asigna el resultado de invocar la funci�n List.Select()

Devuelve los elementos de la lista contenida en value que cumplen con la condici�n que los valores de la tercera columna de tabla sean menores que el contenido de la variable numero.

Analicemos cada una de las partes de esta expresi�n:

List.Select() --> funci�n Power Query M que devuelve los elementos de una lista que cumplen una determinada condici�n. En este caso la lista es values, que es el resultado del paso anterior y la condici�n es que los valores de la columna 2 (tercera columna) sean menores que el valor del par�metro numero, es decir todos los valores de la tabla de rango que son menores que el valor del campo que queremos clasificar.

Puedes revisar la referencia de esta funci�n en la [documentaci�n de Microsoft.](https://docs.microsoft.com/es-es/powerquery-m/list-select)

En el siguiente ejemplo partimos del resultado del ejemplo anterior

###### Ejemplo2: Uso de la funci�n List.Select()

values = {{1,2}, {3,1}, {5,4}}

numero = 4

\_{0} primera columna de la tabla o elemento de la lista

\= List.Select({{1,2}, {3,1}, {5,4}}, each \_{0} < 4) = {{1,2}, {3,1}}

La funci�n compara 1, 3 y 5 con 4 y devuelve solo 1 y 3

##### L�nea 10:

```
values_selected_sorted = List.Sort(values_selected,{each _{2},Order.Ascending}),
```

Devuelve los elementos de la lista values\_selected ordenados de forma ascendente por el tercer elemento de la lista.

values\_selected\_sorted --> variable a la que se le asigna el resultado de invocar la funci�n List.Sort()

List.Sort() --> funci�n Power Query M que devuelve ordenados los elementos de una lista. En este caso los ordena por el tercer elemento, ascendentemente. Para ver m�s informaci�n de esta funci�n revisa la [documentaci�n de Microsoft](https://docs.microsoft.com/es-es/powerquery-m/list-sort).

Continuando con el ejemplo anterior

###### Ejemplo3: Uso de la funci�n List.Sort()

values\_selected={{1,2}, {3,1}}

\_{1}: Elemento por el que se ordenar�, 1

Order.Ascending: Ordenamiento que se aplicar�, Ascendente

\= List.Sort({{1,2}, {3,1}}, {each \_{1},Order.Ascending}) = {{3,1}, {1,2}}

##### L�nea 12:

```
Result = List.Last(values_selected_sorted){0}
```

Selecciona el �ltimo elemento de la lista values\_selected\_sorted, y devuelve el primer elemento de la lista resultante

Result --> variable a la que se le asigna el resultado de invocar la funci�n List.Last() y luego seleccionar el primer valor de la lista

List.Last() --> funci�n Power Query M que devuelve el �ltimo conjunto de elementos en la lista. Puedes revisar la referencia de esta funci�n en la [documentaci�n de Microsoft.](https://docs.microsoft.com/es-es/powerquery-m/list-last)

###### Ejemplo4: Uso de la funci�n List.Last()

Si al resultado de la funci�n List.Sort() le aplicamos la funci�n List.Last()

List.Last({{3,1}, {1,2}}) = {1,2}

Solo nos queda una fila de la tabla y debemos escoger el elemento de la tabla que necesitamos.

{} --> Devuelve el elemento de la lista en la posici�n especificada

List.Last({{3,1}, {1,2}}){0} = 1

Result = 1

##### L�neas 13 y 14:

```
     in 
        Result

```

Fin del bloque de instrucciones de la funci�n. Se devuelve el resultado de la l�nea 5.

##### L�neas 15 y 16:

```
in
       set_range

```

Fin del bloque de instrucciones de la consulta. Se devuelve el resultado de la l�nea 2, es decir el resultado de la funci�n.

#### Paso 4: Crear columna calculada

En este paso crearemos las columnas de clasificaci�n en la consulta Empresas. Primero a�adiremos la columna Clasificaci�n por trabajadores y luego la columna Clasificaci�n por volumen de facturaci�n. Para ello, seleccionamos la consulta Empresas y en el men� Agregar columna escogemos la opci�n Invocar funci�n personalizada.

Se abre el cuadro de dialogo Invocar funci�n personalizada que se muestra a continuaci�n. Escribimos el nombre de la nueva columna y seleccionamos la funci�n que acabamos de crear.

![Crear y usar funciones en Power Query](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-1.png)  
  

Como resultado se a�aden dos campos en el cuadro de di�logo, uno por cada par�metro que definimos en la funci�n: tabla y numero.

En la lista desplegable de tabla seleccionamos la consulta Clasificaci�n por trabajadores.

![Crear y usar funciones para agrupar valores num�ricos](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-2.png)  
  

En la lista con los tipos de campo del par�metro numero seleccionamos Nombre de columna.

![Crear y usar funciones para agrupar valores num�ricos](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-3.png)  
  

La caja de texto que aparece a la derecha de numero cambia por una lista desplegable donde seleccionamos la columna Treballadors de la consulta Empresas y seguidamente oprimimos el bot�n Aceptar.

![Crear y usar funciones para agrupar valores num�ricos](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-4.png)  
  

Repetimos el proceso para el rango de facturaci�n. Como las dos tablas tienen la misma estructura podemos utilizar la misma funci�n.

![Crear y usar funciones para agrupar valores num�ricos](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-5.png)  
  

La consulta Empresas tendr� dos nuevas columnas con los identificadores num�ricos de las tablas de rango.

### Modelado

Cargamos las tablas en el modelo y las relacionamos usando los campos Id de las dos tablas de clasificaci�n y las nuevas columnas creadas en la tabla Empresas.

Ordenamos la columna Clasificaci�n, en ambas tablas de rango, por el columna Id.

![Crear relaciones del modelo en Power BI Desktop](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-modelopng-2.png)  
  

### Informes

Finalmente, en la vista de informes, creamos dos visualizaciones para mostrar el uso de las clasificaciones.

![Visualizaci�n Power BI](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dataXbi-blog-funcion-rango-power-query-3.png)

### Conclusiones

Cuando en nuestro modelo de Power BI necesitemos categorizar valores podemos hacerlo de dos formas distintas en el editor de consultas.

Si el n�mero de categor�as en las que agruparemos los valores es peque�o podemos crear una columna condicional utilizando la instrucci�n if y anid�ndola tantas veces como filas tenga nuestra tabla de clasificaci�n.

Cuando el n�mero de categor�as en las que agruparemos los valores es amplio entonces lo m�s eficiente es crear una tabla con los rangos y una funci�n personalizada en el editor avanzado que usaremos para crear la columna de clasificaci�n.

Si tenemos varias tablas de clasificaci�n, aunque tengan pocos rangos de categor�as, lo mas conveniente ser� crear una funci�n personalizada, siempre que las tablas tengan la misma estructura, y usarla para todas las clasificaciones.

El archivo PIBX de este ejemplo est� disponible en [GitHub](https://github.com/dataxbi/power-query).
