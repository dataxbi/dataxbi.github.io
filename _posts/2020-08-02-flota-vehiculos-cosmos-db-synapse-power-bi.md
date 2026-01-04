---
layout: post
title: "Seguimiento a una flota de vehículos con Cosmos DB,  Synapse y Power BI"
date: 2020-08-02
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "powerbi"
  - "python"
  - "synapse"
  - "video"
---

En el evento "Microsoft Build 2020" fue lanzado en "preview" el servicio Azure Synapse Link para Azure Cosmos DB, y en esta entrada explicamos en qué consiste a través de un ejemplo en el que crearemos un panel en Power BI para monitorear el desempeño de una flota de vehículos.

<!--more-->

![Synapse Link Cosmos DB - Power BI](/assets/images/posts/2020-08-02-flota-vehiculos-cosmos-db-synapse-power-bi/synapse-link.jpg)

### Synapse link para Cosmos DB

Azure Cosmos DB es un servicio de base de datos NoSQL o semiestructurados, mientras que Azure Synapse Analytics es un servicio que combina un almacén de datos (DW) con herramientas para el análisis y la ingestión de datos.

Las bases de datos en Cosmos DB están optimizadas para guardar datos operativos por lo que utilizan un almacén de filas.  

Synapse link añade un almacenamiento adicional a Cosmos DB optimizado para el análisis de datos por lo que es un almacén de columnas y puede ser consultado de forma eficaz con la herramientas de Synapse Analytics.

Además, Synapse link se encarga de mantener sincronizado el almacenamiento analítico con el transaccional de forma que los cambios se reflejan en pocos segundos.

Esto es lo que se conoce como HTAP (Hybrid Transactional Analytical Processing).

Tuve la inmensa oportunidad de presentar una charla con el contenido de esta entrada de blog en la [NetCoreConf Virtual2 2020](https://netcoreconf.com/virtual-octubre.html)

<iframe width="560" height="315" src="https://www.youtube.com/embed/cZxJfu_cOjI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Simulación de la flota de vehículos

Para demostrar un caso de uso de Synapse Link, simularemos la operación de una flota de vehículos, donde cada vehículo envía actualizaciones de su estado a Azure Cosmos DB. En Synapse Analytics se estará ejecutando una tarea que contará la cantidad de vehículos en viajes, y notificará a Power BI para que actualice un panel donde se puede dar seguimiento al estado de la flota.

Los vehículos pueden estar parados o viajando y antes de comenzar un viaje se cargan las mercancías y al finalizar un viaje se descargan.

Estos son los identificadores de los estados por los que puede pasar un vehículo:

- stopped
- load-started
- load-finished
- trip-started
- trip-otw
- trip-finished
- unload-started
- unload-finished

El identificador trip-otw indica que el vehículo está viajando (on the way).

Se envían actualizaciones a Cosmos DB cada vez que hay un cambio de estado y mientras el vehículo está viajando se envía una actualización cada 5 segundos.

Este es un ejemplo de los datos que se envían a Cosmos DB durante un viaje:

```
    {
        "id": "b00d6b7ac4934991aca6c3c67bd14e90",
        "plate_number": "1677 BYO",
        "vehicle_id": "b099829a39c3468daabd48ec4360571c",
        "status": "trip-otw",
        "timestamp": "2020-06-22 21:19:51.548",
        "kms": 5,
        "trip_id": "5feea2a1768c4ec0807d1a909f8530d7",
        "trip_name": "Trip 2000"
    }

```

La simulación se ha implementado en Python y el código está disponible en [GitHub](https://github.com/dataxbi/synapse-link)

### Cosmos DB

Antes de ejecutar la simulación, debemos preparar los distintos componentes y comenzaremos con Cosmos DB, que es dónde se almacenarán los datos enviados por los vehículos.

- Crear una cuenta Cosmos DB con la API SQL.
- Habilita el enlace con Synapse.
- Crear una base de datos.
- En la base de datos, crear un nuevo contenedor.
- En el contenedor, habilitar el almacenamiento analítico.

El siguiente vídeo muestra cómo llevar a cabo esta configuración utilizando el portal de Azure.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=20&amp;end=419&amp;rel=0" frameborder="0" allowfullscreen></iframe>

### Synapse Analytics

El almacenamiento analítico que se ha configurado en Cosmos DB sólo puede ser consultado desde Synapse Analytics, y para ello debemos hacer varias cosas.

- Crear un área de trabajo Synapse Analytics, que utilizará Azure Data Lake Storage Gen2 como soporte de almacenamiento.
- Dentro del área de trabajo, ir a Synapse Studio.
- Crear una conexión externa hacia la base de datos que hemos creado en Cosmos DB.
- Crear un notebook para ejecutar algunas queries Spark SQL
- Crear un pool Spark para poder ejecutar las queries del notebook
- Crear una tabla local enlazada al almacenamiento analítico del contenedor que hemos creado en Cosmos DB.  
    Esta tabla no contendrá los datos, sólo la estructura, y cuando se ejecute una query buscará los datos directamente en el almacenamiento analítico de Cosmos DB.
- Crear una query Spark SQL para extraer la cantidad de vehículos totales y la cantidad de vehículos en viaje

El siguiente vídeo muestra cómo llevar a cabo esta configuración utilizando el portal de Azure.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=440&amp;end=1135&amp;rel=0" frameborder="0" allowfullscreen></iframe>

El código de este notebook está disponible en [GitHub](https://github.com/dataxbi/synapse-link)

### Power BI

El seguimiento de la flota de vehículos se hará desde un panel en Power BI que es el último componente ha configurar.

- Crear un conjunto de datos de streaming que utilice una API como origen de datos y con los siguientes campos:
    - TotalVehicles (número)
    - VehiclesOnTheWay (número)
    - Timestamp (DateTime)
- Crear un panel con visualizaciones en tiempo real que utilicen el conjunto de datos streaming

El siguiente vídeo muestra cómo llevar a cabo esta configuración utilizando el servicio de Power BI.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=1157&amp;end=1465&amp;rel=0" frameborder="0" allowfullscreen></iframe>

### Envío de notificaciones a Power BI desde Synapse

Volvemos a Synapse Studio para preparar el envío de las notificaciones hacia el conjunto de datos streaming que creamos en Power BI.

- Crear un notebook con un script PySpark que
    - ejecutará la query para contar los vehículos totales y en viajes
    - convertirá los datos al formato JSON esperado por el conjunto de datos streaming
    - se conectará a la API del conjunto de datos streaming y le enviará los datos
- Crear una pipeline que contenga el notebook
- Crear un trigger que ejecute la pipeline cada 5 minutos

El siguiente vídeo muestra cómo llevar a cabo esta configuración utilizando el portal de Azure.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=1482&amp;end=1909&amp;rel=0" frameborder="0" allowfullscreen></iframe>

El código de este notebook está disponible en [GitHub](https://github.com/dataxbi/synapse-link)

### Resultado final

Y ya con todo preparado se hará una simulación con 100 vehículos y 200 viajes, que se puede ver en el siguiente vídeo (en cámara rápida).

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=1918&amp;rel=0" frameborder="0" allowfullscreen></iframe>

### Referencias

- [Build 2020 Synapse Link Overview (vídeo)](https://azure.microsoft.com/es-es/resources/videos/build-2020-synapse-link-overview/)
- [Â¿Qué es el almacén analítico de Azure Cosmos DB?](https://docs.microsoft.com/es-es/azure/cosmos-db/analytical-store-introduction)
- [Azure Synapse Link for Azure Cosmos DB - Samples (GitHub)](https://github.com/Azure-Samples/cosmosdb-synapse-link-samples)
