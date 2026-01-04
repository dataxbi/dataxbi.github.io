---
layout: post
title: "Transformar datos con Power Query"
date: 2018-11-06
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

Al desarrollar un proyecto de BI con [Microsoft Excel](https://products.office.com/en/excel) o [Microsoft Power BI Desktop](https://powerbi.microsoft.com/es-es/desktop/), debemos comenzar con los siguientes pasos:

1. conectarnos a los or�genes de datos
2. transformar los datos
3. cargar los datos en el modelo.

<!--more-->Muchos usuarios realizan los pasos 1 y 3 pero olvidan el 2. Esto probablemente se deba, en primer lugar, a que la opci�n por defecto, es Cargar y no Editar y, en segundo lugar, a que la opci�n Editar no es la primera que se muestra.

En Power BI Desktop la opci�n Cargar es la primera y aparece resaltada con color de fondo amarillo lo que indica que es la opci�n por defecto:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image.png)

  

En Excel tambi�n la opci�n Cargar es la primera. Aparece resaltada con el color de letra en verde, indicando que es la opci�n por defecto:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-1.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-1.png)

  

Si nuestro origen de datos no es un almac�n de datos ni una base de datos de An�lisis Service, lo m�s probable es que los datos no est�n listos para ser usados.

Los or�genes de datos pueden ser diversos, dependiendo de las aplicaciones que utilicemos pueden ser: archivos Excel, de texto, bases de datos, etc. Probablemente la informaci�n este duplicada y no sea consistente. Mucha informaci�n se introduce manualmente y puede ser incongruente o contener errores ortogr�ficos. Puede que los or�genes no garanticen la integridad de los datos. En todos estos casos ser� necesario hacer transformaciones hasta que los datos tengan el formato adecuado.

El lugar donde ocurren esas transformaciones es el Editor de consultas, desde conectarnos a los datos hasta  c�rgalos en el modelo, y debemos conocerlo muy bien.

## El Editor de consultas

En Power BI Desktop accedemos al Editor de consultas desde la pesta�a Inicio. En Excel lo hacemos desde la pesta�a Datos.

Si seleccionamos abrir el Editor de consultas desde Excel se abre la siguiente ventana:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-2.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-2.png)

  

Desde Power BI Desktop, la ventana que se muestra es como la de la siguiente imagen:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-3.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-3.png)

  

Podemos observar que los dos editores mantienen la misma estructura y que solo cambian de posici�n algunas opciones del men�. Es por esto que para examinar sus caracter�sticas utilizaremos solamente el editor de Power BI Desktop.

### Elementos que componen al Editor de consulta

| **Barra de t�tulo** | Muestra el nombre de la consulta y nos da la opci�n de guardar las transformaciones que se hayan aplicado. |
| --- | --- |
| **Cinta de opciones** | Agrupa las transformaciones que se pueden realizar usando el dise�ador. |
| **Navegador** | Muestra las consultas que se han obtenido |
| **Barra de f�rmula** | Muestra la f�rmula aplicada al paso que est� seleccionado en el panel de Configuraci�n de consultas. |
| **Panel de resultados** | Muestra una tabla con los valores obtenidos despu�s de aplicar la transformaci�n del paso seleccionado. |
| **Panel de detalles** | Si seleccionamos una fila o celda de la tabla de resultados se mostrar�n sus detalles. Cada columna se mostrar� como una fila. |
| **Barra de estado** | La barra de estado nos indica el n�mero de filas de la tabla de resultados sino excede el valor 1000 y el n�mero de columnas, as� como otros detalles del origen de la consulta. |
| **Panel de configuraci�n de consulta** | En este panel se pueden ver y modificar todas las transformaciones que se han aplicado a la consulta seleccionada. |

### Panel de configuraci�n de consultas

El panel de configuraci�n de consultas est� dividido en dos grupos: Propiedades y Pasos aplicados.

#### Grupo Propiedades

Desde aqu� podemos cambiar tanto el nombre como la descripci�n de la consulta as� como habilitar la carga y la actualizaci�n de la consulta en el modelo.

#### Grupo Pasos aplicados

Cada transformaci�n que apliquemos a una consulta se convierte en un paso dentro del panel de configuraci�n. Los pasos se ejecutan cada vez que se actualice el modelo y el orden en que se ejecutan es el orden en que se muestran en este grupo.

Podemos configurar los pasos de la consulta usando el men� contextual asociado a cada paso que podemos ver en la siguiente imagen. Podremos cambiar el orden en que se ejecutan los pasos, eliminar algunos pasos, a�adir nuevos pasos, etc..

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-4.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-4.png)

  

