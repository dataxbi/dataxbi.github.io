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

En la entrada [Transformar datos con Power Query](https://www.dataxbi.com/blog/2018/11/06/transformar-datos-power-query/) vimos que la mayor�a de las transformaciones que llevamos a cabo en el editor de consulta las podemos realizar de forma asistida, usando la interfaz gr�fica, pero en ocasiones necesitamos crear funciones personalizadas en Power Query para realizar algunas transformaciones que de otra forma no ser�an posibles.

Para crear funciones personalizadas en Power Query debemos conocer el lenguaje que est� por debajo del editor de consultas, informalmente conocido como M.

<!--more-->

## El lenguaje M

M es un lenguaje funcional, sensitivo a may�sculas y min�sculas por lo que hay que ser cuidadoso con la sintaxis. Incluye una gran cantidad de funciones integradas que podemos utilizar cuando realizamos transformaciones. Las funciones se agrupan en categor�as y se les puede pasar par�metros.

Toda la documentaci�n de M, incluyendo las especificaciones del lenguaje, los tipos de datos soportados y las funciones las puedes encontrar en [Power Query M Reference](https://docs.microsoft.com/en-us/powerquery-m/power-query-m-reference).

Si abrimos el editor avanzado de cualquiera de las consultas veremos un conjunto de f�rmulas separadas por coma unas de otras y encerradas entre las instrucciones let e in. Cada f�rmula constituye un paso de transformaci�n y est�n formadas por dos partes separadas por el signo “=”. A la izquierda del signo se declara una variable a la que se le asigna el resultado de evaluar la expresi�n de la derecha. La expresi�n puede ser el llamado a una funci�n, ya sea de la biblioteca est�ndar o nuestra. La mayor�a de las veces, cada paso se basa en el resultado del paso anterior refiri�ndose a �l por el nombre de variable.

A continuaci�n de la instrucci�n in se escribe el resultado a devolver que por lo general es el nombre de la variable del �ltimo paso.

### Ejemplo de sintaxis del lenguaje M

```
 let      x = 2,      y = 3,      z = x + y  in      z 

```

En el ejemplo se han declarado tres variables: x, y, z. A las dos primeras variables se les ha asignado un valor num�rico y al tercera se le ha asignado una expresi�n que es la suma de los valores contenidos en las otras dos variables. Como resultado se ha devuelto el valor de la �ltima variable.

  

## Funciones

Una funci�n es una asignaci�n de un conjunto de valores de entrada a un solo valor de salida. El valor de salida puede ser un n�mero o un texto, y se puede incluir en un paso como cualquier otra expresi�n.

### Llamando a una funci�n

El llamado o ejecuci�n de una funci�n se puede realizar desde cualquiera de los pasos de la consulta, en el miembro derecho de la f�rmula.

Las funciones se ejecutan usando la siguiente sintaxis:

<nombre\_categor�a>.<nombre\_funcion>(<lista de par�metros>)

donde:

<nombre\_categor�a> es la categor�a a la que pertenece la funci�n.

<nombre\_funcion> es la funci�n que queremos llamar.

<lista de par�metros> son los valores que requiere la funci�n para poder ejecutarse, pueden ser opcionales. Generalmente, el primer par�metro de la funci�n corresponde al valor devuelto por la f�rmula del paso anterior.

#### Ejemplo de llamado de funci�n

```
let      x = 2,      y = 3,      z = Number.Power(x,y)  in      z

```

En este ejemplo se ha usado la funci�n Power en el tercer paso de la consulta. Power pertenece a la categor�a Number y devuelve como resultado un n�mero elevado a una potencia. Admite dos par�metros: el valor base y la potencia.

### Declarando una funci�n

En un paso de f�rmula podemos usar, adem�s de las funciones de la biblioteca est�ndar de Power Query, una funci�n personalizada. Podemos crear funciones personalizadas en Power Query dentro de una consulta o como una consulta separada. Si la definimos dentro de una consulta solo podremos usarla en esa consulta. Si por el contrario la escribimos en una consulta separada podremos utilizarla en m�ltiples consultas.

La declaraci�n de la funci�n consta de una lista de par�metros separados por coma y encerrados entre par�ntesis y a continuaci�n el s�mbolo (=>) que indica que lo que sigue es el cuerpo de la funci�n.

Si la funci�n solo contiene un paso este se escribe a continuaci�n. Si la funci�n requiriera de m�s de un paso, estos ir�an encerrados entre let e in y separados por coma.

Finalmente se escribe la instrucci�n in indicando el resultado a devolver, el nombre de la funci�n.

#### Ejemplo de sintaxis para crear una funci�n:

```
let    MyFunction1 = (parameter1, parameter2) => (parameter1 + parameter2) / 2 in     MyFunction1 

```

La variable Myfunction1 es el nombre de la funci�n. El cuerpo de la funci�n solo tiene una expresi�n y se escribe a continuaci�n del s�mbolo =>

#### Ejemplo de sintaxis de una funci�n con m�s de un paso:

```
let    MyFunction2 = (parameter1, parameter2) =>     let         value = parameter1 + parameter2,         result = value / 2     in        result in   MyFunction2

```

En este caso la funci�n MyFunction2 contiene dos pasos y van encerrados entre las instrucciones let e in.

La informaci�n del tipo de dato se puede incluir de manera explicita en la declaraci�n tanto de los par�metros como del valor de retorno de la funci�n. Si no la incluimos el tipo de datos ser� impl�cito. Los valores impl�citos son de tipo any, es similar al tipo objeto en otros lenguajes. Todos los tipos en M derivan del tipo any.

#### Ejemplos de sintaxis para crear una funci�n con declaraci�n de tipo:

En el caso de la siguiente funci�n, MyFunction3, tanto los par�metros como el valor de retorno son de tipo number.

```
let    MyFunction3 = (parameter1 as number, parameter2 as number) as number =>     let         value = parameter1 + parameter2,         result = value / 2     in        result in   MyFunction3

```

  
Los par�metros de una funci�n pueden ser opcionales. En estos casos es conveniente chequear si se ha pasado o no valor al par�metro porque podr�a generarse un error.

#### Ejemplos de sintaxis para crear una funci�n con valores opcionales:

En este ejemplo el par�metro z es opcional. Si no se pasa valor a z le asignamos la cadena en blanco, si no hici�ramos esta comprobaci�n el resultado mostrar�a un error.

```
let    MyFunction4 = (y as number, optional z as text) as any =>     let         result = Text.From(y) & (if z = null then "" else z)    in        result in   MyFunction4

```

  

## Un ejemplo de crear funciones personalizadas en Power Query

### Problema

Tenemos una consulta que contiene la lista de bebidas y sus precios

![dataXbi-Crear funciones personalizadas en Power Query-consulta-ListadoGin](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-bebidas-precio.png)  
  

y otra con los rangos por precios de las bebidas.

![dataXbi-Crear funciones personalizadas en Power Query-consulta-RangosPrecios](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-rangos-precio.png)  
  

Queremos conocer a qu� rango de precios corresponde cada bebida, es decir, para cada fila de la primera consulta debemos buscar el valor correspondiente en la segunda consulta, pero no tenemos forma de combinar ambas consultas porque no tienen ning�n elemento en com�n.

Para resolver este problema crearemos una funci�n en el editor avanzado, que tendr� dos par�metros de entrada, uno con el nombre de la tabla con los rangos de precio y otro con el precio del cual se quiere conocer el rango al que pertenece.

### Soluci�n

1. En el men� Inicio, dentro del grupo Datos externos, desplegamos el men� Obtener datos y escogemos Consulta en blanco.
2. Se crea una nueva consulta en el Editor de Power Query. La consulta contiene con un solo paso, Origen
3. Abrimos el Editor avanzado y sustituimos el c�digo existente por el siguiente:

```
let    //le asigna a la variable Origen el resultado de evaluar una funci�n que tiene dos par�metros tabla y col    Origen = (tabla as table, col as number) as number =>     //el cuerpo de la funci�n    let        //le asigna a la variable values una lista con las filas de la consulta tabla          values = Table.ToRows(tabla),           //Devuelve la primera columna de la consulta tabla si se cumple que el valor de col est� entre los valores de las columnas 1 y 2              Result = List.Last(List.Select(values, each _{1} <= col and _{2} > col)){0}     //el valor que devuelve la funci�n       in Result   //devuelve el valor de Origenin    Origen

```

5. Oprimimos el bot�n Listo. En el navegador aparece la funci�n creada.
6. Seleccionamos la consulta Listado Gin.
7. En la cinta de opciones, elegimos la pesta�a Agregar columna y dentro del grupo General, Invocar funci�n personalizada.
8. Selecciona la funci�n fx\_rango, la consulta RangosPrecios y la columna Precio de la consulta ListadoGin.
![dataXbi-Crear funciones personalizadas en Power Query-a�adir-columna-invocar-funcion-personalizada](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-a�adir-columna-invocar-funcion-personalizada.png)10. Se crea una nueva columna y solo queda cambiar el tipo de dato a n�mero entero.
11. Cargamos las dos tablas en el modelo y las relacionamos.

  

Podemos usar la columna Rango en las visualizaciones para filtrar

![dataXbi-Crear funciones personalizadas en Power Query-Visualizacion-con-filtro-rangoprecio](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-Visualizacion-con-filtro-rangoprecio.png)

o agrupar los precios de las bebidas.

![dataXbi-Crear funciones personalizadas en Power Query-visualizacion-con-agrupamiento-rangoprecio](/assets/images/posts/2018-12-18-crear-funciones-personalizadas-en-power-query/dataXbi-visualizacion-con-agrupamiento-rangoprecio.png)

## Conclusiones

El lenguaje M, adem�s de la posibilidad de usar todas las funciones de su biblioteca est�ndar, nos permite crear funciones personalizadas en Power Query. Estas funciones se pueden definir dentro de una consulta o como una consulta separada y son una forma muy �til de compartir la l�gica de negocio entre diferentes pasos en una consulta o entre m�ltiples consultas.

El archivo PIBX de este ejemplo est� disponible en [GitHub](https://github.com/dataxbi/power-query/#ejemplo-de-crear-funci%C3%B3n-personalizada-en-power-query).
