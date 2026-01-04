---
layout: post
title: "Tablas híbridas, Synapse y Icon Map"
date: 2022-08-08
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "synapse"
  - "video"
---

Comparto el vídeo de la presentación que hicimos en la sesión XIX de Power Platform Madrid celebrada el 28 de abril de 2022 donde estuvimos conversando acerca de las tablas híbridas de Power BI, Synapse y Icon Map.

<!--more-->

Para esta sesión creamos un informe donde mostramos en un mapa la posición y el destino de los vuelos en cada momento. Utilizamos el objeto visual Icon Map para la visualización de los vuelos y segmentaciones de datos para escoger la aerolínea, el aeropuerto de salida, el aeropuerto de destino, la fecha, hora y minuto a mostrar.

Los orígenes de datos del modelo son datos de tráfico aéreo recopilados por dos servicios gratuitos. El primero de estos servicios, [The OpenSky Network](https://opensky-network.org/), tiene una API que permite recuperar información del estado de los vuelos en tiempo real. Cómo la información que devuelve el servicio no es histórica creamos un almacén de datos en Azure Synapse para almacenarla y así tener tanto datos históricos como en tiempo casi real ( cada un minuto ) de los vuelos.

El segundo servicio, [Aviation Edge â€“ Database and API](https://aviation-edge.com/), tiene APIs que devuelven datos de aerolíneas, aeropuertos y rutas con códigos IATA tanto históricos como en tiempo real que utilizamos para crear la tabla de rutas de nuestro modelo.

Te invitamos a que veas el video para conocer los detalles de la implementación.

### Vídeo

<iframe width="560" height="315" src="https://www.youtube.com/embed/86wvDP-SRzY" frameborder="0" allowfullscreen></iframe>
