---
layout: post
title: "Power BI y Synapse: Archivos CSV"
date: 2022-07-28
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "synapse"
---

Si tienes que importar a Power BI archivos CSV que est�n en un data lake, Azure Synapse es una opci�n muy interesante, y aunque no lo creas, no es costosa.

En esta entrada te explico paso a paso todo el proceso, que consiste en vincular el data lake con Synapse, crear en Synapse una vista SQL que acceda a los datos de los archivos CSV y en Power BI conectarse a Synapse y configurar la actualizaci�n incremental. Tambi�n hablo de los costes y en cada paso hago recomendaciones para mantener los costes bajo control.

<!--more-->

![Importar archivos CSV desde Azure Data Lake hacia Power BI con Azure Synapse](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV.png)

Si tienes acceso a una subscripci�n de Azure y quieres ir siguiendo los pasos, puedes descargar los archivos CSV desde [GitHub](https://github.com/dataxbi/powerbi-synapse) y subirlos a un Azure Data Lake.

### Archivos CSV en el data lake

Los archivos CSV con los que vamos a trabajar contienen los datos del registro de ventas de una tienda y tienen las siguientes columnas:

- Fecha
- Codigo Cliente
- Codigo Vendedor
- Codigo Producto
- Precio Unitario
- Cantidad

El separador de columnas es la coma, y la primera fila de cada archivo tiene los nombres de las columnas.

Estos archivos est�n almacenados en un Azure Data Lake, o sea, en una cuenta de almacenamiento que tiene habilitado el esquema de nombre jer�rquico, y est�n dentro de un contenedor con el nombre `ventas`. Se ha creado una jerarqu�a de carpetas para el a�o, el mes y el d�a y los archvios CSV se han ubicado dentro de la carpeta del d�a que le correspende.

![Jerarqu�a de carpetas para almacenar los archivos CSV en Azure Data Lake](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Data-Lake.png)

  
  

### Azure Synapse

El servicio Azure Synapse Analytics est� formado por varias componentes con los que podemos ingerir, explorar, preparar, transformar, administrar y servir datos de una manera unificada.

Para consumir los archivos CSV, usaremos el `grupo de SQL sin servidor`, con el cual podemos hacer consultas SQL directamente sobre archivos que est�n almacenados en un Azure Date Lake.

![Diagrama con los componentes de Azure Synapse Analytics](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Azure-Synapse.png)

  
  

Para comenzar a trabajar con Synapse, debemos crear un �rea de trabajo de Synapse, lo cu�l se puede hacer desde el portal de Azure, creando un nuevo recurso de Azure Synapse Analytics.

Hay que tener en cuenta que el �rea de trabajo necesita un data lake para usarlo como su sistema de archivos, por lo que al crear el recurso debemos indicar una cuenta de almacenamiento que ya exista, o bien que queremos crear una cuenta nueva.

Una vez creado el recurso, entramos al �rea de trabajo y abrimos Synapse Studio para acceder a los servicios de Synapse.

![Crearndo un �read de trabajo de Synapse en el portal de Azure y abriendo Synapse Studio](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Crear-area-trabajo-Synapse-portal-Azure.png)

  
  

Ya dentro de Synapse Studio, para poder acceder a los archivos CSV vamos a establecer un v�nculo con la cuenta de almacenamiento donde est� el data lake que contiene dichos archivos.

Quiero aclarar que en este caso los archivos CSV est�n en una cuenta de almacenamiento distinta a la que se indic� cuando creamos el �rea de trabajo de Synapse. De hecho, podriamos vincular con Synapse una cuenta de almacenamiento que pertenezca a otra susbcripci�n de Azure.

Te recuerdo que la cuenta de almacenamiento tiene que tener habilitado el espacio de nombre jer�rquico, para que funcione como un data lake.

Una recomendaci�n importante es que la cuenta de almacenamiento est� en la misma regi�n de Azure en la que est� el �rea de trabajo de Synapse.

![Vincular un Data Lake con un �rea de trabajo de Synapse](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Vincular-un-Azure-Data-Lake-Gen2-a-un-area-de-trabajo-de-Synapse.png)

  
  

Despu�s de establecer el v�nculo con el data lake, vamos a hacer una consulta SQL desde el grupo SQL sin servidor, para comprobar que todo est� bien. No temas, que no vamos a incurrir en ning�n coste.

Con Synapse Studio podemos crear la consulta SQL en unos simples pasos. Primero vamos a la p�gina Datos y hacemos clic en Vinculado para ver una lista de los servicios que est�n vinculados. Buscamos el data lake que vinculamos anteriormente y navegamos por sus contenedores y sus carpetas. Seleccionamos el contenedor `ventas` y nos movemos por la carpeta del a�o, luego la de un mes y finalmente la de un d�a, hasta que veamos un archivo CSV. Parados sobre el archivo, usamos el bot�n derecho del rat�n y seleccionamos la opci�n Nuevo script SQL y luego Seleccionar las primeras 100 filas.

Esto nos llevar� al editor de SQL donde veremos la consulta creada. La podemos ejecutar con el bot�n Ejecutar que est� arriba a la izquierda, o con la tecla F5. Adelante, no tema�s, no vamos a gastar nada todav�a. Si todo sali� bien debemos ver parte del contenido del archivo CSV que seleccionamos.

![Pasos para crear una consulta SQL con Synapse Studio que liste el contenido de los archivos CSV guardados en un contenedor de Azure Data Lake](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Crear-consulta-SQL-desde-Azure-Data-Lake-con-Synapse-Studio.png)

Si miramos en la parte superior y central del editor de SQL podemos ver que dice Conectarse a Integrado, lo que indica que estamos conectados al grupo SQL sin servidor, el cual no hay que iniciar, ni se puede parar, porque Synapse se encarga de hacerlo por nosotros y de gestionar la capacidad necesaria cuando hacemos una consulta SQL. Al lado podemos ver que en este momento estamos conectados a la base de datos master. En un rato, antes de crear la vista SQL, vamos a crear una nueva base de datos.

M�s adelante explicar� los detalles de esta consulta SQL, que nos servir� como base para crear la vista. Por ahora lo importante es copiar el punto de acceso para el data lake y que podemos ver dentro de la consulta, en la l�nea que contiene la palabra BULK y que tiene el formato `https://xxxx.dfs.core.windows.net/ventas` donde `xxxx` se sustituir� por el nombre de la cuenta de almacenamiento, y `ventas` es el nombre del contenedor.

Ya estamos listos para crear la vista, pero antes hablar� de los costes.

### Coste del grupo SQL sin servidor de Synapse

En el grupo SQL sin servidor s�lo se paga por el volumen de datos utilizados para procesar las consultas SQL. Al momento de escribir este blog, el coste en la regi�n Oeste de Europa es de €4,756 por TB de datos. Para calcular el coste siempre se redondea al siguiente MB y cada consulta tiene un cargo m�nimo de 10 MB.

Las instrucciones SQL de DDL, como CREATE, ALTER o DROP no tienen coste.

Se mide tanto la cantidad de datos que se cargan en el motor de SQL sin servidor para poder completar la consulta, como los datos que son enviados con los resultados de la consulta. En el caso de CSV hay que leer un archivo completo para procesar cualquier consulta. Por ejemplo, una consulta que cuente la cantidad de filas de un archivo `SELECT COUNT(*) FROM ....` lee todo el archivo CSV, pero luego el volumen del resultado es muy peque�o. Mientras que una consulta que devuelva todas las filas y todas las columnas `SELECT * FROM ...` costar� un poco m�s porque igual leer� todo el archivo CSV y adem�s el volumen del resultado es todo el archivo CSV.

¿Y cuanto ha costado la consulta que hemos ejecutado antes? El tama�o del archivo CSV es de 333 KB, pero recuerda que el coste m�nimo es 10 MB, si asumimos que 1 TB equivale a 1 mill�n de MB, podemos calcular €4,756 \* 10 / 1.000.000 = **€0,0004756**. ¿Qu� te dije? Podemos decir que no hemos gastado nada.

Con Synapse Studio podemos ver un registro de las consultas que se han hecho en el grupo SQL sin servidor y el volumen de datos procesado. Para ello vamos a la p�gina Monitor y entramos a las Solicitudes de SQL. En la imagen se puede ver c�mo se han ejecutado dos consultas y que en cada una se procesaron 10 MB.

![Con Synapse Studio podemos monitorear la ejecuci�n de las consultas SQL sin servidor](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Coste-consulta-SQL-grupo-SQL-sin-servidor.png)

  
  

### Creando la vista SQL

Vamos a crear la vista SQL que luego usaremos desde Power BI.

Primero creamos una nueva base de datos en el grupo SQL sin servidor, que lo podemos hacer visualmente o con la instrucci�n SQL `CREATE DATABASE`.

Para crear la base de datos visualmente, vamos a la p�gina Datos, hacemos clic en el bot�n + y escogemos la opci�n Base de datos SQL y en el formulario que se abre indicamos que es en el grupo SQL sin servidor y escribimos el nombre de la base de datos: `ventas`.

Para crear la base de datos con SQL, vamos a la p�gina Desarrollar, hacemos clic en el bot�n + y escogemos la opci�n Script SQL, lo que abrir� un nuevo editor de SQL, donde escribimos la instrucci�n `CREARE DATABASE ventas` y la ejecutamos con la tecla F5 o con el bot�n Ejecutar.

![Dos formas de crear una base de datos en el grupo SQL sin servidor](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Dos-formas-de-crear-una-base-de-datos-en-el-grupos-SQL-sin-servidor.png)

  
  

Como segundo paso, crearemos un origen de datos externo utilizando el punto de conexi�n al data lake: `https://xxxx.dfs.core.windows.net/ventas` (recuerda que `xxxx` hay que sustituirlo por el nombre de la cuenta de almacenamiento de Azure y que `ventas` es el nombre del contenedor donde est�n los archivos CSV). Para ello utilizaremos las siguientes instrucciones de SQL:

```

USE ventas;

CREATE EXTERNAL DATA SOURCE VentasDS
	WITH (
		LOCATION   = 'https://xxxx.dfs.core.windows.net/ventas' 
	    )
```

La instrucci�n `USE` es para cambiarnos de la base de datos `master` a la base de datos `ventas` que creamos en el paso anterior.

Para ejecutar estas instrucciones SQL en Synapse Studio, vamos a la p�gina Desarrollar, hacemos clic en el bot�n + y escogemos la opci�n Script SQL, para abrir un editor de SQL. O si en el paso anterior creaste la base de datos con SQL, puedes usar ese mismo editor que ya est� abierto. Recuerda usar la tecla F5 o el bot�n Ejecutar.

  
  

¡Ya estamos listos para crear la vista! Primero mostrar� la instrucci�n SQL, despu�s mostrar� el resultado de ejecutar una consulta SQL que utilice esta vista y m�s tarde explicar� las distintas partes de la instrucci�n SQL.

Esta es la instrucci�n SQL para crear la vista:

```

CREATE VIEW vwVentasCsv
AS
SELECT
    v.*,
    CAST(v.filename() AS varchar(25)) AS 'Archivo',
    CAST(v.filepath(1) AS INT) AS 'A�o',
    CAST(v.filepath(2) AS TINYINT) AS 'Mes',
    CAST(v.filepath(3) AS TINYINT) AS 'Dia'
FROM
    OPENROWSET (
        BULK 'csv/*/*/*/*.csv',
        DATA_SOURCE = 'VentasDS',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0',
        HEADER_ROW = TRUE
    ) 
    WITH (
        Fecha DATE,
        [Codigo Cliente] INT,
        [Codigo Vendedor] CHAR(6) COLLATE Latin1_General_100_CI_AS_SC_UTF8,
        [Codigo Producto] CHAR(13) COLLATE Latin1_General_100_CI_AS_SC_UTF8,
        [Precio Unitario] DECIMAL(9,2),
        Cantidad INT
    )
    AS v
```

La puedes ejecutar en el editor SQL que ya tienes abierto. Si no tienes ning�n editor SQL abierto, cuando abras uno nuevo recuerda cambiar a la base de datos `ventas`. Al ejecutar esta instrucci�n no ver�s ning�n resultado, pero puedes cambiarte al panel de mensajes para saber que la consulta se ejecut� con �xito.

![Ejecutando la consulta SQL para crear la vista.](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Ejecutando-la-consuta-SQL-para-crear-la-vista.png)

Ahora que hemos creado la vista, vamos a utilizarla en una consulta SQL para ver las columnas que devuelve. Ejecutamos la consulta `SELECT TOP 100 * FROM vwVentasCsv` y observamos el resultado.

![Resultado de ejecutar una consulta SQL que utiliza la vista](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Resultados-ejecutar-consulta-SQL-usa-vista.png)

Las primeras columnas del resultado coinciden con las columnas de los archivos CSV. A continuaci�n tenemos una columna con el nombre del archivo CSV y luego hay 3 columnas con el a�o, el mes y el d�a.

Para explicar c�mo se obtiene este resultado voy a analizar la vista por partes y comienzo con `OPENROWSET`.

![Explicando el bloque OPENROWSET de la vista](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Vista-SQL-OPENROWSET.png)

Con `OPENROWSET` se indica el origen y el formato de los archivos.

En la l�nea 12 `DATA_SOURCE = 'VentasDS'` se hace referencia al origen de datos externo que creamos antes y que apunta al data lake y al contenedor `ventas`.

En la l�nea 11 `BULK 'csv/*/*/*/*.csv'` el \* se utiliza como comod�n para indicar que dentro del contenedor `ventas` se revisen las carpetas que est�n debajo de la carpeta `csv` y que correspenden a un primer nivel con el `a�o`, un segundo nivel con el `mes` y un tercer nivel con el `d�a`, y ya dentro de la carpeta del d�a, a todos los archvios con cualquier nombre y con la extensi�n csv.

Pues como se ve, con esta vista podemos extraer datos de varios archivos, todos los que est�n en la estructura de carpetas indicada, y no de un s�lo archivo como era el caso de la primera consulta que hicimos. Esto nos da un gran poder y al mismo tiempo una gran responsabilidad porque si no somos cuidadosos podemos disparar los costes.

La l�nea 13 `FORMAT = 'CSV'` est� clara, s�lo a�adir que los otros formatos admitidos son PARQUET y DELTA.

La l�nea 14 `PARSER_VERSION = '2.0'` es espec�fica para CSV y se recomienda utilizar la versi�n 2.0 del motor que procesa los CSV porque es m�s eficiente. S�lo se debe utilizar la versi�n 1.0 si tenemos archivos CSV con alguna caracter�stica que no est� soportada por la versi�n 2.0. Si no indicamos nada, se utilizar� la versi�n 1.0.

En la l�nea 15 `HEADER_ROW = TRUE` se indica que los archivos CSV tienen una primera fila con los nombres de las columnas.

OPENROWSET tiene otros par�metros para indicar los separadores, etc., pero con los valores por defecto es suficiente para que entienda la estructura de los CSV que estamos utilizando, donde el separador es la coma.

  
  

El pr�ximo bloque que explicar� es el `WITH` que viene a continuaci�n del `OPENROWSET`.

![Explicando el bloque WITH de la vista](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Vista-SQL-WITH.png)

Con la instrucci�n `WITH` se indican los nombres y los tipos de datos de las columnas. No es obligatoria y si se omite, los tipos de datos se infieren analizando las 100 primeras filas.

Pero se recomienda utilizarla siempre porque as� podemos indicar expl�citamente los tipos de datos, lo que nos permite utilizar el tipo de dato m�s peque�o posible.

Si miramos en la `l�nea 20`, la columna `Codigo Vendedor` es de tipo `CHAR(6)` porque estamos seguros de que todos los c�digos tienen ese tama�o. Adem�s se ha utilizado la instrucci�n `COLLATE` porque los archivos CSV est�n codificados con UTF-8. De no indicar el COLLATE, la consulta dar�a un error. Con la columna `Codigo Producto` sucede algo similar.

  
  

Finalizo el an�lisis de la vista con el bloque `SELECT`.

![Explicando el bloque SELECT de la vista](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Vista-SQL-SELECT.png)

La instrucci�n `SELECT` define las columnas que formar�n el resultado.

La l�nea 4 `v.*` devuelve todas las columnas que se han indicado en el bloque `WITH` y que son todas las columnas de los archivos CSV.

En la l�nea 5 se utiliza la funci�n `filename()` que retorna el nombre del archivo de donde provienen los datos de cada fila. Recuerda que con esta vista podemos devolver datos de varios archivos CSV. El texto retornado por la funci�n es de tipo nvarchar(1024) pero los nombres de nuestros archivos no son tan grandes, por lo que siguiendo las recomendaciones lo convertimos a un tipo de datos m�s peque�o: varchar(25).

En las l�neas 6, 7 y 8 se utiliza la funci�n SQL `filepath()` con los argumentos 1, 2 y 3 respectivamente. Para entender c�mo funciona hay que mirar de nuevo dentro del bloque `OPENROWSET`, en la l�nea 11 `BULK 'csv/*/*/*/*.csv'`.

- `filepath(1)` se refiere al `primer asterisco (*)` de la ruta `csv/*/*/*/*.csv`, que ser�a la carpeta del `a�o`, por ejemplo 2022
- `filepath(2)` se refiere al `segundo asterisco (*)` de la ruta `csv/*/*/*/*.csv`, que ser�a la carpeta del `mes`, por ejemplo 06
- `filepath(3)` se refiere al `tercer asterisco (*)` de la ruta `csv/*/*/*/*.csv`, que ser�a la carpeta del `d�a`, por ejemplo 01

El resultado de esta funci�n tambi�n es de tipo nvarchar(1024) y en este caso lo convertivos a n�meros enteros.

Las funciones `filaneme()` y `filepath()` son muy interesantes porque cuando se usan en el `SELECT`, como hemos visto, nos devuelven un resultado, pero adem�s se pueden usar para filtrar, o sea en una instrucci�n `WHERE`, y en ese caso s�lo se procesan los archivos que est�n en la ruta filtrada, por lo que se reduce el coste.

Lo que he afirmado antes es muy importante, por lo que lo voy a repetir y en negritas. **Utilizando las funciones filepath() y filename() y particionando de una manera apropiada las carpetas, podemos reducir los costes de las consultas que hacemos con el grupo SQL sin servidor de Synapse.** A esto se le conoce como poda de partici�n (partition pruning).

Vamos a verlo en la pr�ctica con dos consultas SQL que cuentan el total de ventas para un d�a, lo que en un caso filtraremos por la columna Fecha y en el otro caso filtraremos por las columnas A�o, Mes y D�a.

Estas son las consultas:

```
SELECT COUNT(*) FROM vwVentasCsv WHERE Fecha = '2022-06-01'

```

```
SELECT COUNT(*) FROM vwVentasCsv WHERE [A�o] = 2022 AND Mes = 6 AND Dia = 1

```

Ambas consultas dar�n el mismo resultado, pero la primera costar� m�s porque procesar� todos los archivos, mientras que la segunda s�lo procesar� el archivo de un d�a.

Como se puede observar en la imagen siguiente, la primera consulta proces� 25 MB de datos, mientras que la segunda, que si utiliza la poda de partici�n, proces� el m�nimo de 10 MB.

![Comparando la cantidad de datos procesados por dos consultas que dan el mismo resultado pero una hace poda de partici�n y la otra no.](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Partition-pruning.png)

  
  

Bueno, ya lo tenemos todo listo del lado de Synapse por lo que podemos pasar a Power BI.

  
  

### Power BI

Vamos a conectarnos desde Power BI Desktop a la vista que hemos creado en el grupo SQL sin servidor de Synapse. Y lo haremos usando el conector de base de datos SQL Server, aunque en la interfaz gr�fica de Power Query tenemos varios opciones, pero todas utilizan dicho conector.

Antes de comenzar a trabajar en Power BI Desktop, regresamos al portal de Azure para ir al �rea de trabajo de Synapse y copiar la cadena de conexi�n que vamos a utilizar. Hay que buscar en Informaci�n general, donde dice Punto de conexi�n de SQL sin servidor (hay que mirar el tooltip para leer todo el texto). Tiene este formato `xxxx-ondemand.sql.azuresynapse.net`, donde `xxxx` se cambia por el nombre del �rea de trabajo de Synapse.

![En el portal de Azure vamos al �rea de trabajo de Synapse y buscamos el punto de conexi�n al grupo de SQL sin servidor](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Punto-conexion-SQL-sin-servidor.png)

¡Ahora si! Entramos en Power BI Desktop donde podemos usar uno de estos conectores:

- Azure Synapse Analytics SQL
- Azure SQL Database
- Base de datos SQL Server

Al conectarnos con cualquiera de estas opciones, nos aparecer� el mismo formulario del conector de base de datos SQL Server, donde completaremos el nombre del servidor con el punto de conexi�n que copiamos antes y en el nombre de la base de datos escribiremos `ventas`.

![Configurando el conector de base de datos SQL Server de Power BI Desktop para conectarse al grupo SQL sin servidor de Synapse](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Conector-SQL-Server.png)

Antes de continuar quiero hacer dos comentarios.

Primero, hay otro conector con el nombre Área de trabajo de Azure Synapse Analytics, que est� en beta, y que nos facilitar�a la conexi�n porque no tendriamos que buscar previamente la direcci�n al punto de conexi�n. Pero este conector no funciona a�n con el grupo SQL sin servidor.

Segundo, no es recomendable usar DirectQuery con el grupo SQL sin servidor por dos razones: rendimiento y costes.

Continuando con el proceso de conexi�n, ahora debemos entrar las credenciales, donde podemos usar las mismas credenciales con las que accedimos al portal de Azure. Tambi�n es posible crear usuarios en la base de datos y utilizar esas credenciales.

Lo siguiente es seleccionar la vista `vwVentasCsv` que es el �nico objeto que hemos creado en la base de datos `ventas`. Y usamos el bot�n Transformar datos para entrar al editor de Power Query.

![Importando a Power BI la vista vwVentasCsv desde el grupo SQL sin servidor de Synapse](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Escogiendo-la-vista-en-el-conector-de-base-de-datos-SQL-Server.png)

Bueno, ya estamos conectados a los archivos CSV que est�n en el data lake!

Pero recuerda que Synapse nos est� cobrando por cada consulta que hagamos, por lo que tenemos que ser cuidadosos mientras estemos trabjando en el editor de Power Query. Una manera de hacerlo es filtrar las filas con las columnas A�o, Mes y Dia para que las consultas s�lo usen un archivo CSV, en lugar de todos los archivos de todas las carpetas.

De hecho, cuando usemos el grupo SQL sin servidor de Synapse desde Power BI es muy recomendable configurar la actualizaci�n incremental, porque as� el grueso del coste estar� en la primera carga, y en las cargas incrementales s�lo se procesar�n los archivos nuevos.

Y es lo que vamos a hacer para terminar, configurar la actualizaci�n incremental utilizando las columnas A�o, Mes y Dia que son las que nos garantizan la poda de partici�n.

Lo primero es crear los par�metros de consulta `RangeStart` y `RangeEnd`, de tipo fecha/hora y con los valores 2022-06-01 y 2022-06-02 para que mientras estemos trabajando localmente con Power BI Desktop nos filtre un s�lo d�a.

![Definiendo los par�metros de consulta RangeStart y RangeEnd para la actualizaion incremental](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Parametros-de-consulta-para-actualizacion-incremental.png)

A continuaci�n utilizaremos los par�metros de consulta para filtrar las filas, usando las columnas A�o, Mes y Dia, y lo vamos a hacer en dos pasos donde vamos a utilizar c�digo Power Query M.

El primer paso consiste en agregar una columna personalizada con el nombre FechaNumero y con esta f�rmula: `[A�o] * 10000 + [Mes] * 100 + [Dia]` con lo que obtendremos un valor num�rico como este: `20220601`.

![Agregando la columna personalizada FechaNumero](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Actualizacion-incremental-columna-personalizada-FechaNumero.png)

En un segundo paso filtramos la nueva columna FechaNumero con los par�metros RangeStart y RangeEnd. Empezamos por crear el filtro con la interfaz gr�fica de Power Query donde filtramos con unos valores fijos, y luego modificamos la f�rmula para sustituir los valores fijos por expresiones Power Query M que usen los par�metros RangeStart y RangeEnd.

![Filtrando la columna FechaNumero on la interfaz visual de Power Query](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Power-Query-filtrar.png)

Como se puede ver en la imagen, se ha aplicado un filtro `mayor o igual que` y otro `menor que`. Es importante hacerlo de esta manera para que funcione bien la actualizaci�n incremental.

Si miramos el c�digo Power Query M de este paso en la barra de f�rmula, luce as�:

```
= Table.SelectRows(#"Personalizada agregada", each [FechaNumero] >= 20220601 and [FechaNumero] < 20220602)

```

Vamos a sustituirlo por este otro c�digo, que utiliza los par�metros RangeStart y RangeEnd.

```
= Table.SelectRows(#"Personalizada agregada", each [FechaNumero] >= Date.Year(RangeStart) * 10000 + Date.Month(RangeStart) * 100 + Date.Day(RangeStart) and [FechaNumero] < Date.Year(RangeEnd) * 10000 + Date.Month(RangeEnd) * 100 + Date.Day(RangeEnd))

```

Si todo sali� bien, debemos ver que los datos est�n filtrados para un solo d�a.

Es importante comprobar que no se haya roto el plegado de consulta, para as� garantizar que el filtro que hemos aplicado llegue como una consulta nativa a Synapse y este s�lo procese los archivos necesarios.

![Hay que comprobar que no se rompa el plegado de consulta](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Plegado-de-consultas.png)

Luego de aplicar este filtro podemos quitar las columnas A�o, Mes, Dia, FechaNumero y Archivo, si no las necesitamos m�s.

Para completar la configuraci�n de la actualizaci�n incremental, tenemos que aplicar los cambios para cargar la tabla en el modelo, y desde la pantalla de modelado usamos el clic derecho del rat�n en el encabezado de la tabla y escogemos la opci�n Actualizaci�n incremental.

![Configuraci�n de la actualizaci�n incremental en la tabla](/assets/images/posts/2022-07-28-powerbi-synapse-archivos-csv/dataXbi-Power-BI-Synapse-Archivos-CSV-Configuracion-tabla-actualizacion-incremental.png)

Ya lo que queda es publicar en el servicio de Power BI. Te recomiendo que despu�s de publicar, compruebes en Synapse que en las actualizaciones incrementales s�lo se est�n procesando los archivos nuevos.
