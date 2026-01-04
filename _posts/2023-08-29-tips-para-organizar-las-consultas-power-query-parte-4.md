---
layout: post
title: "Tips para organizar las consultas Power Query - Parte 4"
date: 2023-08-29
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "powerquery"
---

Esta es la cuarta y última entrada del tema de buenas prácticas para la organización de las consultas en el editor de Power Query, donde mostraremos cómo crear una función personalizada para agrupar varios pasos de una consulta.

La idea es identificar pasos de una consulta que tengan relación entre sí, extraerlos para una función personalizada y luego modificar la consulta para sustituir dichos pasos por uno solo que utilice la función personalizada. Veremos también cómo parametrizar la función personalizada para poderla reutilizar en otras consultas o en otros proyectos.

<!--more-->

Los otros artículos de la serie:

- [Parte 1](https://www.dataxbi.com/blog/2022/12/14/tips-organizar-consultas-power-query-parte1/)
- [Parte 2](https://www.dataxbi.com/blog/2023/04/04/tips-para-organizar-las-consultas-power-query-parte-2/)
- [Parte 3](https://www.dataxbi.com/blog/2023/08/24/tips-para-organizar-las-consultas-power-query-parte-3/)

Vamos a continuar trabajando con las mismas consultas que hemos utilizado en esta serie, y vamos a ir directamente a la consulta _Clientes Transformada_ que está en la carpeta (o grupo) Transformadas y que pertenece a la capa Staging, según la nomenclatura utilizada en la entrada anterior.

![Consulta Clientes Transformada que tiene varios pasos para calcular la edad del cliente a partir de la fecha de nacimiento.](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-01.png)

Como se observa en la imagen anterior, la consulta _Clientes Transformada_ tiene cuatro pasos para calcular la edad del cliente a partir de la fecha de nacimiento. Dichos pasos se pueden identificar rápidamente gracias a que en la primera entrada de esta serie le asignamos nombres apropiados.

Queremos ir un poco más allá y agrupar estos cuatro pasos en uno solo, y lo haremos creando una función personalizada.

Lo primero que haremos será copiar el código M de estos cuatro pasos, para lo cual abriremos la consulta en el editor avanzado.

![Código M de la consulta Clientes Transformada](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-02.png)

Copiamos hacia el portapapeles las cuatro líneas de código M que se muestran en la imagen anterior y que son las que comienzan con el símbolo almohadilla (#) seguido de la palabra Edad.

El segundo paso será crear una nueva consulta en blanco, como se muestra en la siguiente imagen.

![Crear una nueva consulta en blanco](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-03.png)

Una vez creada la consulta, le cambiamos el nombre a fxCalcularEdad y la abrimos en el editor avanzado, donde pegamos el código M que tenemos en el portapapeles y además le agregamos más código para que la consulta quede como se muestra en la imagen siguiente.

![Código M de a función personalizada para calcular la edad a partir de la fecha de nacimiento.](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-04.png)

Vamos a describir lo que hemos hecho:

- Las líneas de la 3 a la 6 son las que copiamos del portapapeles. A la última línea copiada, la número 6, le hemos quitada la coma al final, aunque en la imagen no se ve.
- En la línea 1 hemos definido que la consulta es una función que tiene un parámetro de entrada con nombre Origen y de tipo table y que dicha función devolverá una tabla.  
    Como se puede apreciar en la imagen, el parámetro Origen se utiliza en el primer paso de la función, en la línea 3. 
    Cuando utilicemos la función en la consulta _Clientes Transformada_, veremos que en el parámetro Origen se indicará el nombre del paso anterior.  
    **Para emplear la técnica que estamos describiendo, es importante que la función tenga un parámetro de tipo table y que el resultado de la función también sea de tipo table.**  
    
- Las líneas 2 y 7 definen el cuerpo de la función, let ... in.
- La última línea, a continuación del in, es el valor devuelto por la función y tiene el nombre del último paso, que recuerda que debe ser una tabla.

El tercer paso será utilizar en la consulta _Clientes Transformada_ la función que hemos creado anteriormente.

Para ello seleccionamos dicha consulta, vamos a los pasos, seleccionamos el primer paso, Origen, con el clic derecho desplegamos el menú auxiliar y escogemos la opción "Insertar paso después".

![Insertando un nuevo paso en la consulta Clientes Transformada](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-05.png)

Confirmamos que queremos insertar un nuevo paso.

![Confirmación de que queremos insertar un nuevo paso](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-06.png)

El nuevo paso se creará justo después del paso Origen y tendrá el nombre Personalizado1. Si miramos en la barra de fórmula, el código M de dicho paso es simplemente una referencia al paso Origen.

![El nuevo paso ha sido insertado en la consulta Clientes Transformada](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-07.png)

Modificamos el código M del nuevo paso para utilizar la función que creamos anteriormente, pasándole como parámetro el paso Origen.

![Utilizando la función fxCalcularEdad en la consulta Clientes Transformada.](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-12.png)

Y comprobamos que al pararnos en el nuevo paso, Personalizado1, en el resultado de la consulta vemos la columna Edad. Sin embargo si nos paramos en un paso posterior, veremos un error debido a que la columna Fecha Nacimiento se borra dentro de la función fxCalcularEdad, y dicha columna es utilizada por los pasos originales para obtener la edad.

Por lo tanto vamos a eliminar los cuatro pasos donde se calculaba la edad y además vamos a cambiar el nombre del paso Personalizado1 por Calcular Edad, para que la consulta quede con solo tres pasos, como se ve en la imagen siguiente.

![Sustitución de los cuatro pasos por la función en la consulta Clientes Transformada](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-09.png)

Hasta aquí lo que hemos logrado es reducir la cantidad de pasos de una consulta a costa de picar un poco de código M. Pero la verdadera ventaja de esta técnica es que pudiéramos reutilizar la función que hemos creado cada vez que tengamos una tabla con una columna de fecha y queramos sustituirla por una columna con la edad. Para que está función sea realmente reutilizable debemos parametrizar los nombres de las columnas, tanto la columna con la fecha como la columna con la edad. Así, por ejemplo, podríamos utilizar la misma función aunque las columnas tengan nombres en otro idioma.

Para parametrizar los nombres de las columnas volvemos a abrir la consulta fxCalcularEdad con el editor avanzado y hacemos los cambios que se muestran en la imagen siguiente.

![Paremetrizando las columnas fecha y edad en la función fxCalcularEdad](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-10.png)

Lo que hemos hecho es agregar a la definición de la función dos parámetros de tipo text para indicar los nombres de las columnas con la fecha y con la edad. Luego en el cuerpo de la función hemos sustituido en cada línea los textos "Fecha Nacimiento" y "Edad" por dichos parámetros.

Ahora si tenemos lista una función que podremos aplicar a otras consultas aunque los nombres de las columnas sean diferentes.

Solo nos queda regresar a la consulta _Clientes Transformada_ para modificar el paso Calcular Edad de manera que se le pasen a la función fxCalcularEdad los nombres de las columnas "Fecha Nacimiento" y "Edad".

![Modificando el paso Calcular Edad de la consulta Clientes Transformada para pasarle a la función los nombres de las clolumnas.](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-11.png)

A modo de conclusión, comentar que el ejemplo que hemos utilizado de calcular la edad también se podría haber resuelto utilizando una función que se le pasara un solo parámetro con la fecha y que devolviera un número entero con la edad. Y utilizar dicha función en una consulta con un paso de agregar función personalizada. Pero hemos preferido hacer la función con un parámetro de tipo table y que devuelva también una tabla para mostrar una técnica que puede servir en muchas situaciones en que queramos agrupar varios pasos de una consulta que tengan relación entre si. Pensar por ejemplo en una situación en que agregamos varios pasos para limpiar una columna o para cambiarle el formato.
