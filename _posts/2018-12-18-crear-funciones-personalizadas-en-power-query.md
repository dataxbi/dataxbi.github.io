---
layout: post
title: "Crear funciones personalizadas en Power Query"
date: 2018-12-18
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

En la entrada [Transformar datos con Power Query](https://www.dataxbi.com/blog/2018/11/06/transformar-datos-power-query/) vimos que la mayoría de las transformaciones que llevamos a cabo en el editor de consulta las podemos realizar de forma asistida, usando la interfaz gráfica, pero en ocasiones necesitamos crear funciones personalizadas en Power Query para realizar algunas transformaciones que de otra forma no serían posibles.

Para crear funciones personalizadas en Power Query debemos conocer el lenguaje que está por debajo del editor de consultas, informalmente conocido como M.

<!--more-->

## El lenguaje M

M es un lenguaje funcional, sensitivo a mayúsculas y minúsculas por lo que hay que ser cuidadoso con la sintaxis. Incluye una gran cantidad de funciones integradas que podemos utilizar cuando realizamos transformaciones. Las funciones se agrupan en categorías y se les puede pasar parámetros.

Toda la documentación de M, incluyendo las especificaciones del lenguaje, los tipos de datos soportados y las funciones las puedes encontrar en [Power Query M Reference](https://docs.microsoft.com/en-us/powerquery-m/power-query-m-reference).

Si abrimos el editor avanzado de cualquiera de las consultas veremos un conjunto de fórmulas separadas por coma unas de otras y encerradas entre las instrucciones let e in. Cada fórmula constituye un paso de transformación y están formadas por dos partes separadas por el signo â€œ=â€. A la izquierda del signo se declara una variable a la que se le asigna el resultado de evaluar la expresión de la derecha. La expresión puede ser el llamado a una función, ya sea de la biblioteca estándar o nuestra. La mayoría de las veces, cada paso se basa en el resultado del paso anterior refiriéndose a él por el nombre de variable.

A continuación de la instrucción in se escribe el resultado a devolver que por lo general es el nombre de la variable del último paso.

### Ejemplo de sintaxis del lenguaje M

```
 let  Â Â Â  x = 2,  Â Â Â  y = 3,  Â Â Â  z = x + y  in  Â Â Â  z 

```

En el ejemplo se han declarado tres variables: x, y, z. A las dos primeras variables se les ha asignado un valor numérico y al tercera se le ha asignado una expresión que es la suma de los valores contenidos en las otras dos variables. Como resultado se ha devuelto el valor de la última variable.

  

## Funciones

Una función es una asignación de un conjunto de valores de entrada a un solo valor de salida. El valor de salida puede ser un número o un texto, y se puede incluir en un paso como cualquier otra expresión.

### Llamando a una función

El llamado o ejecución de una función se puede realizar desde cualquiera de los pasos de la consulta, en el miembro derecho de la fórmula.

Las funciones se ejecutan usando la siguiente sintaxis:

<nombre\_categoría>.<nombre\_funcion>(<lista de parámetros>)

donde:

<nombre\_categoría> es la categoría a la que pertenece la función.

<nombre\_funcion> es la función que queremos llamar.

<lista de parámetros> son los valores que requiere la función para poder ejecutarse, pueden ser opcionales. Generalmente, el primer parámetro de la función corresponde al valor devuelto por la fórmula del paso anterior.

#### Ejemplo de llamado de función

```
let  Â Â Â  x = 2,  Â Â Â  y = 3,  Â Â Â  z = Number.Power(x,y)  in Â  Â Â  z

```

En este ejemplo se ha usado la función Power en el tercer paso de la consulta. Power pertenece a la categoría Number y devuelve como resultado un número elevado a una potencia. Admite dos parámetros: el valor base y la potencia.

### Declarando una función

En un paso de fórmula podemos usar, además de las funciones de la biblioteca estándar de Power Query, una función personalizada. Podemos crear funciones personalizadas en Power Query dentro de una consulta o como una consulta separada. Si la definimos dentro de una consulta solo podremos usarla en esa consulta. Si por el contrario la escribimos en una consulta separada podremos utilizarla en múltiples consultas.

La declaración de la función consta de una lista de parámetros separados por coma y encerrados entre paréntesis y a continuación el símbolo (=>) que indica que lo que sigue es el cuerpo de la función.

Si la función solo contiene un paso este se escribe a continuación. Si la función requiriera de más de un paso, estos irían encerrados entre let e in y separados por coma.

Finalmente se escribe la instrucción in indicando el resultado a devolver, el nombre de la función.

#### Ejemplo de sintaxis para crear una función:

```
letÂ Â Â  MyFunction1 = (parameter1, parameter2) => (parameter1 + parameter2) / 2Â inÂ Â Â Â  MyFunction1Â 

```

La variable Myfunction1 es el nombre de la función. El cuerpo de la función solo tiene una expresión y se escribe a continuación del símbolo =>

#### Ejemplo de sintaxis de una función con más de un paso:

```
letÂ  Â  MyFunction2 = (parameter1, parameter2) =>Â Â  Â  letÂ Â  Â  Â  Â  value = parameter1 + parameter2,Â Â  Â  Â  Â  result = value / 2Â Â  Â  inÂ Â  Â  Â Â  resultÂ inÂ Â  MyFunction2

```

En este caso la función MyFunction2 contiene dos pasos y van encerrados entre las instrucciones let e in.

La información del tipo de dato se puede incluir de manera explicita en la declaración tanto de los parámetros como del valor de retorno de la función. Si no la incluimos el tipo de datos será implícito. Los valores implícitos son de tipo any, es similar al tipo objeto en otros lenguajes. Todos los tipos en M derivan del tipo any.

#### Ejemplos de sintaxis para crear una función con declaración de tipo:

En el caso de la siguiente función, MyFunction3, tanto los parámetros como el valor de retorno son de tipo number.

```
letÂ  Â  MyFunction3 = (parameter1 as number, parameter2 as number) as number =>Â Â  Â  letÂ Â  Â  Â  Â  value = parameter1 + parameter2,Â Â  Â  Â  Â  result = value / 2Â Â  Â  inÂ Â  Â  Â Â  resultÂ inÂ Â  MyFunction3

```

  
Los parámetros de una función pueden ser opcionales. En estos casos es conveniente chequear si se ha pasado o no valor al parámetro porque podría generarse un error.

#### Ejemplos de sintaxis para crear una función con valores opcionales:

En este ejemplo el parámetro z es opcional. Si no se pasa valor a z le asignamos la cadena en blanco, si no hiciéramos esta comprobación el resultado mostraría un error.

```
letÂ  Â  MyFunction4 = (y as number, optional z as text) as any =>Â Â  Â  letÂ Â  Â  Â  Â  result = Text.From(y) & (if z = null then "" else z)Â  Â  inÂ Â  Â  Â Â  resultÂ inÂ Â  MyFunction4

```

  

## Un ejemplo de crear funciones personalizadas en Power Query

### Problema

Tenemos una consulta que contiene la lista de bebidas y sus precios

![dataXbi-Crear funciones personalizadas en Power Query-consulta-ListadoGin](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-bebidas-precio.png)  
  

y otra con los rangos por precios de las bebidas.

![dataXbi-Crear funciones personalizadas en Power Query-consulta-RangosPrecios](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-rangos-precio.png)  
  

Queremos conocer a qué rango de precios corresponde cada bebida, es decir, para cada fila de la primera consulta debemos buscar el valor correspondiente en la segunda consulta, pero no tenemos forma de combinar ambas consultas porque no tienen ningún elemento en común.

Para resolver este problema crearemos una función en el editor avanzado, que tendrá dos parámetros de entrada, uno con el nombre de la tabla con los rangos de precio y otro con el precio del cual se quiere conocer el rango al que pertenece.

### Solución

1. En el menú Inicio, dentro del grupo Datos externos, desplegamos el menú Obtener datos y escogemos Consulta en blanco.
2. Se crea una nueva consulta en el Editor de Power Query. La consulta contiene con un solo paso, Origen
3. Abrimos el Editor avanzado y sustituimos el código existente por el siguiente:

```
letÂ Â Â  //le asigna a la variable Origen el resultado de evaluar una función que tiene dos parámetros tabla y colÂ Â Â  Origen = (tabla as table, col as number) as number =>Â Â Â Â  //el cuerpo de la funciónÂ Â Â  letÂ Â Â Â Â Â Â  //le asigna a la variable values una lista con las filas de la consulta tablaÂ Â Â Â Â Â Â Â Â  values = Table.ToRows(tabla),Â Â Â Â Â Â Â Â Â Â  //Devuelve la primera columna de la consulta tabla si se cumple que el valor de col está entre los valores de las columnas 1 y 2Â Â Â Â Â Â Â Â Â Â Â Â Â  Result = List.Last(List.Select(values, each _{1} <= col and _{2} > col)){0}Â Â Â Â  //el valor que devuelve la funciónÂ Â Â Â Â Â  in ResultÂ Â Â //devuelve el valor de OrigeninÂ Â Â  Origen

```

5. Oprimimos el botón Listo. En el navegador aparece la función creada.
6. Seleccionamos la consulta Listado Gin.
7. En la cinta de opciones, elegimos la pestaña Agregar columna y dentro del grupo General, Invocar función personalizada.
8. Selecciona la función fx\_rango, la consulta RangosPrecios y la columna Precio de la consulta ListadoGin.
![dataXbi-Crear funciones personalizadas en Power Query-añadir-columna-invocar-funcion-personalizada](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-añadir-columna-invocar-funcion-personalizada.png)10. Se crea una nueva columna y solo queda cambiar el tipo de dato a número entero.
11. Cargamos las dos tablas en el modelo y las relacionamos.

  

Podemos usar la columna Rango en las visualizaciones para filtrar

![dataXbi-Crear funciones personalizadas en Power Query-Visualizacion-con-filtro-rangoprecio](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-Visualizacion-con-filtro-rangoprecio.png)

o agrupar los precios de las bebidas.

![dataXbi-Crear funciones personalizadas en Power Query-visualizacion-con-agrupamiento-rangoprecio](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-visualizacion-con-agrupamiento-rangoprecio.png)

## Conclusiones

El lenguaje M, además de la posibilidad de usar todas las funciones de su biblioteca estándar, nos permite crear funciones personalizadas en Power Query. Estas funciones se pueden definir dentro de una consulta o como una consulta separada y son una forma muy útil de compartir la lógica de negocio entre diferentes pasos en una consulta o entre múltiples consultas.

El archivo PIBX de este ejemplo está disponible en [GitHub](https://github.com/dataxbi/power-query/#ejemplo-de-crear-funci%C3%B3n-personalizada-en-power-query).
