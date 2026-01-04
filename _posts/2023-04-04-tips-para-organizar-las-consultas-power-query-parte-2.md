---
layout: post
title: "Tips para organizar las consultas Power Query – Parte 2"
date: 2023-04-04
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "powerquery"
---

Esta es la segunda entrada de una serie de cuatro sobre buenas pr�cticas para la organizaci�n de las consultas en el editor de Power Query. En esta ocasi�n hablaremos de "File Proxy", una t�cnica que consiste en a�adir una capa de consultas que permite separar las consultas de los or�genes de datos. En esta entrada veremos como aplicar esta t�cnica y que beneficios nos reporta.

<!--more-->

Los otros art�culos de la serie:

- [Parte 1](https://www.dataxbi.com/blog/2022/12/14/tips-organizar-consultas-power-query-parte1/)
- [Parte 3](https://www.dataxbi.com/blog/2023/08/24/tips-para-organizar-las-consultas-power-query-parte-3/)
- [Parte 4](https://www.dataxbi.com/blog/2023/08/29/tips-para-organizar-las-consultas-power-query-parte-4/)

Esta t�cnica fue desarrollada por Rui Romano y en el v�deo de YouTube [Power BI Tips, Tricks & Hacks by Rui Romano](https://www.youtube.com/watch?v=xoR-2NjZCCk&t=1198s) puedes encontrar la explicaci�n del autor.

Para demostrar su uso partiremos del PBIX creado en la primera entrada de la serie, [Tips para organizar las consultas Power Query – Parte 1](https://www.dataxbi.com/blog/2022/12/14/tips-organizar-consultas-power-query-parte1/), donde estuvimos hablando de cuatro pasos que consideramos b�sicos: par�metros, carpetas, renombrar pasos y a�adir descripciones. En este punto te sugiero que si todav�a no has le�do la entrada, lo hagas ahora antes de continuar con la lectura.

Para recordar en que punto nos hab�amos quedado te dejo la siguiente imagen donde puedes ver como quedaron organizadas las consultas en el Editor de Power Query una vez aplicadas las recomendaciones.

  
  
![dataXbi Resultado primera entrada](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Tips1-Resultados.png)  
  

El origen de datos es un archivo Excel de nombre **ventas** que est� ubicado en una carpeta de SharePoint. A partir de las 7 hojas que contiene el archivo se crearon igual n�mero de consultas, de las cu�les 5 se cargan en el modelo, las otras dos son consultas intermedias que se utilizaron para crear la consulta Productos.

Si seleccionamos el paso Origen de cualquiera de las 7 consultas veremos que es el mismo para todas y contiene la conexi�n al archivo Excel ventas como puedes ver en la siguiente imagen:

  
  
![dataXbi-consulta conexi�n archivo excel](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-consulta-conexion-archivo-excel.png)  
  

Este paso nos devuelve como resultado el contenido del archivo Excel.

  
  
![dataXbi Origen Consultas](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Resultado-Tips-Parte2-Origen.png)  
  

## Aplicando la t�cnica "File Proxy" a nuestro informe

Para implementar esta t�cnica lo que haremos es crear una nueva consulta, a la que llamaremos Ventas Maestra. Esta consulta contiene la conexi�n al origen de datos, es decir, el paso Origen de la consulta anterior. A continuaci�n, cambiaremos el paso Origen de cada una de las consultas originales, en lugar de la conexi�n al origen de datos contendr�n una referencia a Ventas Maestra y nos quedar� una arquitectura como la que se muestra en la imagen.

![dataXbi arquitectura File Proxy](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-arquitectura.png)

Para ello nos situamos en el paso Origen de cualquiera de las consultas, en este ejemplo crearemos la nueva consulta a partir de la consulta Categor�as, pero ser�a igual desde cualquiera de las que ya existen. Seleccionaremos el paso Origen y copiamos la expresi�n de la barra de f�rmulas.

  
  
![dataXbi Transformaci�n Paso Origen](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Copiar-Transformacion-Paso-Origen.png)  
  

A continuaci�n, seleccionamos Nuevo Origen | Consulta en blanco

  
  
![dataXbi Nueva Consulta en Blanco](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Nueva-Consulta-EnBlanco.png)  
  

Pegamos el c�digo en la barra de f�rmulas, renombramos la consulta como Ventas Maestra, le deshabilitaremos la carga y creamos una carpeta para guardar la consulta, como se muestra en la imagen:

  
  
![dataXbi - Consulta Maestra Carpeta Maestra](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Consulta-Maestra-Carpeta-Maestra.png)  
  

Lo siguiente ser� modificar el paso Origen de cada una de las 7 consultas originales para que en lugar de conectarse al archivo Excel hagan referencia a la consulta maestra. Lo mostraremos en el caso de la consulta Categorias. Seleccionamos la consulta Categorias y en el panel de configuraci�n de la consulta seleccionamos el paso Origen y reemplazamos la instrucci�n con una referencia a la consulta Ventas Maestra.

  
  
![dataXbi Sustituir Paso Origen-por Consulta Maestra](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Sustituir-Paso-Origen-por-Consulta-Maestra.png)  
  

Podemos observar que el resto de los pasos no muestra error y se obtiene el mismo resultado que antes de cambiar el paso Origen.

  
  
![dataXbi Sustituir Paso Origen-por Consulta Maestra Resultado](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Sustituir-Paso-Origen-por-Consulta-Maestra-Resultado.png)  
  

La consulta Categorias ya no hace referencia al archivo Excel sino a la consulta Ventas Maestra y solo la consulta Ventas Maestra contiene la conexi�n al archivo Excel.

Aqu� podemos ver una ventaja de aplicar esta t�cnica: cualquier modificaci�n del nombre del archivo o su ubicaci�n solo afectar�a a la consulta maestra, el resto de las consultas se mantendr�an invariables.

Repetimos este paso para el resto de las consultas originales: Subcategorias, Productos, Clientes, Tiendas, Vendedores y Ventas.

Para este informe contamos con un segundo origen de datos, la carpeta de Presupuestos a la que todav�a no nos hemos conectado. Es una carpeta de SharePoint y vamos a conectarnos a ella creando una consulta maestra con la referencia al origen de datos y a la que llamaremos Presupuestos Maestra:

En Inicio, Nuevo Origen escojamos Carpeta de SharePoint:

  
  
![dataXbi Nuevo Origen Carpeta SharePoint](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Nuevo-Origen-Carpeta-SP.png)  
  

En el cuadro de di�logo Carpeta de SharePoint utilizamos el par�metro SharePoint URL

  
  
![dataXbi Nuevo Origen Carpeta SharePoint](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Nuevo-Origen-SP.png)  
  

A continuaci�n, oprimimos el bot�n Transformar datos:

  
  
![dataXbi Carpeta SharePoint transformar datos](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Origen-Carpeta-SP-Transformar-datos.png)  
  

Cambiamos el nombre de la consulta resultante por Presupuestos Maestra y filtramos la columna Folder Path.

  
  
![dataXbi Renombrar consulta](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Origen-Carpeta-SP-renombrar-consulta.png)  
  

Para filtrar la consulta utilizamos el par�metro Presupuestos Carpeta creado previamente:

  
  
![dataXbi Nuevo Origen SP Filtrar Carpeta](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Nuevo-Origen-SP-Filtrar-Carpeta.png)  
  

Guardamos la consulta en la carpeta Maestras y le deshabilitamos la carga.

  
  
![dataXbi Consulta Presupuestos Maestra](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Consulta-Presupuestos-Maestra.png)  
  

Finalmente creamos la consulta Presupuestos referenciando la consulta Presupuestos Maestra. Esta consulta se cargar� en el modelo.

  
  
![dataXbi Referenciar Consulta Presupuestos Maestra](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Referenciar-Consulta-Presupuestos-Maestra.png)  
  

Le cambiamos el nombre a la consulta por Presupuestos, la guardamos en la carpeta Modelo, dentro de la subcarpeta Hechos y revisamos que la carga est� habilitada.

  
  
![dataXbi estructura final Tips2](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-estructura-final.png)  
  

Ya estamos listos para cargar las tablas en el modelo.

Destacar que a pesar de que el n�mero de consultas ha crecido esto no crea ning�n problema porque nuestras consultas est�n organizadas y solo se cargan al modelo las consultas necesarias como se puede apreciar en la siguiente imagen.

  
  
![dataXbi modelo datos](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-modelo-datos.png)  
  

## Utilizar la t�cnica "File Proxy" para intercambiar el origen de los datos entre Excel y SQL Server

Podemos afirmar que el uso de esta t�cnica ayuda a mejorar nuestra productividad, por ejemplo, si necesitamos cambiar el tipo de origen de datos de una carpeta de SharePoint a una base de datos SQL, o de un ambiente de desarrollo a uno de producci�n solo ser� necesario modificar la consulta maestra, el resto de las consultas como no contienen la conexi�n al origen permanecen inalterables, siempre que hayamos dise�ado bien el resto de pasos.

El siguiente dise�o de consultas permite cambiar f�cilmente del origen de datos Excel al origen de datos base de datos SQL Server y viceversa.

  
  
![dataXbi Consulta Maestra con par�metro](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-arquitectura-con-consulta-Maestra-parametro-1.png)  
  

Para implementarlo hemos creado una consulta maestra para el origen de datos SQL Server a la que hemos llamado Ventas Maestra SQL, le hemos cambiado el nombre a la consulta Ventas Maestra por Ventas Maestra Excel y hemos creado una nueva consulta en blanco a la que llamamos Ventas Maestra, como se ve en la imagen.

  
  
![dataXbi consulta SQL Maestra](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-consulta-SQL-Maestra-1.png)  
  

Tambi�n hemos creado un par�metro al que llamamos Tipo Origen. Este par�metro lo utilizamos en la consulta Ventas Maestra y es el que nos permitir� cambiar el tipo de origen de SharePoint a SQL Server y viceversa sin que tengamos que modificar la consulta, solo el valor del par�metro.

El par�metro Tipo Origen, es un par�metro de tipo texto y los valores que puede tomar se han definido en una lista. Estos valores son: Excel y SQL. Debajo tienes una imagen con la configuraci�n del par�metro.

  
  
![dataXbi par�metro consulta tipo origen](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-parametro-consulta-tipo-origen.png)  
  

En la siguiente imagen puedes ver la consulta Ventas Maestra. Si te fijas en la imagen esta consulta solo contiene un �nico paso y es una instrucci�n if que en dependencia del valor del par�metro Tipo Origen decidir� que origen de datos utilizar: SQL o Excel.

  
  
![dataXbi Consulta Ventas Maestra](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-consulta-Ventas-Maestra.png)  
  

Modificamos el resto de consultas para que hagan referencia a Ventas Maestra en lugar de Ventas Maestra Excel. El resto de pasos de estas consultas no necesita ser modificado, las transformaciones realizadas en ellos son independientes del origen de datos utilizado siempre que tengan la misma estructura.

Tambi�n es importante aclarar que a pesar de que la consulta original se ha separado en 2 el plegado de consultas no se interrumpe en el caso de que el origen lo permita y que ninguno de los pasos aplicados lo rompa.

  
  
![dataXbi Plegado consulta Vendedores](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-Plegado-consulta-Vendedores.png)  
  

Debajo tienes la imagen de la consulta SQL de Vendedores. Es una de las que referencian a Ventas Maestra y f�jate como podemos ver la consulta nativa que se genera en el �ltimo paso ya que se mantiene el plegado de consultas.

  
  
![dataXbi consulta Vendedores Query Folding](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-consulta-Vendedores-Query-Folding.png)  
  

## Utilizar la t�cnica "File Proxy" para simplificar la configuraci�n de los or�genes de datos en la puerta de enlace del servicio de Power BI

Otra ventaja que ofrece la aplicaci�n de esta t�cnica es a la hora de configurar los or�genes de datos en el servicio de Power BI. Si publicamos un informe que se conecte a varios archivos Excel que est�n en la misma carpeta tendr�amos que configurar en la puerta de enlace un origen de datos para la carpeta y asignarlo a cada consulta como se muestra en la siguiente imagen:

  
  
![dataXbi conexi�n GTW consultas](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-conexion-GTW-consultas.png)  
  

En cambio si en el informe se hubiera creado una consulta maestra que tuviera la carpeta como origen de datos solo necesitamos a�adir el origen de datos carpeta a la puerta de enlace y asignarlo a la carpeta como se muestra en la imagen siguiente.

  
  
![dataXbi conexion GTW consulta maestra](/assets/images/posts/2023-04-04-tips-para-organizar-las-consultas-power-query-parte-2/dataXbi-conexion-GTW-consulta-maestra.png)