#### La barra de f�rmulas

Al seleccionar un paso en el panel de configuraci�n de consulta, podemos ver que en la barra de f�rmulas aparece una expresi�n que comienza con el signo igual “=”.

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-5.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-5.png)

  

En la imagen anterior la expresi�n es la siguiente:

{% raw %}$([char]0x000A)= Table.RenameColumns(#"Redondeado a la baja",{{"BirthDate", "Edad"}})$([char]0x000A){% endraw %}

Es una f�rmula escrita en el lenguaje de f�rmulas de Power Query, conocido informalmente como **M**. Es un lenguaje funcional que est� optimizado para generar consultas altamente flexibles de or�genes de datos diversos, sensible a las may�sculas y min�sculas, similar a F#.

Cada paso del editor de consulta se corresponde con una f�rmula del lenguaje M. Para ver y modificar todos los pasos de una consulta podemos auxiliarnos de la barra de f�rmulas y del Editor avanzado, que podemos encontrar en la cinta de opciones, en las pesta�as Inicio y Vista.

#### El editor avanzado

Con el Editor avanzado podemos crear cada uno de los pasos sin necesidad de usar el asistente, escribiendo cada f�rmula con la transformaci�n correspondiente como se puede apreciar en la siguiente imagen.

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-6.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-6.png)

  

Casi todas las transformaciones se pueden hacer desde la interfaz gr�fica, solo algunas m�s complejas tendr�n que escribirse desde aqu�. Tambi�n lo podr�n hacer de esta forma los que prefieren tener el control total del c�digo que se genera.

En pr�ximas entradas cubriremos los elementos fundamentales de este lenguaje as� como algunas de las funciones que podemos usar.

  

## Transformaciones de datos

Cada consulta que se crea conect�ndose a un origen de datos contiene por lo menos 2 transformaciones que se crean autom�ticamente. La primera contiene la informaci�n del origen de datos y la segunda los datos seleccionados en ese origen, si contiene m�s de uno.

A partir de aqu� ya depende si el origen es una base de datos o no. Si el origen fuera una base de datos, como en el ejemplo de la imagen anterior, los nombres y tipo de cada campo de la tabla estar�an definidos y no har�an falta m�s transformaciones. En otro caso, se a�adir�an dos nuevas transformaciones al panel de configuraci�n de consulta, uno para asignar nombre a cada campo y otro para identificar el tipo de dato que almacena cada campo.

Para detectar el tipo de dato de forma autom�tica se tienen en cuenta las primeras 200 filas del campo. Esto puede generar errores porque puede ser que las primeras 200 filas contengan valores de tipo num�rico, pero despu�s de la fila 200, puede ser que el valor de algunas filas sea un texto y ocurra un error de conversi�n de tipo. Puede desactivar la detecci�n de tipo autom�tico en  las opciones de configuraci�n de Power BI Desktop y realizar este paso manualmente.

Todas las transformaciones que realizamos se muestran en forma de pasos en el panel de configuraci�n de consultas y quedan almacenadas como parte del modelo. De manera que cuando los datos se modifiquen o actualicen bastar� con ejecutar nuevamente estos pasos y est�s modificaciones y actualizaciones se reflejar�n en el modelo.

Las transformaciones se pueden crear a nivel de columna, de fila o de toda la tabla y se agrupan en distintas categor�as y men�s.

## Tipos de transformaciones

### Transformaciones que se pueden aplicar a columnas de tipo texto:

- eliminar espacios en blanco al inicio y final de cada texto
- eliminar caracteres no imprimibles, como consecuencia se eliminan posibles incongruencias de los datos
- dividir columna usando un delimitador o una cantidad de caracteres fijos
- combinar columnas usando un delimitador
- extraer un rango de caracteres
- a�adir prefijos y sufijos
- dar formato a las letras (may�sculas, min�scula, tipo oraci�n, etc.)
- longitud del texto

### Transformaciones que se pueden aplicar a columnas de tipo num�ricas:

- suma, resta multiplicaci�n, divisi�n de un valor
- redondear valor
- obtener su valor absoluto, potencia, ra�z cuadrada, logaritmo, factorial
- determinar la parida y el signo
- valor trigonom�trico: seno, coseno, tangente, etc.
- funciones de agregado (m�ximo, m�nimo, promedio, etc.)

### Transformaciones que se pueden aplicar a columnas de tipo fecha y hora:

- devolver el a�o, el mes, el d�a de una columna de fecha
- retornar la hora, minutos y segundos de una columna de fecha y hora.
- devolver la antigüedad de una fecha (calcula la diferencia con la fecha de hoy)
- calcular la diferencia entre dos fechas, el resultado es una columna de tipo Duration, que contiene la cantidad de d�as, horas, minutos, segundos y mili segundos transcurridos.

