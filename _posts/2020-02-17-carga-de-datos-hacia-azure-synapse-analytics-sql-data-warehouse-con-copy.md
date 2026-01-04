---
layout: post
title: "Carga de datos hacia Azure Synapse Analytics (SQL Data Warehouse) con COPY"
date: 2020-02-17
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "synapse"
---

Con el comando [**COPY**](https://docs.microsoft.com/en-us/sql/t-sql/statements/copy-into-transact-sql) de T-SQL se pueden insertar datos en Azure Synapse Analytics (SQL Data Warehouse) desde fuentes externas. En esta entrada cargaremos un archivo CSV con unas 2.5 millones de filas, alojado en Azure Data Lake Store Gen2 hacia una tabla en un almacén de datos.

<!--more-->

El archivo es el mismo utilizado en [una entrada anterior](https://www.dataxbi.com/blog/2020/02/09/carga-datos-azure-synapse-analytics-bcp/), y contiene datos de los vuelos comerciales dentro de los Estados Unidos entre julio y octubre de 2019

Para el almacenamiento utilizaré el mismo Azure Data Lake Gen2 que en [otra entrada anterior](https://www.dataxbi.com/blog/2020/02/12/carga-datos-azure-synapse-analytics-polybase/), con el mismo contenedor `flights` y la carpeta `2019`.

El comando **COPY** está en versión preliminar pública en la fecha en que escribo esta entrada (febrero de 2020) y simplifica el acceso a fuentes externas, si se compara con [PolyBase](https://www.dataxbi.com/blog/2020/02/12/carga-datos-azure-synapse-analytics-polybase/), porque no hay que crear con antelación la fuente de datos externa, ni el formato de archivo, sino que se pasan directamente como parámetros y de una forma más compacta. Otra diferencia con PolyBase es que no se puede interrogar directamente los datos externos, sino que se insertan en una tabla que debe haber sido creada antes.

He creado una tabla con los mismos campos que las columnas en el archivo CSV:

```
CREATE TABLE [dbo].[StgFlights] (
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
	DISTRIBUTION = ROUND_ROBIN 
);

```

El comando para copiar los datos desde el Azure Data Lake Gen2 es muy sencillo:

```
COPY INTO [dbo].[StgFlights] 
FROM 'https://acmedatalake.dfs.core.windows.net/flights/2019/'
WITH (
    FILE_TYPE = 'CSV',
    CREDENTIAL=(IDENTITY= 'Storage Account Key', SECRET='xxxxxxxxxxxxxxxxxxx'),
    FIELDQUOTE = '"',
    FIELDTERMINATOR=',',
    ROWTERMINATOR='0X0A',
    FIRSTROW = 2,
    MAXERRORS = 0
)

```

donde:

- `https://acmedatalake.dfs.core.windows.net/flights/2019/` es el URL para acceder al Data Lake donde tenemos el archivo CSV. Como indicamos una carpeta, se copiarán datos de todos los archivos copiados en dicha carpeta
- `FILE_TYPE` indica que vamos a cargar los datos desde un archivo CSV. también se pueden cargar desde archivos Parquet o archivos ORC.
- `CREDENTIAL` tiene en este caso la llave de almacenamiento del Data Lake, pero admite otros tipos de credenciales
- `FIELDQUOTE`, `FIELDTERMINATOR` y `ROWTERMINATOR` indican los delimitadores del archivo CSV. El código `0X0A` es el cambio de línea, sin retorno de línea
- `MAXERRORS` en 0 indica que la carga abortará si se encuentra algún error en los datos

A pesar de que aún es una versión preliminar, la carga fue más rápida que con PolyBase.

| DWU | Archivos | Tiempo |
| --- | --- | --- |
| 100 DWU (1 nodo) | 1 | 25 seg |
| 100 DWU (1 nodo) | 4 | 12 seg |
