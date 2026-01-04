---
layout: post
title: "ETL low cost con Fabric versi�n 2 - Arquitectura"
date: 2025-01-07
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

En febrero de 2024 comenzamos la serie de blogs [PoC ETL low cost con Fabric](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/), donde propusimos una implementaci�n de la _arquitectura medallion_ con la idea de mejorar el proceso de ETL de un cliente sustituyendo los flujos de datos Gen1 por los componentes de ingenier�a de datos de Fabric: flujos de datos Gen2, canalizaciones y cuadernos de notas Spark.

A partir de un a�o de experiencias en eventos, formaciones y proyectos, queremos proponerte una serie de mejoras respecto a esa primera versi�n que logren disminuir los costes de Fabric y hagan m�s eficientes los procesos que se llevan a cabo.

<!--more-->

Eso s�, manteniendo nuestra idea original de realizar el ETL o ELT en un �rea de trabajo con capacidad Fabric y tener el modelo sem�ntico en otra �rea de trabajo con capacidad PRO y la posibilidad de apagar y encender la capacidad Fabric para realizar la ETL y cargar los datos en el modelo sem�ntico.

Este es el primer blog de una nueva serie donde te iremos mostrando en detalle como implementar los cambios y mejoras que te proponemos en esta entrada.

### Arquitectura actual

En la siguiente imagen se muestra la arquitectura resultante de nuestra propuesta anterior:

![Fabric ETL low cost v2 - capas v1](/assets/images/posts/2025-01-07-etl-low-cost-fabric-version2-arquitectura/dataXbi-Fabric-ETL-low-cost-v2-capas-v1.png)

En esta arquitectura tenemos tres capas: Bronce, Plata y Oro. La capa Broce almacena los datos sin transformar, la capa Plata los datos limpios y la capa Oro los datos modelados. Para el almacenamiento de los datos en las capas Bronce y Plata utilizamos un Lakehouse mientras que en la Oro utilizamos un Warehouse (Almac�n). Los flujos de datos Gen2 se utilizaron tanto para la carga de los datos como para las transformaciones. Las canalizaciones se utilizaron para la extracci�n de datos de uno de los or�genes (API REST) y para orquestar todo el proceso de ETL, en cada capa y de manera general.

### Arquitectura propuesta

La arquitectura propuesta sigue siendo una _arquitectura medallion_ pero tiene una serie de diferencias y mejoras respecto a la anterior que son:

- Sustituiremos el origen de datos SharePoint por Azure Data Lake Storage Gen2.
- Separamos la capa Bronce en tres capas y se mantienen las capas Plata y Oro tal y como est�n ahora.
- No utilizaremos los flujos de datos Gen2. En su lugar utilizaremos cuadernos de notas Spark y canalizaciones.
- Para realizar la extracci�n de los datos utilizaremos por defecto las canalizaciones de datos y en algunos casos concretos los cuadernos Spark.
- En la transformaci�n y el modelado de los datos utilizaremos los cuadernos Spark.
- Para orquestar todo el proceso de ETL utilizaremos las canalizaciones de datos.

Para tomar la decisi�n de sustituir SharePoint por ADLS Gen2 tuvimos en cuenta que desde SharePoint no pod�amos utilizar las canalizaciones de datos para la extracci�n de datos, al menos de una forma sencilla y utilizando solo Fabric. Las canalizaciones de datos son la opci�n recomendada por Microsoft para esta tarea porque proporcionan una manera de mover datos del origen al destino de forma confiable, escalable y eficaz. Tambi�n tuvimos en cuenta que el coste de almacenamiento de los datos en ADLS Gen2 es muy econ�mico.

### Capa Bronce: Dividir en Landing, Raw y Validaci�n

En lugar de tener una sola capa, Bronce, la propuesta es tener tres capas: Landing, Raw y Validaci�n. Cada capa tendr� su propio Lakehouse y funcionalidades diferentes. La capa Bronce de la versi�n anterior es equivalente a la capa Raw de la nueva propuesta. En la versi�n anterior los datos se almacenaban en tablas y no se validaban.

#### Capa Landing

