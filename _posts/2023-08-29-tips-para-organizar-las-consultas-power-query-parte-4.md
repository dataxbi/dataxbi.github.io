---
layout: post
title: "Tips para organizar las consultas Power Query – Parte 4"
date: 2023-08-29
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "powerquery"
---

Esta es la cuarta y �ltima entrada del tema de buenas pr�cticas para la organizaci�n de las consultas en el editor de Power Query, donde mostraremos c�mo crear una funci�n personalizada para agrupar varios pasos de una consulta.

La idea es identificar pasos de una consulta que tengan relaci�n entre s�, extraerlos para una funci�n personalizada y luego modificar la consulta para sustituir dichos pasos por uno solo que utilice la funci�n personalizada. Veremos tambi�n c�mo parametrizar la funci�n personalizada para poderla reutilizar en otras consultas o en otros proyectos.

<!--more-->

Los otros art�culos de la serie:

- [Parte 1](https://www.dataxbi.com/blog/2022/12/14/tips-organizar-consultas-power-query-parte1/)
- [Parte 2](https://www.dataxbi.com/blog/2023/04/04/tips-para-organizar-las-consultas-power-query-parte-2/)
- [Parte 3](https://www.dataxbi.com/blog/2023/08/24/tips-para-organizar-las-consultas-power-query-parte-3/)

Vamos a continuar trabajando con las mismas consultas que hemos utilizado en esta serie, y vamos a ir directamente a la consulta _Clientes Transformada_ que est� en la carpeta (o grupo) Transformadas y que pertenece a la capa Staging, seg�n la nomenclatura utilizada en la entrada anterior.

![Consulta Clientes Transformada que tiene varios pasos para calcular la edad del cliente a partir de la fecha de nacimiento.](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-01.png)

Como se observa en la imagen anterior, la consulta _Clientes Transformada_ tiene cuatro pasos para calcular la edad del cliente a partir de la fecha de nacimiento. Dichos pasos se pueden identificar r�pidamente gracias a que en la primera entrada de esta serie le asignamos nombres apropiados.

Queremos ir un poco m�s all� y agrupar estos cuatro pasos en uno solo, y lo haremos creando una funci�n personalizada.

Lo primero que haremos ser� copiar el c�digo M de estos cuatro pasos, para lo cual abriremos la consulta en el editor avanzado.

![C�digo M de la consulta Clientes Transformada](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-02.png)

Copiamos hacia el portapapeles las cuatro l�neas de c�digo M que se muestran en la imagen anterior y que son las que comienzan con el s�mbolo almohadilla (#) seguido de la palabra Edad.

El segundo paso ser� crear una nueva consulta en blanco, como se muestra en la siguiente imagen.

![Crear una nueva consulta en blanco](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-03.png)

Una vez creada la consulta, le cambiamos el nombre a fxCalcularEdad y la abrimos en el editor avanzado, donde pegamos el c�digo M que tenemos en el portapapeles y adem�s le agregamos m�s c�digo para que la consulta quede como se muestra en la imagen siguiente.

![C�digo M de a funci�n personalizada para calcular la edad a partir de la fecha de nacimiento.](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-04.png)

Vamos a describir lo que hemos hecho:

- Las l�neas de la 3 a la 6 son las que copiamos del portapapeles. A la �ltima l�nea copiada, la n�mero 6, le hemos quitada la coma al final, aunque en la imagen no se ve.
- En la l�nea 1 hemos definido que la consulta es una funci�n que tiene un par�metro de entrada con nombre Origen y de tipo table y que dicha funci�n devolver� una tabla.  
    Como se puede apreciar en la imagen, el par�metro Origen se utiliza en el primer paso de la funci�n, en la l�nea 3. 
    Cuando utilicemos la funci�n en la consulta _Clientes Transformada_, veremos que en el par�metro Origen se indicar� el nombre del paso anterior.  
    **Para emplear la t�cnica que estamos describiendo, es importante que la funci�n tenga un par�metro de tipo table y que el resultado de la funci�n tambi�n sea de tipo table.**  
    
- Las l�neas 2 y 7 definen el cuerpo de la funci�n, let ... in.
- La �ltima l�nea, a continuaci�n del in, es el valor devuelto por la funci�n y tiene el nombre del �ltimo paso, que recuerda que debe ser una tabla.

El tercer paso ser� utilizar en la consulta _Clientes Transformada_ la funci�n que hemos creado anteriormente.

Para ello seleccionamos dicha consulta, vamos a los pasos, seleccionamos el primer paso, Origen, con el clic derecho desplegamos el men� auxiliar y escogemos la opci�n "Insertar paso despu�s".

![Insertando un nuevo paso en la consulta Clientes Transformada](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-05.png)

Confirmamos que queremos insertar un nuevo paso.

![Confirmaci�n de que queremos insertar un nuevo paso](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-06.png)

El nuevo paso se crear� justo despu�s del paso Origen y tendr� el nombre Personalizado1. Si miramos en la barra de f�rmula, el c�digo M de dicho paso es simplemente una referencia al paso Origen.

![El nuevo paso ha sido insertado en la consulta Clientes Transformada](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-07.png)

Modificamos el c�digo M del nuevo paso para utilizar la funci�n que creamos anteriormente, pas�ndole como par�metro el paso Origen.

![Utilizando la funci�n fxCalcularEdad en la consulta Clientes Transformada.](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-12.png)

Y comprobamos que al pararnos en el nuevo paso, Personalizado1, en el resultado de la consulta vemos la columna Edad. Sin embargo si nos paramos en un paso posterior, veremos un error debido a que la columna Fecha Nacimiento se borra dentro de la funci�n fxCalcularEdad, y dicha columna es utilizada por los pasos originales para obtener la edad.

Por lo tanto vamos a eliminar los cuatro pasos donde se calculaba la edad y adem�s vamos a cambiar el nombre del paso Personalizado1 por Calcular Edad, para que la consulta quede con solo tres pasos, como se ve en la imagen siguiente.

![Sustituci�n de los cuatro pasos por la funci�n en la consulta Clientes Transformada](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-09.png)

Hasta aqu� lo que hemos logrado es reducir la cantidad de pasos de una consulta a costa de picar un poco de c�digo M. Pero la verdadera ventaja de esta t�cnica es que pudi�ramos reutilizar la funci�n que hemos creado cada vez que tengamos una tabla con una columna de fecha y queramos sustituirla por una columna con la edad. Para que est� funci�n sea realmente reutilizable debemos parametrizar los nombres de las columnas, tanto la columna con la fecha como la columna con la edad. As�, por ejemplo, podr�amos utilizar la misma funci�n aunque las columnas tengan nombres en otro idioma.

Para parametrizar los nombres de las columnas volvemos a abrir la consulta fxCalcularEdad con el editor avanzado y hacemos los cambios que se muestran en la imagen siguiente.

![Paremetrizando las columnas fecha y edad en la funci�n fxCalcularEdad](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-10.png)

Lo que hemos hecho es agregar a la definici�n de la funci�n dos par�metros de tipo text para indicar los nombres de las columnas con la fecha y con la edad. Luego en el cuerpo de la funci�n hemos sustituido en cada l�nea los textos "Fecha Nacimiento" y "Edad" por dichos par�metros.

Ahora si tenemos lista una funci�n que podremos aplicar a otras consultas aunque los nombres de las columnas sean diferentes.

Solo nos queda regresar a la consulta _Clientes Transformada_ para modificar el paso Calcular Edad de manera que se le pasen a la funci�n fxCalcularEdad los nombres de las columnas "Fecha Nacimiento" y "Edad".

![Modificando el paso Calcular Edad de la consulta Clientes Transformada para pasarle a la funci�n los nombres de las clolumnas.](/assets/images/posts/2023-08-29-tips-para-organizar-las-consultas-power-query-parte-4/dataXbi-blog-tips-organizar-consultas-power-query-parte-4-11.png)

A modo de conclusi�n, comentar que el ejemplo que hemos utilizado de calcular la edad tambi�n se podr�a haber resuelto utilizando una funci�n que se le pasara un solo par�metro con la fecha y que devolviera un n�mero entero con la edad. Y utilizar dicha funci�n en una consulta con un paso de agregar funci�n personalizada. Pero hemos preferido hacer la funci�n con un par�metro de tipo table y que devuelva tambi�n una tabla para mostrar una t�cnica que puede servir en muchas situaciones en que queramos agrupar varios pasos de una consulta que tengan relaci�n entre si. Pensar por ejemplo en una situaci�n en que agregamos varios pasos para limpiar una columna o para cambiarle el formato.
