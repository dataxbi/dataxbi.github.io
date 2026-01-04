---
layout: post
title: "Crear y usar funciones para agrupar valores numéricos"
date: 2019-05-06
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

En ocasiones necesitamos categorizar nuestros datos en rangos. Por ejemplo: clientes por rango de edad, las ventas según su volumen, o agrupar bajo un mismo concepto un rango de cuentas contables. En esta entrada de blog explicaremos como crear y usar funciones para agrupar valores numéricos en categorías en Power Query.

<!--more-->

Otro ejemplo es la clasificación de las personas por los rangos de edad niños, adolescentes, jóvenes, adultos y adulto mayor, como se muestra en la siguiente tabla.

![Tabla de clasificación de clientes](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-clasificacion-clientes-1.png)

### Crear columna de clasificación usando if anidado

Tenemos una consulta con la información de nuestros clientes, como la que se muestra en la siguiente imagen.

![Tabla de clientes](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-clientes.png)  
  

Uno de los campos de la consulta es la edad por lo que sería muy fácil añadir un nuevo campo a la consulta con el rango de edad que le corresponde a cada cliente según la tabla de clasificación.

Como los rangos en que se agrupa la edad son solo 5 podríamos crear una columna condicional que compruebe para cada fila de la tabla en que rango se encuentra el valor y le asigne la clasificación correspondiente.

Para crear la columna abrimos el Editor Power Query y seleccionamos la consulta Clientes. En la pestaña del menú Agregar columna elegimos Columna personalizada. Se muestra el cuadro de diálogo Columna personalizada y en la caja de texto Nuevo nombre de columna escribimos Clasificación. Seguidamente en el cuadro de texto Fórmula de columna personalizada escribimos una instrucción if anidada como se muestra en la siguiente imagen.

![Crear columna condicional](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-columna-condicional.png)  
  

La instrucción if se escribe 5 veces una por cada fila de la tabla de clasificación. Imaginemos que en lugar de esta tabla de clasificación tuviéramos una como la que se muestra en la siguiente imagen y que corresponde a un estudio de la población por grupo de edad y sexo.

![Estudio población por sexo y edad](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-idescat-población-por-sexo-edad.png)  
  

Podemos ver que las edades se han agrupado en rangos de 5 años y tenemos un total de 20 rangos. Crear una fórmula que compare los valores de la columna Edad para 20 rangos usando if anidados es una tarea repetitiva y muy tediosa, además de poco eficiente.

En su lugar podemos crear una función Power Query que permita realizar la clasificación de una manera más simple y que se pueda reutilizar para otras clasificaciones teniendo en cuenta solo algunas consideraciones.

  

### Crear columna de clasificación usando una función personalizada.

Para crear la columna de clasificación debemos seguir los siguientes pasos:

1. Tener una consulta con los valores numéricos que queremos clasificar.
2. Añadir una consulta con los rangos de valores de la clasificación.
3. Definir una función que tenga dos parámetros, uno para la tabla de clasificación y otro para el campo numérico que queremos utilizar en la clasificación.
4. Crear una columna calculada en la tabla que contiene los valores numéricos a clasificar invocando la función personalizada.

Veaemos un ejemplo practico de la creación y utilización de una función en Power Query M para clasificar valores en rangos.

#### Paso 1: Tener una consulta con los valores numéricos que queremos clasificar.