La primera capa, **Landing**, almacenar� una copia de los datos lo m�s exacta posible a como se encuentran en los or�genes de datos con la finalidad de que sean la �nica fuente de la verdad y garantizar su inmutabilidad y trazabilidad. Los datos se anexan de manera incremental y aumentan con el tiempo. Permite volver a procesar y auditar conservando todos los datos hist�ricos. No est� pensada para el uso de analistas ni cient�ficos de datos sino para de realizar cargas en la siguiente capa.

En esta capa los datos se almacenar�n **en archivos** Parquet y JSON, dependiendo del origen.

#### Capa Raw

La segunda capa, **Raw**, almacenar� los datos de la capa Landing en tablas Delta. Las tablas Delta almacenan los datos en formato columnar lo que nos proporciona mayores opciones para la compresi�n de los datos y nos permite realizar consultas m�s eficientes de un subconjunto de datos.

Solo se realizar�n transformaciones m�nimas sobre los datos con el fin de garantizar que cumplan con las restricciones de las tablas Deltas en Fabric. Los datos se almacenar�n particionados, con estructura jer�rquica de a�o, mes, d�a. Para cargar los datos se utilizar�n cuadernos Spark parametrizados lo que permitir� la reutilizaci�n de los mismos.

#### Capa Validaci�n

La tercera capa, **Validaci�n**, comprobar� que los datos almacenados en la capa Raw cumplan una serie de reglas predefinidas de antemano, esto nos permitir� garantizar la integridad y calidad de los datos que pasen a la capa Plata. Por cada tabla validada se crear�n dos nuevas tablas en la capa Validaci�n, una con las filas que contienen valores correctos para todas las columnas y otra con las filas que contienen errores en alguna de las columnas.

Entre las reglas que podemos validar est�n el que una columna no contenga valores vac�os, que el tipo de dato de la columna sea el esperado, que una columna contenga valores �nicos, que los valores de una columna se encuentren dentro de un rango, que los valores de una columna est�n dentro de una lista, etc.

### Capa Plata

Esta capa se mantiene con un solo Lakehouse al que hemos llamado Plata y es donde se realizar�n la mayor parte de las transformaciones sobre los datos. La novedad en esta propuesta es que esas transformaciones se llevar�n a cabo con cuadernos de Sparks en lugar de flujos de datos Gen2. Con los cuadernos Spark tenemos que escribir c�digo pero tiene la ventaja de que nos ofrece mayores opciones de parametrizaci�n y reusabilidad. Utilizaremos **Data Wrangler** y **Copilot** para que nos ayuden a escribir el c�digo de algunas transformaciones.

La primera transformaci�n que se llevar� a cabo es la deduplicaci�n de los datos y luego el resto de transformaciones como seleccionar columnas, recortar columnas de texto, convertir a may�sculas el valor de algunas columnas de texto, etc.

### Capa Oro

En esta capa es donde se realiza el enriquecimiento y modelado de los datos. Para el almacenamiento de los datos en lugar de proponerte un Almac�n, como hicimos en la versi�n anterior, te proponemos 3 variantes dependiendo de tus requerimientos: Lakehouse, Almac�n o SQL Database. Este �ltimo almacenamiento no exist�a cuando escribimos la serie anterior.

Para nosotros la opci�n recomendada es el Lakehouse pero depende del volumen de tus datos y del procesamiento que requieran. En el art�culo [¿Qu� es la arquitectura de medall�n de Lakehouse?](https://learn.microsoft.com/es-es/azure/databricks/lakehouse/medallion?wt.mc_id=DP-MVP-5005188) encontrar�s un ejemplo de implementaci�n de esta arquitectura.

La siguiente imagen muestra la nueva arquitectura propuesta.

![dataXbi - ETL con Fabric propuesta de mejoras a la Arquitectura](/assets/images/posts/2025-01-07-etl-low-cost-fabric-version2-arquitectura/dataXbi-Fabric-ETL-low-cost-v2-capas-v2.png)

### Conclusiones

Esta nueva versi�n de la arquitectura resuelve problemas como la deduplicaci�n y la validaci�n de los datos que no se tuvieron en cuenta en la primera, adem�s de dar varias opciones de almacenamiento de la capa Oro donde realizamos el modelado de los datos.

En nuevas entradas entraremos en los detalles de como implementar cada capa y acerca de las distintas capacidades de Fabric y sus costes.
