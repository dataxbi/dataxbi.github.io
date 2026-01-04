---
layout: post
title: "PoC ETL low cost con Fabric - Carga incremental"
date: 2024-03-26
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

En esta nueva entrega de nuestra serie sobre ETL low cost con Microsoft Fabric hablaremos de cómo hemos implementado una **carga incremental** desde algunos orígenes de datos hacia la capa bronce, utilizando los **Flujos de Datos Gen2**.

<!--more-->

**Nota**: Justo cuando estoy a punto de publicar este artículo **han anunciado que muy pronto los Flujos de Datos Gen2 tendrán actualización incremental**, así que en cuanto salga la versión preliminar lo indicaré aquí. De todas formas he publicado el artículo para que quede como referencia de lo que se hizo.

La carga incremental la vamos a hacer para los siguientes orígenes:

- **Bases de datos MySQL**: Hay dos bases de datos separadas, aunque con la misma estructura, una para las ventas en euros y otra para las ventas en dólares. La tabla `ventas` de cada base de datos contiene un registro de cada artículo que se ha vendido y usaremos la columna `Fecha Pedido` para cargar hacia la capa bronce las últimas ventas desde la última carga.
- **Carpeta Sharepoint con los presupuestos**: En esta carpeta hay archivos CSV con los presupuesto para cada tienda por año y mes. Cada archivo contiene los datos de un mes y su nombre sigue un formato como este: `presupuesto_2020_01.csv`, correspondiente al mes de enero de 2020, y usaremos dicho nombre para filtrar los archivos que falten por copiar hacia la capa bronce desde la última carga.
- **Carpeta Sharepoint con tickets de soporte**: En esta otra carpeta hay archivos CSV con un registro de los tickets de soporte a los clientes. Cada archivo contiene los tickets de un día y su nombre sigue un formato como este: `tickets_soporte_2020-01-01.csv` que corresponde al 1 de enero de 2020, y también usaremos dicho nombre para filtrar los archivos que falten por copiar hacia la capa bronce desde la última carga.

Resumiendo lo anterior, **para filtrar los datos a cargar**, en unos casos se utilizará una **columna de tipo fecha** de una tabla de una base de datos, y en otros casos se utilizará una **parte del nombre de los archivos de una carpeta**.

La razón por la que hemos utilizado los Flujos de Datos Gen2 para cargar estos datos a la capa bronce ya la explicamos en [una entrada anterior de esta serie](https://www.dataxbi.com/blog/2024/03/07/poc-etl-low-cost-con-fabric-capa-bronce/), y en esencia es porque por el momento las canalizaciones de Fabric no soportan de manera nativa la conexión a carpetas de Sharepoint o a orígenes que requieran una puerta de enlace.

Y una limitante que tienen por el momento los **Flujos de Datos Gen2** es precisamente que **no implementan la actualización incremental**, como si se puede hacer con los Flujos de Datos Gen1 siempre que residan en un área de trabajo con capacidad Premium.

Pero afortunadamente, no todo está perdido y es posible implementar una carga incremental utilizando una combinación de las nuevas funcionalidades ofrecidas por los Flujos de Datos Gen2 y por otros componentes de Fabric. Y de hecho hay algunas soluciones creadas por miembros de la comunidad y como no nos gusta inventar la rueda, hemos partido de la solución propuesta por Patrick LeBlanc, de Guy in a Cube, en [este vídeo](https://www.youtube.com/watch?v=uuIznvWX3zw) y que a su vez está inspirada en [un artículo de Alex Powers](https://itsnotaboutthecell.com/2023/10/16/change-in-the-house-of-lakes/).

![Para implementar la carga incremental con los Flujos de Datos Gen2 hemos partido de un vídeo de Guy in a Cube y de un artículo de Alex Powers](/assets/images/posts/2024-03-26-poc-etl-low-cost-fabric-carga-incremental/dataXbi-PoC-Fabric-ETL-low-cost-Carga-Incremental-Referencias.png)

La principal diferencia que tiene nuestra solución con la de Patrick es que mientras él utiliza un Datawarehouse de Fabric, nosotros utilizamos un Lakehouse, y esto tiene la consecuencia de que tendremos que usar un bloc de notas de Spark donde él utiliza un procedimiento almacenado.

Estos son los componentes de nuestra solución:

- El **lakehouse** donde están los datos de la capa bronce.
- Un archivo CSV para saber qué tablas tendrán actualización incremental y cuál será la columna que se utilizará para filtrar los datos. Este archivo tiene el nombre config\_actualizacion\_inc.csv y tiene dos columnas con los nombres tabla y columna\_max\_id, y se carga mediante un flujo de datos gen2 a una **tabla del lakehouse** con el nombre `config_actualizacion_inc`.
- Otra **tabla en el lakehouse** con el nombre `meta_actualización_inc` y que guarda por cada tabla con actualización incremental el valor máximo de la columna de filtrado. Esta tabla tiene dos columnas con los nombres origen y max\_id.
- Un **bloc de notas Spark** que recorre las tablas indicadas en `config_actualizacion_inc` para averiguar el valor máximo de cada columna y actualizar la tabla `meta_actualización_inc`.
- Una **función en Power Query M** que hemos creado con el nombre `fxOrigenMaxId` a la que se le pasa como parámetro el nombre de una tabla y devuelve el valor máximo de la columna, según lo almacenado en la tabla `config_actualizacion_inc`. Esta función se utiliza en las consultas donde se va a utilizar la actualización incremental para obtener el valor con el que se van a filtrar las filas.
- **Una canalización** que orquesta todo el proceso: 1) ejecuta el flujo que carga en archivo CSV en la tabla `config_actualizacion_inc` 2) ejecuta el bloc de notas que actualiza la tabla `meta_actualización_inc` 3) ejecuta los flujos de datos que cargan las tablas con actualización incremental y que utilizan la función `fxOrigenMaxId`.

