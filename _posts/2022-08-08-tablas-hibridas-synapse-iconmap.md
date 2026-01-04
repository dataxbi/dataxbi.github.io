---
layout: post
title: "Tablas h�bridas, Synapse y Icon Map"
date: 2022-08-08
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "synapse"
  - "video"
---

Comparto el v�deo de la presentaci�n que hicimos en la sesi�n XIX de Power Platform Madrid celebrada el 28 de abril de 2022 donde estuvimos conversando acerca de las tablas h�bridas de Power BI, Synapse y Icon Map.

<!--more-->

Para esta sesi�n creamos un informe donde mostramos en un mapa la posici�n y el destino de los vuelos en cada momento. Utilizamos el objeto visual Icon Map para la visualizaci�n de los vuelos y segmentaciones de datos para escoger la aerol�nea, el aeropuerto de salida, el aeropuerto de destino, la fecha, hora y minuto a mostrar.

Los or�genes de datos del modelo son datos de tr�fico a�reo recopilados por dos servicios gratuitos. El primero de estos servicios, [The OpenSky Network](https://opensky-network.org/), tiene una API que permite recuperar informaci�n del estado de los vuelos en tiempo real. C�mo la informaci�n que devuelve el servicio no es hist�rica creamos un almac�n de datos en Azure Synapse para almacenarla y as� tener tanto datos hist�ricos como en tiempo casi real ( cada un minuto ) de los vuelos.

El segundo servicio, [Aviation Edge – Database and API](https://aviation-edge.com/), tiene APIs que devuelven datos de aerol�neas, aeropuertos y rutas con c�digos IATA tanto hist�ricos como en tiempo real que utilizamos para crear la tabla de rutas de nuestro modelo.

Te invitamos a que veas el video para conocer los detalles de la implementaci�n.

### V�deo

<iframe width="560" height="315" src="https://www.youtube.com/embed/86wvDP-SRzY" frameborder="0" allowfullscreen></iframe>
