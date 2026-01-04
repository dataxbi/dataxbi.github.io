---
layout: post
title: "Carga de datos hacia Azure Synapse Analytics (SQL Data Warehouse) con BCP"
date: 2020-02-09
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "synapse"
---

[**bcp**](https://docs.microsoft.com/en-us/sql/tools/bcp-utility) (Bulk Copy Program) es una utilidad que permite insertar datos desde un archivo hacia una tabla SQL, y exportar desde una tabla hacía un archivo. En esta entrada cargaremos un archivo CSV con unas 2.5 millones de filas hacia una tabla en un almacén de datos en Azure Synapse Analytics (SQL Data Warehouse).

<!--more-->

El archivo contiene datos de los vuelos comerciales dentro de los Estados Unidos entre julio y octubre de 2019 (fuente: [https://www.transtats.bts.gov/DL\_SelectFields.asp?Table\_ID=236&DB\_Short\_Name=On-Time](https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time)).  
Para crearlo seleccioné algunas de las columnas disponibles, descargué los archivos CSV para cada mes y después los uní en uno solo.

Como se puede ver en la siguiente muestra, la primera línea del archivo contiene los encabezados, las columnas están separadas por coma y las cadenas de caracteres están rodeadas por comillas dobles.

```
"FL_DATE","OP_UNIQUE_CARRIER","OP_CARRIER_FL_NUM","ORIGIN_AIRPORT_ID","ORIGIN","ORIGIN_CITY_NAME","ORIGIN_STATE_ABR","DEST_AIRPORT_ID","DEST","DEST_CITY_NAME","DEST_STATE_ABR","CRS_DEP_TIME","DEP_TIME","DEP_DELAY","CRS_ARR_TIME","ARR_TIME","ARR_DELAY","CANCELLED","CANCELLATION_CODE","DIVERTED",
2019-07-01,"9E","5130",10685,"BMI","Bloomington/Normal, IL","IL",10397,"ATL","Atlanta, GA","GA","0600","0558",-2.00,"0851","0830",-21.00,0.00,"",0.00,
2019-07-01,"9E","5132",10990,"CHO","Charlottesville, VA","VA",12953,"LGA","New York, NY","NY","1305","1416",71.00,"1431","1530",59.00,0.00,"",0.00,
2019-07-01,"9E","5133",11042,"CLE","Cleveland, OH","OH",12478,"JFK","New York, NY","NY","0700","0703",3.00,"0845","0838",-7.00,0.00,"",0.00,
2019-07-01,"9E","5134",15919,"XNA","Fayetteville, AR","AR",10397,"ATL","Atlanta, GA","GA","1520","1516",-4.00,"1812","1803",-9.00,0.00,"",0.00,
2019-07-01,"9E","5135",10581,"BGR","Bangor, ME","ME",12953,"LGA","New York, NY","NY","1646","1635",-11.00,"1829","1753",-36.00,0.00,"",0.00,
2019-07-01,"9E","5135",12953,"LGA","New York, NY","NY",10581,"BGR","Bangor, ME","ME","1400","1355",-5.00,"1549","1523",-26.00,0.00,"",0.00,
2019-07-01,"9E","5138",11953,"GNV","Gainesville, FL","FL",10397,"ATL","Atlanta, GA","GA","0715","0710",-5.00,"0842","0821",-21.00,0.00,"",0.00,
2019-07-01,"9E","5140",15249,"TLH","Tallahassee, FL","FL",10397,"ATL","Atlanta, GA","GA","1238","1233",-5.00,"1401","1334",-27.00,0.00,"",0.00,
2019-07-01,"9E","5141",10581,"BGR","Bangor, ME","ME",12953,"LGA","New York, NY","NY","1119","1114",-5.00,"1259","1230",-29.00,0.00,"",0.00,
2019-07-01,"9E","5141",12953,"LGA","New York, NY","NY",10581,"BGR","Bangor, ME","ME","0859","0856",-3.00,"1043","1040",-3.00,0.00,"",0.00,
2019-07-01,"9E","5142",14524,"RIC","Richmond, VA","VA",12478,"JFK","New York, NY","NY","0725","0717",-8.00,"0900","0837",-23.00,0.00,"",0.00,
2019-07-01,"9E","5145",12478,"JFK","New York, NY","NY",10821,"BWI","Baltimore, MD","MD","2040","2054",14.00,"2223","2158",-25.00,0.00,"",0.00,

```

  
  

En Azure he creado un recurso Synapse Analytics (SQL Data Warehouse) con el nombre AcmeDW y ahora crearé la tabla StgFlights, para importar los datos.  

```
CREATE TABLE [dbo].[StgFlights] 
(
	FL_DATE date,
	OP_UNIQUE_CARRIER char(2),
	OP_CARRIER_FL_NUM int,
	ORIGIN_AIRPORT_ID int,
	ORIGIN char(3),
	ORIGIN_CITY_NAME varchar(40),
	ORIGIN_STATE_ABR char(2),
	DEST_AIRPORT_ID int,
	DEST char(3),
	DEST_CITY_NAME varchar(40),
	DEST_STATE_ABR char(2),
	CRS_DEP_TIME char(4),
	DEP_TIME char(4),
	DEP_DELAY decimal(8,2),
	CRS_ARR_TIME char(4),
	ARR_TIME char(4),
	ARR_DELAY decimal(8,2),
	CANCELLED char(4),
	CANCELLATION_CODE char(1),
	DIVERTED char(4)
)
WITH  
(   
	DISTRIBUTION = ROUND_ROBIN,  
	CLUSTERED COLUMNSTORE INDEX
)

```

La tabla tiene las mismas columnas que el archivo CSV. Los nombres de las columnas de la tabla y el orden coinciden con los del archivo, aunque no tiene por qué ser así.

Para cargar los datos con bcp desde un archivo CSV, es recomendable preparar un [archivo de formato](https://docs.microsoft.com/en-us/sql/relational-databases/import-export/non-xml-format-files-sql-server), que permite definir los separadores de columna y de líneas y relacionar las columnas del archivo de datos y la tabla.

Con bcp podemos crear un archivo de formato a partir de la tabla, con una línea de comandos como esta:  

```
bcp AcmeDW.dbo.StgFlights format nul -f flights.fmt -c -S xxxxx.database.windows.net -U sqluser -P sqlpassword

```

donde:  

- AcmeDW.dbo.StgFlights es el nombre completo de la tabla SQL
- format null -f indica que queremos crear un archivo de formato con el nombre flights.fmt
- \-c indica que el archivo de datos tiene caracteres de un solo byte (char), otras opciones disponibles son -w para caracteres unicode (nchar) y -n para formato nativo
- \-S -U y -P contienen el nombre del servidor SQL, el usuario y la contraseña

Al ejecutar el comando, se creó el archivo flights.fmt con el siguiente contenido:

```
14.0
20
1       SQLCHAR             0       11      "\t"     1     FL_DATE                                ""
2       SQLCHAR             0       2       "\t"     2     OP_UNIQUE_CARRIER                      Latin1_General_CI_AS
3       SQLCHAR             0       12      "\t"     3     OP_CARRIER_FL_NUM                      ""
4       SQLCHAR             0       12      "\t"     4     ORIGIN_AIRPORT_ID                      ""
5       SQLCHAR             0       3       "\t"     5     ORIGIN                                 Latin1_General_CI_AS
6       SQLCHAR             0       40      "\t"     6     ORIGIN_CITY_NAME                       Latin1_General_CI_AS
7       SQLCHAR             0       2       "\t"     7     ORIGIN_STATE_ABR                       Latin1_General_CI_AS
8       SQLCHAR             0       12      "\t"     8     DEST_AIRPORT_ID                        ""
9       SQLCHAR             0       3       "\t"     9     DEST                                   Latin1_General_CI_AS
10      SQLCHAR             0       40      "\t"     10    DEST_CITY_NAME                         Latin1_General_CI_AS
11      SQLCHAR             0       2       "\t"     11    DEST_STATE_ABR                         Latin1_General_CI_AS
12      SQLCHAR             0       19      "\t"     12    CRS_DEP_TIME                           ""
13      SQLCHAR             0       19      "\t"     13    DEP_TIME                               ""
14      SQLCHAR             0       41      "\t"     14    DEP_DELAY                              ""
15      SQLCHAR             0       19      "\t"     15    CRS_ARR_TIME                           ""
16      SQLCHAR             0       19      "\t"     16    ARR_TIME                               ""
17      SQLCHAR             0       41      "\t"     17    ARR_DELAY                              ""
18      SQLCHAR             0       3       "\t"     18    CANCELLED                              Latin1_General_CI_AS
19      SQLCHAR             0       3       "\t"     19    CANCELLATION_CODE                      Latin1_General_CI_AS
20      SQLCHAR             0       41      "\r\n"   20    DIVERTED                               ""

```

Ya casi estamos listos para cargar los datos del archivo CSV utilizando bcp, con una línea de comandos como esta:  

```
bcp AcmeDW.dbo.StgFlights in 182553109_T_ONTIME_REPORTING_2019.csv -f flights.fmt  -F 2 -e error.txt -q -S xxxxx.database.windows.net -U sqluser -P sqlpassword

```

donde:  

- AcmeDW.dbo.StgFlights es el nombre completo de la tabla SQL
- in 182553109\_T\_ONTIME\_REPORTING\_2019.csv indica que queremos insertar los datos del un archivo
- \-f flights.fmt, es al archivo de formato
- \-F 2, indica que comience desde la segunda fila, para que ignore la fila de encabezados
- \-e error.txt, indica que si hay errores se registren en un archivo
- \-q es para forzar la ejecución del comando QUOTED\_IDENTIFIER to 'ON', porque por defecto bcp ejecuta QUOTED\_IDENTIFIER to 'OFF', pero Azure Synapse no lo soporta en OFF
- \-S -U y -P contienen el nombre del servidor SQL, el usuario y la contraseña

Sin embargo, si ejecutamos el comando, recibiremos un error como el siguiente

```
Starting copy...
SQLState = S1000, NativeError = 0
Error = [Microsoft][ODBC Driver 17 for SQL Server]Unexpected EOF encountered in BCP data-file

BCP copy in failed

```

La causa del error está en la columna 5 del archivo de formato, donde se indica que el separador para cada columna es un tab ("\\t"), y los separadores de filas son el retorno y cambio de línea ("\\r\\n"). Pero nuestro archivo de datos CSV utliza la coma (,) como separador de columnas y el cambio de línea como separador de fila, por lo que tenemos que cambiar los tabs a comas (",") y el último separador a ",\\n".

Si aplicamos estos cambios al archivo de formato y volvemos a ejecutar el comando, recibiremos otro error, como el siguiente

```
Starting copy...
SQLState = 22001, NativeError = 0
Error = [Microsoft][ODBC Driver 17 for SQL Server]String data, right truncation
SQLState = 22001, NativeError = 0
Error = [Microsoft][ODBC Driver 17 for SQL Server]String data, right truncation

```

Y si miramos en el archivo error.tx encontraremos errores como estos

```
#@ Row 1, Column 2: String data, right truncation @#
2019-07-01	"9E"	"5130"	10685	"BMI"	"Bloomington/Normal	 IL"	"IL"	10397	"ATL"	"Atlanta	 GA"	"GA"	"0600"	"0558"	-2.00	"0851"	"0830"	-21.00	0.00,"",0.00	
#@ Row 2, Column 2: String data, right truncation @#
2019-07-01	"9E"	"5132"	10990	"CHO"	"Charlottesville	 VA"	"VA"	12953	"LGA"	"New York	 NY"	"NY"	"1305"	"1416"	71.00	"1431"	"1530"	59.00	0.00,"",0.00	

```

Lo que ha pasado es que la columna 2 del archivo CSV se ha leído como "9E", incluyendo las dobles comillas al inicio y al final, lo que hace un total de 4 caracteres, pero el campo en la tabla es de tipo char(2), por lo que tendría que truncar el valor. La solución a este problema es modificar el archivo de formato para incluir las dobles comillas ("\\"") como parte del separador de columna, cuando corresponda.

Después de hacer las modificaciones, el archivo de formato quedaría asi

```
14.0
20
1       SQLCHAR             0       11      ",\""       1     FL_DATE                                ""
2       SQLCHAR             0       2       "\",\""     2     OP_UNIQUE_CARRIER                      Latin1_General_CI_AS
3       SQLCHAR             0       12      "\","       3     OP_CARRIER_FL_NUM                      ""
4       SQLCHAR             0       12      ",\""       4     ORIGIN_AIRPORT_ID                      ""
5       SQLCHAR             0       3       "\",\""     5     ORIGIN                                 Latin1_General_CI_AS
6       SQLCHAR             0       40      "\",\""     6     ORIGIN_CITY_NAME                       Latin1_General_CI_AS
7       SQLCHAR             0       2       "\","       7     ORIGIN_STATE_ABR                       Latin1_General_CI_AS
8       SQLCHAR             0       12      ",\""       8     DEST_AIRPORT_ID                        ""
9       SQLCHAR             0       3       "\",\""     9     DEST                                   Latin1_General_CI_AS
10      SQLCHAR             0       40      "\",\""     10    DEST_CITY_NAME                         Latin1_General_CI_AS
11      SQLCHAR             0       2       "\",\""     11    DEST_STATE_ABR                         Latin1_General_CI_AS
12      SQLCHAR             0       19      "\",\""     12    CRS_DEP_TIME                           ""
13      SQLCHAR             0       19      "\","       13    DEP_TIME                               ""
14      SQLCHAR             0       41      ",\""       14    DEP_DELAY                              ""
15      SQLCHAR             0       19      "\",\""     15    CRS_ARR_TIME                           ""
16      SQLCHAR             0       19      "\","       16    ARR_TIME                               ""
17      SQLCHAR             0       41      ","         17    ARR_DELAY                              ""
18      SQLCHAR             0       3       ",\""       18    CANCELLED                              Latin1_General_CI_AS
19      SQLCHAR             0       3       "\","       19    CANCELLATION_CODE                      Latin1_General_CI_AS
20      SQLCHAR             0       41      ",\n"       20    DIVERTED                               ""

```

Volvemos a ejecutar el comando bcp y ahora si vemos como los datos se van cargando en bloques de 1000 filas hasta completar los 2.5 millones.

```
Starting copy...
1000 rows sent to SQL Server. Total sent: 1000
1000 rows sent to SQL Server. Total sent: 2000
1000 rows sent to SQL Server. Total sent: 3000
1000 rows sent to SQL Server. Total sent: 4000
1000 rows sent to SQL Server. Total sent: 5000
...
...
1000 rows sent to SQL Server. Total sent: 2556000
1000 rows sent to SQL Server. Total sent: 2557000
1000 rows sent to SQL Server. Total sent: 2558000
1000 rows sent to SQL Server. Total sent: 2559000

2559483 rows copied.
Network packet size (bytes): 4096
Clock Time (ms.) Total     : 32282  Average : (79285.14 rows per sec.)

```