### Transformaciones que se pueden aplicar a columnas de tipo Duration:

- devolver el total en d�as o minutos o segundos o a�os o etc.

### Transformaciones que se pueden realizar a cualquier columna:

- mostrar u ocultar
- eliminar, as� evitamos cargar datos innecesarios
- duplicar
- mover la posici�n dentro de la tabla
- ordenar
- detectar tipo de dato
- cambiar tipo de dato
- cambiar nombre
- reemplazar valores, as� podemos sustituir todos los valores en blanco
- reemplazar errores, as� no habr� errores a la hora de cargar los datos
- rellenar, como consecuencia se reemplazan celdas vac�as con un valor por defecto
- convertir en lista
- dinamizar o anular la dinamizaci�n de la columna

### Transformaciones que se pueden realizar sobre las filas de una tabla:

- eliminar filas: superiores, inferiores o alternas, duplicadas, con errores y filas en blanco
- conservar solo filas, superiores, inferiores o intervalo, duplicadas o con errores
- dinamizar o anular la dinamizaci�n de la columna
- filtrar filas, as� evitamos cargar datos innecesarios

### Transformaciones que se pueden realizar sobre la tabla:

- agregar columna personalizada, condicional, �ndice, a partir de ejemplos o de invocar una funci�n
- agrupar, como consecuencia los datos estar�n m�s resumidos
- usar primera fila como encabezado
- transponer
- invertir filas
- contar filas
- combinar y anexar consultas
- duplicar
- referencia
- eliminar
- cambiar el nombre
- mover de posici�n en el panel de navegaci�n
- agrupar en carpetas
- copiar la tabla

## ¿Donde se encuentran las transformaciones?

Todas estos tipos de transformaciones se pueden encontrar en las distintas pesta�as de la cinta de opciones y tambi�n en los men�s contextuales de los diferentes elementos.

Por ejemplo, para cada consulta del panel de navegaci�n tenemos un men� contextual con transformaciones fundamentalmente a nivel de tabla:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-7.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-7.png)

Sobre el conjunto de resultados se pueden aplicar un grupo amplio de transformaciones  si oprimimos el bot�n [![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-8.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-8.png), en el extremo izquierdo de la fila de encabezamientos de columnas. Como podemos observar en la siguiente imagen las transformaciones corresponden fundamentalmente a filas y columnas:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-9.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-9.png)

  

Al seleccionar una columna podemos acceder a su men� contextual y por lo tanto aplicar cualquiera de las transformaciones de columna:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-10.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-10.png)

  

Cuando seleccionamos una celda tambi�n tenemos un men� contextual asociado:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-11.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-11.png)

  

Por �ltimo, las opciones Inicio, Transformar y Agregar columna de la cinta de opciones contiene las pesta�as donde se agrupan todas las transformaciones disponibles a nivel visual:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-12.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-12.png)

  

Como resultado de conectarnos a alg�n tipo de origen de datos pueden a�adirse nuevas pesta�as a la cinta de opciones. Un ejemplo de ello es cuando conectamos con Analysis Services:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-13.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-13.png)

  

Tambi�n puede ocurrir como consecuencia de alguna transformaci�n que realicemos, como cuando agregamos una consulta nueva a partir de una columna:

[![image](/assets/images/posts/2018-11-06-transformar-datos-power-query/image_thumb-14.png "image")](https://www.dataxbi.com/wp-content/uploads/2018/11/image-14.png)

  

Casi todas las transformaciones se pueden hacer desde la interfaz gr�fica, solo algunas m�s complejas tendr�n que escribirse desde la barra de f�rmulas o desde el editor avanzado por lo que es muy importante al menos conocer la sintaxis del lenguaje de consultas.

## Conclusiones

Para finalizar la entrada solo queremos mencionar los aspectos m�s significativos a tener en cuenta cuando nos conectamos a un nuevo origen de datos:

- Los datos pueden ser inconsistentes y tener incongruencias sobre todo si proceden de diversos or�genes en consecuencia necesitan ser limpiados y transformados antes de cargarlos en el modelo.
- Las transformaciones se llevan a cabo en el editor de consultas y podemos aplicarlas a nivel de tabla, fila y/o columna.
- Las transformaciones se almacenan en el modelo en forma de pasos que se ejecutan de manera consecutiva, en el orden en que se muestran en el panel de configuraci�n de consulta y podr�n ejecutarse cada vez que las fuentes de datos se actualicen.