En el siguiente diagrama intento representar el proceso, mostrando la canalización, las tablas de configuración y una muestra de dos consultas Power Query M donde se filtran los datos utilizando la función `fxOrigenMaxId`, en el primer caso para una columna de tipo texto correspondiente al nombre de un archivo, y en el segundo caso correspondiente al filtrado de una columna de tipo fecha.

![Diagrama mostrando los componentes y el proceso de carga incremental descrito en este artículo.](/assets/images/posts/2024-03-26-poc-etl-low-cost-fabric-carga-incremental/dataXbi-PoC-Fabric-ETL-low-cost-Carga-Incremental.png)

Para completar la configuración, en las consultas que utilicen la actualización incremental, al seleccionar el destino de los datos hay que indicar que utilice el método de actualización **Anexar**, como se muestra en la siguiente imagen.

![En las consultas con carga incremental hay que utilizar el método de actualización anexar.](/assets/images/posts/2024-03-26-poc-etl-low-cost-fabric-carga-incremental/dataXbi-PoC-Fabric-ETL-low-cost-Carga-Incremental-Anexar.png)

**Me parece importante señalar que para que este método funcione bien es necesario ejecutar la canalización completa y evitar ejecutar los flujos de datos con actualización incremental de manera independiente.**

Para terminar dejo por aquí dos imágenes con el código del bloc de notas Spark y de la función Power Query M.

![Bloc de notas Spark para actualizar la tabla de configuración de la carga incremental](/assets/images/posts/2024-03-26-poc-etl-low-cost-fabric-carga-incremental/dataXbi-PoC-Fabric-ETL-low-cost-Carga-Incremental-Notebook-Spark.png)

![Código Power Query M de la función fxOrigenMaxId](/assets/images/posts/2024-03-26-poc-etl-low-cost-fabric-carga-incremental/dataXbi-PoC-Fabric-ETL-low-cost-Carga-Incremental-Power-Query-M.png)

##### Todas las entradas de esta serie **ETL "low cost" con Fabric**

1. [Arquitectura](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/)
2. [Capacidad](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/)
3. [Capa bronce](https://www.dataxbi.com/blog/2024/03/07/poc-etl-low-cost-con-fabric-capa-bronce/)
4. [Carga incremental](https://www.dataxbi.com/blog/2024/03/26/poc-etl-low-cost-fabric-carga-incremental/)
5. [Capas plata y oro](https://www.dataxbi.com/blog/2024/04/27/poc-etl-low-cost-fabric-capas-plata-oro/)
6. [Costes](https://www.dataxbi.com/blog/2024/05/08/poc-etl-low-cost-fabric-costes/)
