---
layout: post
title: "Fabric Apps - Consumo"
date: 2026-10-04
author: "Nelson López Centeno"
image: /assets/images/posts/2026-10-04-fabric-apps-consumo/dataXbi-fabric-apps-consumo-computo.png
categories: 
  - "sin-categoria"
tags: 
  - "fabric-apps"
  - "fabric"
---
En la sexta parte de la serie sobre *Fabric Apps* te muestro el consumo de la capacidad (CUs) de las demos que hemos implementado. 

<!--more-->

Para dar una idea del consumo he hecho algo muy sencillo y manual: 
- Me he puesto a explorar varias de las *Fabric Apps* de los posts anteriores, que están todas en la misma área de trabajo "Fabric App"
- Luego he utilizado [Fabric Capacity Metrics](https://learn.microsoft.com/es-es/fabric/enterprise/metrics-app?wt.mc_id=MVP_367391) para mirar el consumo de cómputo y de almacenamiento de dicha área de trabajo durante el día en que hice las pruebas.

> Si aún no te has leído [las entradas anteriores de la serie](https://www.dataxbi.com/blog/tag/fabric-apps/?orden=asc), te animo a que lo hagas antes de continuar.

Este post será muy breve porque consiste básicamente en mostrarte los gráficos de Capacity Metrics. Pero primero vamos a repasar lo que dice la documentación.


## ¿Qué dice la documentación sobre el consumo?

Aquí puedes leer la documentación oficial de precios y uso de capacidad: [https://learn.microsoft.com/es-es/fabric/apps/pricing](https://learn.microsoft.com/es-es/fabric/apps/pricing?wt.mc_id=MVP_367391).

Ten en cuenta que las *Fabric Apps* aún están en **versión preliminar**. 

Los elementos externos a la Fabric App **si se cobran** por el consumo de la capacidad:
- Base de datos SQL de Fabric
- API de Graph QL
- Funciones de Datos de Usuario (UDF) de Fabric
- La utilización que hace de OneLake el contenido estático de la Fabric App

Aquí yo añadiría:
- Consultas DAX a los modelos semánticos que utilice la Fabric App

Mientras que los componentes de la propia Fabric **no se cobran** por el consumo consumen de la capacidad:
- El servicio de hospedaje de la aplicación web
- La autenticación
- Las operaciones de despliegue (rayfin up)

Esto no significa que estas operaciones no puedan provocar consumo en otros elementos. Por ejemplo, las operaciones de escritura en OneLake que se realizan durante un despliegue sí consumen capacidad.

A continuación voy a mostrar como reflejan estos consumos Fabric Capacity Metrics.

## Cómputo

En la tabla de la imagen muestro los consumos por cómputo de los elementos de algunas de las Fabric Apps. He filtrado por el área de trabajo y por el día en que hice las pruebas. La tabla está ordenada por el nombre de la aplicaciones (columna *Item name*).

![Tabla de Fabric Capacity Metrics con los detalles del consumo de cómputo de algunas Fabric App](/assets/images/posts/2026-10-04-fabric-apps-consumo/dataXbi-fabric-apps-consumo-computo.png)

Si te fijas en la segunda columna (*Item kind*), que indica el tipo0 de elemento que generó el consumo, verás 3 valores diferentes: *AppBackend*, *SQLDbNative*, *Dataset*. Algunas aplicaciones tienen solo *AppBackend*, mientras que otras tienen *AppBackend* y *SQLDbNative*. En la lista también aparecen los modelos semánticos Finanzas y Ventas, que son los únicos del tipo *Dataset*.

Vamos a tomar de ejemplo las Fabric Apps **fabapp-dax-finance** y **fabapp-etl-config**.

### Consumo de cómputo de fabapp-dax-finance

En la imagen se muestran los detalles de **fabapp-dax-finance**, que aparece una sola vez en el listado con el tipo *AppBackend*. Te recuerdo que esta *Fabric App* se conecta al modelo semántico de Finanzas y que no utiliza una base de datos SQL.

![Detalles del consumo de cómputo de la Fabric App fabapp-dax-finance](/assets/images/posts/2026-10-04-fabric-apps-consumo/dataXbi-fabric-apps-consumo-computo-dax-finance.png)

En los detalles se observan solo 2 operaciones *billables* relacionadas con OneLake: **OneLake Other Operations** y **OneLake Read via Proxy** y que están relacionadas con el acceso al contenido estático de la Fabric App que se utiliza en el frontend y que está almacenado en OneLake pero no tenemos acceso directo a él.

Hay otro consumo de cómputo en el que ha incurrido esta aplicación y que no se ve en la imagen con los detalles: las consultas al modelo semántico Finanzas. 

En esta imagen muestro los detalles del consumo para Finanzas, donde se aprecia que la única operación es **XMLA Read Operation**, debido a las consultas DAX que se hacen desde la *Fabric App*.

![Detalles del consumo de cómputo del modelo semántico Finanzas](/assets/images/posts/2026-10-04-fabric-apps-consumo/dataXbi-fabric-apps-consumo-computo-dataset-finance.png)

### Consumo de cómputo de fabapp-etl-config

Ahora vamos a ver los detalles del consumo de cómputo de la *Fabric App* **fabapp-etl-config** que si utiliza una base de datos SQL y no utiliza un modelo semántico. Esta aplicación aparece dos veces en el listado, una vez con **AppBackend** y la otra con **SQLDbNative**.

En la siguiente imagen he expandido los detalles de **AppBackend**, donde se observan cuatro operaciones. **OneLake Other Operations** y **OneLake Read via Proxy** ya la vimos en la aplicación anterior. **OneLake Write via Proxy** es nuevo y se produce por un despliegue que hice de esta aplicación mediante rayfin up. La última operación es **GraphQL Query** es la que más me interesa porque representa el consumo de las consultas GraphQL sobre la base de datos SQL.

![Detalles del consumo de cómputo de la Fabric App fabapp-etl-config donde se observa la operación GraphQL Query](/assets/images/posts/2026-10-04-fabric-apps-consumo/dataXbi-fabric-apps-consumo-computo-etl-config.png)


También he abierto los detalles de la otra línea de esta *Fabric App*, correspondiente a **SQLDbNative** y que nos muestra las operaciones de la base de datos SQL vinculada a la aplicación.

La operación más importante es **Sql Usage**, que se refiere al consumo de las consultas T-SQL. También se ven varias operaciones de OneLake que son propias de la operación de la base de datos SQL.

![Detalles del consumo de cómputo de la base de datos SQL asociada con la Fabric App fabapp-etl-config](/assets/images/posts/2026-10-04-fabric-apps-consumo/dataXbi-fabric-apps-consumo-computo-etl-config-sql.png)


### Consumo de cómputo de otras *Fabric Apps*

He mostrado las operaciones que consumen capacidad de dos aplicaciones, una que se conecta a un modelo semántico y otra que se conecta a una base de datos SQL. Pero recuerda que entre los ejemplos de esta serie de blogs hay una aplicación que combina dos modelos semánticos y otra que combina un modelo semántico con una base de datos SQL. En este último caso aparecerán tanto operaciones de **Dataset** como de **SQLDbNative** dentro de la misma *Fabric App*.

## Almacenamiento

En cuanto al consumo de almacenamiento, adjunto una imagen con la página de almacenamiento de Capacity Metrics, filtrada por el área de trabajo donde están las *Fabric Apps* que he implementado en esta serie de blogs.

Puedes observar que hay operaciones de almacenamiento tanto en OneLake como en la base de datos SQL. El consumo de OneLake corresponde principalmente al contenido estático de las aplicaciones.

En el gráfico inferior izquierdo se aprecia que el almacenamiento se ha mantenido estable en los últimos días. Esto se debe a que todas las aplicaciones habían sido desplegadas a Fabric con anterioridad al primer día mostrado en el gráfico, y aunque he usado algunas de las aplicaciones, no he insertado muchos datos en ninguna de las bases de datos SQL.

El gráfico inferior derecho muestra el almacenamiento facturable acumulado durante el periodo, que se calcula mediante un prorrateo de los datos almacenados durante el intervalo de tiempo. Que el gráfico crezca de forma lineal indica que el volumen de datos se ha mantenido estable.

![Reporte del consumo de almacenamiento de las Fabric Apps reportado por Fabric Capacity Metric](/assets/images/posts/2026-10-04-fabric-apps-consumo/dataXbi-fabric-apps-cconsumo-almacenamiento.png)


## Continuará...

Gracias por llegar hasta aquí. 😊

La serie continuará, en la próxima entrega hablaré sobre las funciones.