Como consulta con valores numéricos a clasificar utilizaremos la tabla â€œClasificación de empresas por el número de trabajadores y del volumen de su facturaciónâ€ que pueden encontrar en la [Wikipedia](https://ca.wikipedia.org/wiki/Llista_d%27empreses_de_Menorca_per_facturació). Los datos son del año 2012 y corresponden a la isla de Menorca. A la consulta la nombraremos Empresa.

La tabla contiene el nombre de la empresa, la industria a la que pertenece, su volumen de facturación y el número de trabajadores con que cuenta. Estos dos últimos campos serán los que usaremos en la clasificación. En la imagen que se muestra a continuación tienes una muestra de los datos que contiene.

![Tabla de empresas](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-Empresas.png)  
  

#### Paso 2: Añadir una consulta con los rangos de valores de la clasificación.

Crearemos dos tablas de rangos para clasificación, uno para la facturación y otro para el número de empleados.

Las dos tablas de rango deben tener la misma estructura para que la función pueda ser utilizada en ambos casos. El algoritmo debe funcionar bien aunque los datos no estén ordenados de menor a mayor.

La siguiente imagen muestra la tabla de clasificación según el volumen de facturación.

![Clasificación por volumen de facturación](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-clasificacion.png)  
  

La tabla tiene un identificador numérico (Id), el nombre del rango (Clasificación), el valor mínimo del rango (Mínimo) y el valor máximo del rango (Máximo). El valor máximo es opcional.

En la siguiente tabla se muestra la clasificación según el número de empleados.

![Clasificación por número de trabajadores](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-clasificacion-trabajadores.png)  
  

Como puede observarse las dos tablas tienen los mismos campos. Esto es importante para poder utilizar la función en las dos clasificaciones.

Añadiremos las dos consultas en el editor Power Query, ya sea porque introduzcamos directamente los datos o porque los importemos desde un archivo con cualquiera de los formatos que soporta Power BI Desktop (CSV, XSLX, JSON, XML, etc.).

#### Paso 3: Definir la función

En este paso creamos la función. En el Editor de Power Query seleccionamos Nuevo origen | Consulta en blanco.

Seleccionamos la consulta que acabamos de crear y abrimos el Editor avanzado y sustituimos el código que se muestra en el editor por el siguiente:

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
            //Devuelve el id del rango del último elemento de la lista
            Result = List.Last(values_selected_sorted){0} 
        in 
            Result
in
    set_range

```

Como se muestra en la imagen:

  
  
![Crear y usar funciones en Power Query](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-editor-avanzado-1.png)  
  

Oprimimos el botón Aceptar y a continuación renombramos la consulta como set\_range.

A continuación analizaremos el código escrito línea a línea.

##### Línea 1:

```
let
```

Indica inicio del bloque de instrucciones de la consulta

##### Líneas 2, 5, 7, 9, 11

Son lineas de comentario. Para comentarios de una sola línea usar "//". Los comentarios de multiples líneas van encerrados entre /\* y \*/

##### Línea 3:

```
set_range = (tabla as table, numero as number) =>
```

Declaración de la función.

Veamos cada uno de los elementos de la declaración.

set\_range --> variable a la que se le asigna la expresión a la derecha del símbolo â€œ=â€. En este caso la expresión es la declaración de la función. La sintaxis de la declaración de una función la vimos en una [entrada anterior](https://www.dataxbi.com/blog/2018/12/18/crear-funciones-personalizadas-en-power-query/)

= --> operador de asignación

() --> Los paréntesis encierran los parámetros de la función que en este caso son 2.

tabla --> variable de tipo table (as table). En esta variable pasaremos el nombre de la tabla de clasificación

numero --> variable de tipo numérico (as number). En esta variable pasaremos los valores numéricos que necesitamos clasificar.

=> --> indica el comienzo del cuerpo de la función

##### Línea 4:

```
let
```

\--> Indica inicio del bloque de instrucciones de la función

##### Línea 6:

```
values =  Table.ToRows(tabla),
```

Devuelve una lista anidada de filas, es decir cada fila se convierte en un elemento de una Lista y a su vez los campos de cada fila se convierten en una lista.

values --> variable a la que se le asigna el resultado de invocar la función Table.ToRows()

Table.ToRows(tabla) es una función de Power Query M que convierte la tabla que se le pasa como parámetro en una lista anidada de filas. Puedes revisar la referencia de esta función en la [documentación de Microsoft](https://docs.microsoft.com/es-es/powerquery-m/table-torows). En este caso la tabla que se le pasa como parámetro es la variable tabla.

###### Ejemplo1: Uso de la función Table.ToRows()

Supongamos que la variable tabla contiene la siguiente tabla de valores

![Tabla de ejemplo](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-tabla-ejemplo.png)  
  

Si aplicamos la función Table.ToRows() a esta tabla convertirá cada fila en una lista de valores encerrados entre llaves y separados por coma y cada fila estará anidada como valores separados por coma dentro de otra lista. Es decir, convierte la tabla en una lista de filas que a su vez son listas. El resultado se le asigna a la variable values.

{% raw %}
values = {{1,2}, {3,1}, {5,4}}
{% endraw %}

##### Línea 8:

```
values_selected = List.Select(values, each _{2} < numero), 
```

values\_selected --> variable a la que se le asigna el resultado de invocar la función List.Select()

Devuelve los elementos de la lista contenida en value que cumplen con la condición que los valores de la tercera columna de tabla sean menores que el contenido de la variable numero.

Analicemos cada una de las partes de esta expresión:

List.Select() --> función Power Query M que devuelve los elementos de una lista que cumplen una determinada condición. En este caso la lista es values, que es el resultado del paso anterior y la condición es que los valores de la columna 2 (tercera columna) sean menores que el valor del parámetro numero, es decir todos los valores de la tabla de rango que son menores que el valor del campo que queremos clasificar.

Puedes revisar la referencia de esta función en la [documentación de Microsoft.](https://docs.microsoft.com/es-es/powerquery-m/list-select)

En el siguiente ejemplo partimos del resultado del ejemplo anterior

###### Ejemplo2: Uso de la función List.Select()

{% raw %}
values = {{1,2}, {3,1}, {5,4}}

numero = 4

_{0} primera columna de la tabla o elemento de la lista

= List.Select({{1,2}, {3,1}, {5,4}}, each _{0} < 4) = {{1,2}, {3,1}}
{% endraw %}

La función compara 1, 3 y 5 con 4 y devuelve solo 1 y 3

##### Línea 10:

```
values_selected_sorted = List.Sort(values_selected,{each _{2},Order.Ascending}),
```

Devuelve los elementos de la lista values\_selected ordenados de forma ascendente por el tercer elemento de la lista.

values\_selected\_sorted --> variable a la que se le asigna el resultado de invocar la función List.Sort()

List.Sort() --> función Power Query M que devuelve ordenados los elementos de una lista. En este caso los ordena por el tercer elemento, ascendentemente. Para ver más información de esta función revisa la [documentación de Microsoft](https://docs.microsoft.com/es-es/powerquery-m/list-sort).

Continuando con el ejemplo anterior

###### Ejemplo3: Uso de la función List.Sort()

{% raw %}
values_selected={{1,2}, {3,1}}

_{1}: Elemento por el que se ordenará, 1

Order.Ascending: Ordenamiento que se aplicará, Ascendente

= List.Sort({{1,2}, {3,1}}, {each _{1},Order.Ascending}) = {{3,1}, {1,2}}
{% endraw %}

##### Línea 12:

```
Result = List.Last(values_selected_sorted){0}
```

Selecciona el último elemento de la lista values\_selected\_sorted, y devuelve el primer elemento de la lista resultante

Result --> variable a la que se le asigna el resultado de invocar la función List.Last() y luego seleccionar el primer valor de la lista

List.Last() --> función Power Query M que devuelve el último conjunto de elementos en la lista. Puedes revisar la referencia de esta función en la [documentación de Microsoft.](https://docs.microsoft.com/es-es/powerquery-m/list-last)

###### Ejemplo4: Uso de la función List.Last()

Si al resultado de la función List.Sort() le aplicamos la función List.Last()

{% raw %}
List.Last({{3,1}, {1,2}}) = {1,2}
{% endraw %}

Solo nos queda una fila de la tabla y debemos escoger el elemento de la tabla que necesitamos.

{} --> Devuelve el elemento de la lista en la posición especificada

{% raw %}
List.Last({{3,1}, {1,2}}){0} = 1
{% endraw %}

Result = 1

##### Líneas 13 y 14:

```
     in 
        Result

```

Fin del bloque de instrucciones de la función. Se devuelve el resultado de la línea 5.

##### Líneas 15 y 16:

```
in
       set_range

```

Fin del bloque de instrucciones de la consulta. Se devuelve el resultado de la línea 2, es decir el resultado de la función.

#### Paso 4: Crear columna calculada

En este paso crearemos las columnas de clasificación en la consulta Empresas. Primero añadiremos la columna Clasificación por trabajadores y luego la columna Clasificación por volumen de facturación. Para ello, seleccionamos la consulta Empresas y en el menú Agregar columna escogemos la opción Invocar función personalizada.

Se abre el cuadro de dialogo Invocar función personalizada que se muestra a continuación. Escribimos el nombre de la nueva columna y seleccionamos la función que acabamos de crear.

![Crear y usar funciones en Power Query](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-1.png)  
  

Como resultado se añaden dos campos en el cuadro de diálogo, uno por cada parámetro que definimos en la función: tabla y numero.

En la lista desplegable de tabla seleccionamos la consulta Clasificación por trabajadores.

![Crear y usar funciones para agrupar valores numéricos](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-2.png)  
  

En la lista con los tipos de campo del parámetro numero seleccionamos Nombre de columna.

![Crear y usar funciones para agrupar valores numéricos](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-3.png)  
  

La caja de texto que aparece a la derecha de numero cambia por una lista desplegable donde seleccionamos la columna Treballadors de la consulta Empresas y seguidamente oprimimos el botón Aceptar.

![Crear y usar funciones para agrupar valores numéricos](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-4.png)  
  

Repetimos el proceso para el rango de facturación. Como las dos tablas tienen la misma estructura podemos utilizar la misma función.

![Crear y usar funciones para agrupar valores numéricos](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-invocar-funcion-5.png)  
  

La consulta Empresas tendrá dos nuevas columnas con los identificadores numéricos de las tablas de rango.

### Modelado

Cargamos las tablas en el modelo y las relacionamos usando los campos Id de las dos tablas de clasificación y las nuevas columnas creadas en la tabla Empresas.

Ordenamos la columna Clasificación, en ambas tablas de rango, por el columna Id.

![Crear relaciones del modelo en Power BI Desktop](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dtaXbi-modelopng-2.png)  
  

### Informes

Finalmente, en la vista de informes, creamos dos visualizaciones para mostrar el uso de las clasificaciones.

![Visualización Power BI](/assets/images/posts/2019-05-06-crear-usar-funciones-para-agrupar-valores-numericos/dataXbi-blog-funcion-rango-power-query-3.png)

### Conclusiones

Cuando en nuestro modelo de Power BI necesitemos categorizar valores podemos hacerlo de dos formas distintas en el editor de consultas.

Si el número de categorías en las que agruparemos los valores es pequeño podemos crear una columna condicional utilizando la instrucción if y anidándola tantas veces como filas tenga nuestra tabla de clasificación.

Cuando el número de categorías en las que agruparemos los valores es amplio entonces lo más eficiente es crear una tabla con los rangos y una función personalizada en el editor avanzado que usaremos para crear la columna de clasificación.

Si tenemos varias tablas de clasificación, aunque tengan pocos rangos de categorías, lo mas conveniente será crear una función personalizada, siempre que las tablas tengan la misma estructura, y usarla para todas las clasificaciones.

El archivo PIBX de este ejemplo está disponible en [GitHub](https://github.com/dataxbi/power-query).
