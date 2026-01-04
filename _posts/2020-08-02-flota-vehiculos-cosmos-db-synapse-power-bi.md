---
layout: post
title: "Seguimiento a una flota de veh�culos con Cosmos DB,  Synapse y Power BI"
date: 2020-08-02
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "powerbi"
  - "python"
  - "synapse"
  - "video"
---

En el evento "Microsoft Build 2020" fue lanzado en "preview" el servicio Azure Synapse Link para Azure Cosmos DB, y en esta entrada explicamos en qu� consiste a trav�s de un ejemplo en el que crearemos un panel en Power BI para monitorear el desempe�o de una flota de veh�culos.

<!--more-->

![Synapse Link Cosmos DB - Power BI](/assets/images/posts/2020-08-02-flota-vehiculos-cosmos-db-synapse-power-bi/synapse-link.jpg)

### Synapse link para Cosmos DB

Azure Cosmos DB es un servicio de base de datos NoSQL o semiestructurados, mientras que Azure Synapse Analytics es un servicio que combina un almac�n de datos (DW) con herramientas para el an�lisis y la ingesti�n de datos.

Las bases de datos en Cosmos DB est�n optimizadas para guardar datos operativos por lo que utilizan un almac�n de filas.  

Synapse link a�ade un almacenamiento adicional a Cosmos DB optimizado para el an�lisis de datos por lo que es un almac�n de columnas y puede ser consultado de forma eficaz con la herramientas de Synapse Analytics.

Adem�s, Synapse link se encarga de mantener sincronizado el almacenamiento anal�tico con el transaccional de forma que los cambios se reflejan en pocos segundos.

Esto es lo que se conoce como HTAP (Hybrid Transactional Analytical Processing).

Tuve la inmensa oportunidad de presentar una charla con el contenido de esta entrada de blog en la [NetCoreConf Virtual2 2020](https://netcoreconf.com/virtual-octubre.html)

<iframe width="560" height="315" src="https://www.youtube.com/embed/cZxJfu_cOjI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Simulaci�n de la flota de veh�culos

Para demostrar un caso de uso de Synapse Link, simularemos la operaci�n de una flota de veh�culos, donde cada veh�culo env�a actualizaciones de su estado a Azure Cosmos DB. En Synapse Analytics se estar� ejecutando una tarea que contar� la cantidad de veh�culos en viajes, y notificar� a Power BI para que actualice un panel donde se puede dar seguimiento al estado de la flota.

Los veh�culos pueden estar parados o viajando y antes de comenzar un viaje se cargan las mercanc�as y al finalizar un viaje se descargan.

Estos son los identificadores de los estados por los que puede pasar un veh�culo:

- stopped
- load-started
- load-finished
- trip-started
- trip-otw
- trip-finished
- unload-started
- unload-finished

El identificador trip-otw indica que el veh�culo est� viajando (on the way).

Se env�an actualizaciones a Cosmos DB cada vez que hay un cambio de estado y mientras el veh�culo est� viajando se env�a una actualizaci�n cada 5 segundos.

Este es un ejemplo de los datos que se env�an a Cosmos DB durante un viaje:

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

La simulaci�n se ha implementado en Python y el c�digo est� disponible en [GitHub](https://github.com/dataxbi/synapse-link)

### Cosmos DB

Antes de ejecutar la simulaci�n, debemos preparar los distintos componentes y comenzaremos con Cosmos DB, que es d�nde se almacenar�n los datos enviados por los veh�culos.

- Crear una cuenta Cosmos DB con la API SQL.
- Habilita el enlace con Synapse.
- Crear una base de datos.
- En la base de datos, crear un nuevo contenedor.
- En el contenedor, habilitar el almacenamiento anal�tico.

El siguiente v�deo muestra c�mo llevar a cabo esta configuraci�n utilizando el portal de Azure.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=20&amp;end=419&amp;rel=0" frameborder="0" allowfullscreen></iframe>

### Synapse Analytics

El almacenamiento anal�tico que se ha configurado en Cosmos DB s�lo puede ser consultado desde Synapse Analytics, y para ello debemos hacer varias cosas.

- Crear un �rea de trabajo Synapse Analytics, que utilizar� Azure Data Lake Storage Gen2 como soporte de almacenamiento.
- Dentro del �rea de trabajo, ir a Synapse Studio.
- Crear una conexi�n externa hacia la base de datos que hemos creado en Cosmos DB.
- Crear un notebook para ejecutar algunas queries Spark SQL
- Crear un pool Spark para poder ejecutar las queries del notebook
- Crear una tabla local enlazada al almacenamiento anal�tico del contenedor que hemos creado en Cosmos DB.  
    Esta tabla no contendr� los datos, s�lo la estructura, y cuando se ejecute una query buscar� los datos directamente en el almacenamiento anal�tico de Cosmos DB.
- Crear una query Spark SQL para extraer la cantidad de veh�culos totales y la cantidad de veh�culos en viaje

El siguiente v�deo muestra c�mo llevar a cabo esta configuraci�n utilizando el portal de Azure.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=440&amp;end=1135&amp;rel=0" frameborder="0" allowfullscreen></iframe>

El c�digo de este notebook est� disponible en [GitHub](https://github.com/dataxbi/synapse-link)

### Power BI

El seguimiento de la flota de veh�culos se har� desde un panel en Power BI que es el �ltimo componente ha configurar.

- Crear un conjunto de datos de streaming que utilice una API como origen de datos y con los siguientes campos:
    - TotalVehicles (n�mero)
    - VehiclesOnTheWay (n�mero)
    - Timestamp (DateTime)
- Crear un panel con visualizaciones en tiempo real que utilicen el conjunto de datos streaming

El siguiente v�deo muestra c�mo llevar a cabo esta configuraci�n utilizando el servicio de Power BI.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=1157&amp;end=1465&amp;rel=0" frameborder="0" allowfullscreen></iframe>

### Env�o de notificaciones a Power BI desde Synapse

Volvemos a Synapse Studio para preparar el env�o de las notificaciones hacia el conjunto de datos streaming que creamos en Power BI.

- Crear un notebook con un script PySpark que
    - ejecutar� la query para contar los veh�culos totales y en viajes
    - convertir� los datos al formato JSON esperado por el conjunto de datos streaming
    - se conectar� a la API del conjunto de datos streaming y le enviar� los datos
- Crear una pipeline que contenga el notebook
- Crear un trigger que ejecute la pipeline cada 5 minutos

El siguiente v�deo muestra c�mo llevar a cabo esta configuraci�n utilizando el portal de Azure.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=1482&amp;end=1909&amp;rel=0" frameborder="0" allowfullscreen></iframe>

El c�digo de este notebook est� disponible en [GitHub](https://github.com/dataxbi/synapse-link)

### Resultado final

Y ya con todo preparado se har� una simulaci�n con 100 veh�culos y 200 viajes, que se puede ver en el siguiente v�deo (en c�mara r�pida).

<iframe width="560" height="315" src="https://www.youtube.com/embed/Aw0bdA-bIbU?start=1918&amp;rel=0" frameborder="0" allowfullscreen></iframe>

### Referencias

- [Build 2020 Synapse Link Overview (v�deo)](https://azure.microsoft.com/es-es/resources/videos/build-2020-synapse-link-overview/)
- [¿Qu� es el almac�n anal�tico de Azure Cosmos DB?](https://docs.microsoft.com/es-es/azure/cosmos-db/analytical-store-introduction)
- [Azure Synapse Link for Azure Cosmos DB - Samples (GitHub)](https://github.com/Azure-Samples/cosmosdb-synapse-link-samples)
