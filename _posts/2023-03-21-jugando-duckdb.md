---
layout: post
title: "Jugando con DuckDB"
date: 2023-03-21
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "python"
  - "sql"
---

Este es mi primer acercamiento a DuckDB, un gestor de base de datos SQL concebido para tareas anal�ticas (OLAP) que es muy peque�o pero muy potente y adem�s es de c�digo abierto.

<!--more-->

Quiero compartir en esta entrada de blog varias cosas que he probado:

- La aplicaci�n Tad que es un visor de ficheros CSV y Parquet y que utiliza DuckDB
- Utilizar DuckDB para hacer una consulta SQL a un fichero Parquet remoto (HTTP)
- Crear una base de datos en DuckDB a partir de ficheros Parquet y CSV
- Utilizar DuckDB para convertir ficheros CSV a Parquet desde la l�nea de comandos
- Utilizar DuckDB desde Python para hacer una consulta SQL sobre una carpeta con ficheros Parquet
- Tambi�n desde Python, utilizar DuckDB para hacer una consulta SQL donde se combinen dos DataFrame pandas

## ¿Qu� es DuckDB?

Como dec�a al inicio, [DuckDB](https://duckdb.org/) es un gestor de base de datos muy peque�o porque ha sido creado para que se pueda ejecutar dentro de cualquier aplicaci�n. Si conoces SQLite, son similares en este aspecto. Pero se diferencia de SQLite en que los datos se almacenan en columnas porque DuckDB est� concebido para hacer tareas de an�lisis de datos, donde la agregaci�n de los datos de las columnas tiene un gran peso.

Una caracter�stica muy importante de DuckDB es que es muy r�pido tanto cargando los datos como ejecutando las consultas SQL, porque utiliza una tecnolog�a que optimiza el uso del CPU. Yo conoc� DuckDB por las publicaciones de [Mimoune Djouallah](https://twitter.com/mim_djo) y �l ha hecho varias demostraciones de la velocidad de procesamiento de DuckDB.

Adem�s, DuckDB es capaz de ejecutar consultas directamente sobre ficheros Parquet o CSV.

## Tad

Comenzar� este recorrido mencionando la aplicaci�n de escritorio Tad que utiliza internamente DuckDB para leer, visualizar y filtrar ficheros Parquet y CSV y tambi�n las tablas de bases de datos DuckDB y MySQL. Tad es multiplataforma, gratuita y de c�digo abierto y la puedes descargar desde [https://www.tadviewer.com/](https://www.tadviewer.com/).

Esta aplicaci�n me parece genial para explorar los ficheros porque los datos se cargan muy r�pido y se pueden filtrar aplicando criterios sobre las columnas. Adem�s se pueden agrupar varias columnas y hacer operaciones de agregaci�n para construir una tabla pivote. Luego los datos filtrados se pueden exportar a un fichero CSV.

En la imagen se puede ver una tabla pivote de un fichero Parquet con los datos de los viajes de los taxis amarillos de New York, donde se han agrupado las columnas del sitio de salida y el sitio de llegada y se han calculado los promedios del importe total de viaje, la distancia y el n�mero de pasajeros.

![Tad - Un visor de ficheros Parquet y CSV que utiliza DuckDB](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-Tad-parquet-pivot.png)

## Consulta SQL a un fichero Parquet remoto (HTTP)

En la siguiente parada de este recorrido voy a utilizar el cliente de l�nea de comando (CLI) de DuckDB, que se puede descargar desde [https://duckdb.org/docs/installation/index](https://duckdb.org/docs/installation/index). No hace falta instalarlo, s�lo expandir el ZIP y copiar el ejecutable para una carpeta. Luego abrimos una l�nea de comandos desde la carpeta y ejecutamos el programa duckdb.exe y nos aparecer� un _prompt_ donde podremos ejecutar comandos SQL y otros comandos de control. Si has usado el CLI de SQLite, este te resultar� familiar.

![Cliente de l�nea de comando (CLI) de DuckDB](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-CLI.png)

He ejecutado una consulta SQL contra uno de los fichero Parquet con los datos de los viajes de los taxis de New York, sin cargarlos en la base de datos. Y para hacerlo m�s interesante he consultado el fichero directamente desde el origen, sin descargarlo a una carpeta local. Para ello he usado una de las [extensiones](https://duckdb.org/docs/extensions/overview) que est�n disponibles para DuckDB, en este caso la extensi�n HTTPFS con la cual podemos usar un URL para indicar la ruta al fichero.

En la imagen muestro una captura de pantalla con los comandos que he usado en el CLI. En las dos primeras l�neas se instala y se carga la extensi�n HTTPFS. En el resto de las l�neas est� la consulta SQL donde se agrupan los datos por el sitio de salida y el sitio de llegada y se calculan los promedios del importe del viaje y de la distancia recorrida, y se ordenan por el promedio de la distancia, de mayor a menor. En el FROM de la consulta SQL he usado la funci�n `read_parquet()` de DuckDB, que recibe como argumento la ruta al fichero Parquet, y que en este caso gracias a la extensi�n HTTPFS es un URL. En la imagen tambi�n se ven los resultados de la consulta.

![Captura de pantalla de los comandos en el CLI de DuckDB para hacer una consulta SQL contra un fichero Parquet remoto usando la extensi�n HTTPFS. Tambi�n se ve el resultado de la consulta.](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-CLI-SQL-parquet-https.png)

## Crear una base de datos en DuckDB a partir de ficheros Parquet y CSV

Me mantengo en el CLI para crear una base de datos DuckDB con dos tablas, una tabla para guardar los datos de los viajes de los taxis y otra tabla para guardar el listado de los sitios de salida y llegada. Los datos de la primera tabla se cargar�n desde 12 ficheros Parquet con los viajes de los taxis en el a�o 2021, un archivo por mes. Mientras que para los datos de la segunda tabla utilizar� un fichero CSV. Todos los ficheros est�n en una carpeta local.

Estos son los comandos que he utilizado para crear la base de datos y las tablas:

`.open taxis.duckdb`  
Este comando crea una base de datos, que se guardar� en un fichero con el nombre `taxis.duckdb` en la carpeta local. O si ya exist�a un fichero con este nombre, se cargar� la base de datos. El punto delante de `open` indica que es un comando especial del CLI y no una expresi�n SQL.

`CREATE TABLE trips AS SELECT * FROM 'data/yellow_tripdata_2021-*.parquet';`  
Esta expresi�n SQL crea la tabla `trips` a partir de los ficheros Parquet. En el `FROM` se indica directamente una ruta, que incluye un asterisco para que se lean todos los ficheros que cumplan con el patr�n. Los nombres y los tipos de las columnas de la tabla se toman de los metadatos de los ficheros Parquet. Adem�s de crear la tabla, se cargan los datos de todos los ficheros. En el CLI, las expresiones SQL siempre tienen que terminar con un punto y coma.

`CREATE TABLE locations AS SELECT * FROM read_csv_auto('data/taxi+_zone_lookup.csv');`  
Esta expresi�n SQL crea la tabla `locations` a partir de un fichero CSV. La funci�n de DuckDB `read_csv_auto()` analiza el fichero CSV para extraer los nombres de las columnas y estimar los tipos de datos.

![Creando una base de datos con el CLI de DuckDB. La base de datos se llama taxis.duckdb y se han creado las tablas trips y locations usando un comando SQL create as select.](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-CLI-SQL-create-table.png)

Una vez creada la base de datos y cargados los datos, he hecho una consulta SQL donde se combinan ambas tablas para mostrar el importe promedio y la distancia promedio entre cada sitio de salida y de llegada.

![Haciendo una consulta SQL a la base de datos creada, para mostrar el importe promedio y la distancia promedio entre cada sitio de salida y de llegada.](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-CLI-SQL-select-tables.png)

## Utilizar DuckDB para convertir ficheros CSV a Parquet desde la l�nea de comandos

En esta nueva parada del recorrido voy a utilizar DuckDB para convertir un fichero CSV a Parquet. Y lo har� directamente desde la l�nea de comandos, en lugar de hacerlo de manera interactiva entrando al CLI de DuckDB.

Para ello, he abierto una l�nea de comandos en la carpeta donde tengo copiado `duckdb.exe` y donde tambi�n tengo un fichero CSV y he ejecutado este comando:  
`duckdb.exe -s "copy (select * from read_csv_auto('./yellow_tripdata_2021-01.csv')) to './yellow_tripdata_2021-01.parquet' (format parquet);"`

El par�metro `-s` le indica a `duckdb.exe` que ejecute el comando que viene a continuaci�n. El comando, que est� entre comillas dobles, tiene dos partes:

- Con la expresi�n `select * from read_csv_auto('./yellow_tripdata_2021-01.csv')` se leen todos los datos del fichero CSV
- Con la expresi�n `copy ... to './yellow_tripdata_2021-01.parquet' (format parquet)` se guardan los datos en un fichero Parquet

En la imagen siguiente se puede ver la ejecuci�n del comando, y a continuaci�n la ejecuci�n de otro comando con una consulta `SELECT` para mostrar el contenido del fichero Parquet.

![Convirtiendo un fichero CSV a Parquet desde la l�nea de comandos con duckdb.exe](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-CLI-Convertir-CSV-a-parquet.png)

Utilizando este comando he preparado un script en PowerShell que lee todos los ficheros CSV de una carpeta y los convierte a ficheros Parquet, y que muestro en la siguiente imagen.

![Script en PowerShell que utiliza duckdb.exe para convertir los ficheros CSV de una carpeta a Parquet.](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-CLI-PowerShell-CSV-a-parquet.png)

## Utilizar DuckDB desde Python para hacer una consulta SQL sobre una carpeta con ficheros Parquet

Los dos �ltimas paradas de este recorrido ser�n con Python, usando la [API Python de DuckDB](https://duckdb.org/docs/api/python/overview).

En el primer ejemplo con Python he usado DuckDB para leer los ficheros Parquet de una carpeta con los viajes de los taxis amarillos de New York, hacer una consulta SQL para contar los viajes para cada mes del a�o 2021 y he guardado el resultado de la consulta en un DataFrame pandas.

En la imagen de abajo muestro el c�digo, donde los puntos importantes son:  
  
`import duckdb`  
Se importa la API de DuckDB, que debe haber sido instalada antes en el entorno Python con un comando como `pip install duckdb`.  
  
`taxis = duckdb.read_parquet('data/yellow_tripdata_2021-*.parquet')`  
Con la funci�n `duckdb.read_parquet()` se crea una consulta SQL que puede leer los datos de los ficheros Parquet con los viajes de los taxis del a�o 2021, y que se guarda en la variable `taxis`. Esta variable no contiene los datos, sino una representaci�n simb�lica de una consulta SQL, que en DuckDB se llama Relation. La variable `taxis` se puede usar dentro de otras consultas SQL, de manera que la consulta final se va construyendo paso a paso, y s�lo se ejecutar� cuando el resultado se imprima o se extraiga hacia otra estructura de datos.  
  
`trips_per_month = duckdb.sql(...)`  
La funci�n `duckdb.sql()` construye una consulta SQL para agrupar los viajes por meses y contarlos. El `FROM` de la consulta usa la variable `taxis` que se cre� en el paso anterior. El resultado de la funci�n se guarda en la variable `trips_per_month`, que es otra Relation, o sea no guarda los datos porque la consulta a�n no se ha ejecutado.  
  
`trips_per_month.df()`  
Finalmente, la funci�n `df()` ejecuta la consulta SQL y la guarda en un DataFrame pandas.

![Script Python que usa la librer�a duckdb para hacer una consulta SQL sobre ficheros Parquet y devolver DataFrame pandas.](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-Python-parquet.png)

## Utilizar DuckDB desde Python para hacer una consulta SQL donde se combinen dos DataFrame pandas

Y para terminar este recorrido con DuckDB, he hecho otro script Python que combina datos de dos DataFrame pandas con una consulta SQL.

Los datos esta vez no provienen de ficheros Parquet, sino de de la [API de la red de transporte de Barcelona (TMB)](https://developer.tmb.cat/). Primero me he conectado a la API para obtener los datos de las rutas de autobuses de Barcelona y con esos datos he creado un DataFrame que he guardado en la variable `df_bus_lines`. Me he vuelto a conectar a la API para obtener los datos de las paradas de cada l�nea de autob�s y he creado otro DataFrame que he guardado en la variable `df_bus_stops`.

Una vez obtenidos los datos, he usado la funci�n `duckdb.sql(...)` para crear una consulta SQL que combine con un JOIN ambos DataFrames para obtener un listado con la cantidad de paradas en cada l�nea. Al construir la consulta SQL se indican los nombres de las variables que contienen los DataFrames en el FROM y en el JOIN, y la librer�a de DuckDB para Python busca dichas variables en el entorno global y las usa como si fueran tablas.

Luego, la funci�n `df()` ejecuta la consulta SQL y la guarda en otro DataFrame pandas.

La siguiente imagen muestra parte del c�digo y el resultado del la consulta.

![Script Python que usa la librer�a duckdb para conbinar dos DataFrame pandas en una consulta SQL](/assets/images/posts/2023-03-21-jugando-duckdb/dataXbi-DuckDB-Python-pandas.png)

## Conclusiones

Luego de hacer estas pruebas iniciales, mi conclusi�n es que voy a incluir DuckDB entre las herramientas que utilizo.

Creo que es muy �til poder usar el CLI de DuckDB para convertir ficheros CSV a Parquet y que puede facilitar la implementaci�n de automatizaciones.

Tambi�n creo que es muy interesante poder usar SQL tanto para trabajar directamente con ficheros Parquet o CSV como con DataFrame pandas.
