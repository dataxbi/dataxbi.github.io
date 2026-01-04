---
layout: post
title: "Power BI Embedded"
date: 2020-10-20
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "powerbi-embedded"
---

Seguro que ya has escuchado hablar de Power BI Embedded y conoces que permite incrustar reportes Power BI en aplicaciones web. En esta entrada me centrar� en las aplicaciones web que dan servicios a terceros y donde los usuarios finales no necesitan ninguna licencia de Power BI. La intenci�n es presentar una visi�n general, explicando c�mo funciona, qu� se puede hacer y qu� se necesita para implementarlo.

<!--more-->

## ¿C�mo funciona Power BI Embedded?

En el diagrama se muestran los componentes involucrados en una soluci�n que implemente una aplicaci�n web que utilice Power BI como servicio de an�lisis de datos. En la izquierda tenemos la aplicaci�n web, a la derecha tenemos el servicio Power BI y en el centro tenemos Azure Active Directory.

![Power BI Embedded](/assets/images/posts/2020-10-20-power-bi-embedded/dataXbi-power-bi-embedded.png)

En el servicio Power BI tenemos un �rea de trabajo que contiene un informe con varias visualizaciones y un conjunto de datos. Tambi�n se representa la API REST de Power BI, con la cu�l se comunicar� la aplicaci�n web.

La aplicaci�n web est� dividida en el frontend y el backend. En el frontend se representa una p�gina web que tiene insertada una visualizaci�n proveniente del reporte en Power BI y tambi�n contiene una biblioteca JavaScript para interactuar con el servicio Power BI. El backend utiliza su propia base de datos para autenticar a los usuarios de la aplicaci�n y se comunica con el servicio Power BI a trav�s de la API REST.

El flujo ser�a el siguiente:

1. Un usuario quiere acceder a la aplicaci�n web desde su navegador, para lo que tiene que entrar sus credenciales.
2. La solicitud y las credenciales se env�an al backend.
3. Las credenciales del usuario son verificadas con la base de datos de la aplicaci�n web.
4. El backend se comunica con Azure AD para pedirle autorizaci�n para acceder al servicio Power BI. Y Azure AD devuelve un access token, que es un JSON codificado y con firma digital que contiene los permisos concedidos a la aplicaci�n web.
5. Utilizando el access token, el backend se comunica con la API REST del servicio Power BI y le pide acceso a la visualizaci�n que quiere mostrar en la p�gina web. Y la API REST devuelve un embed token con los permisos solicitados.
6. El embed token es devuelto al frontend donde ser� utilizado para configurar la biblioteca JavaScript de Power BI.
7. La biblioteca JavaScript de Power BI inserta la visualizaci�n en la p�gina web utilizando un iframe que apunta al servicio de Power BI, al que hay que pasarle el embed token para que autorize el uso de la visualizai�n.

Quiero destacar que el access token y el embed token le dan permisos a la aplicaci�n web, no al usuario individual que accede a la aplicaci�n web, por lo que el usuario no necesita cuenta ni en Azure ni en el servico Power BI.

## ¿Que se puede hacer?

Utilizando la biblioteca JavaScript de Power BI se puede personalizar el contenido que se inserta y tambi�n se puede interactuar con �l.

Hay varios aspectos que se pueden personalizar:

- Informes: Se puede decidir qu� partes ocultar o mostrar, por ejemplo, la navegaci�n de p�ginas, el panel de filtros, el panel de visualizaciones, el panel de campos o de marcadores.
- Visualizaciones: En lugar de mostrar un informe completo, es posible mostrar una sola visualizaci�n, o varias.
- Paneles: Insertar un �cono (tile) de un panel.
- Temas: Cambiar o personalizar el tema de un informe.
- Preguntas y respuestas: Hay una configuraci�n espec�fica para insertar las preguntas y respuestas, con tres opciones: permitir hacer cualquier pregunta, una pregunta fija que se puede modificar, o una pregunta fija que no se puede modificar.

Podemos interactuar de varias formas con el contenido insertado:

- Filtros: Leer los filtros ya aplicados o aplicar nuevos filtros.
- Segmentaciones: Leer el estado o cambiarlo.
- Marcadores: Aplicar marcadores existentes o crear nuevos.
- P�ginas: Obtener un listado de las p�ginas y cambiar la p�gina activa.
- Visualizaciones: Obtener un listado de las visualizaciones en una p�gina y ocultarlas o mostrarlas o cambiarles la posici�n.
- Eventos: Se generan algunos eventos, por ejemplo, cuando se cambia de p�gina, o se cambia un filtro.
- Exportar datos de una visualizaci�n.
- Cambiar din�micamente el conjunto de datos utilizado por el informe.

Puedes probar muchas de estas funcionalidades en esta p�gina: [https://microsoft.github.io/PowerBI-JavaScript/demo/v2-demo/](https://microsoft.github.io/PowerBI-JavaScript/demo/v2-demo/)

## Requerimientos

#### Cuenta Power BI Pro

Debemos tener al menos una cuenta Power BI con licencia Pro para poder publicar los conjuntos de datos y los reportes que vamos a insertar en la aplicaci�n.

#### Registrar la aplicaci�n en Azure AD (Active Directory)

Para que Azure AD pueda generar un access token que autorice al backend a utilizar la API REST de Power BI es necesario registrar una aplicaci�n en Azure AD.

El registro se puede hacer desde el portal de Azure, pero desde esta p�gina es m�s sencillo: [https://dev.powerbi.com/apps](https://dev.powerbi.com/apps)

#### Capacidad Power BI Embedded en Azure

Para utilizar Power BI Embedded en producci�n es necesario crear un recurso Power BI Embedded en Azure, el cual tiene un coste y se ofrece en varias configuraciones (o capacidades).

Estas son las capacidades y precios para Oeste de Europa (16-Octubre-2020):

| TIPO DE NODO | NÚCLEOS VIRTUALES | MEMORIA | NÚCLEOS FRONT-END/BACK-END | PRECIO |

| A1 | 1 | 3 GB RAM | 0,5 / 0,5 | €0,8502/hora |
| A2 | 2 | 5 GB RAM | 1 / 1 | €1,6935/hora |
| A3 | 4 | 10 GB RAM | 2 / 2 | €3,3937/hora |
| A4 | 8 | 25 GB RAM | 4 / 4 | €6,7941/hora |
| A5 | 16 | 50 GB RAM | 8 / 8 | €13,5949/hora |
| A6 | 32 | 100 GB RAM | 16 / 16 | €27,1970/hora |

Puedes consultar los precios en esta p�gina: [https://azure.microsoft.com/es-es/pricing/details/power-bi-embedded/](https://azure.microsoft.com/es-es/pricing/details/power-bi-embedded/).

Esta capacidad hay que asignarla al �rea de trabajo de Power BI donde est�n los conjuntos de datos y los reportes que vayamos a insertar en la aplicaci�n. En las �reas de trabajo de desarrollo y pruebas no es necesario asignarla, pero hay que tener en cuenta que en ese caso hay un l�mite en la cantidad de embed token que generar� la API REST de Power BI.

Desde el portal de Azure se puede pausar la capacidad en cualquier momento y reanudarla luego, y mientras est� en pausa no se factura. Tambi�n se puede cambiar el tipo de nodo (escalar) en cualquier momento.

Adem�s Azure tiene una API REST para manejar estas capacidades, que podr�amos utilizar para automatizar. Por ejemplo, podr�amos pausar la capacidad todas las noches y fines de semana para ahorrar costes.

#### Desarrollo de la aplicaci�n

Puedes encontrar la documentaci�n para desarrollar con Power BI Embedded en esta p�gina: [https://docs.microsoft.com/es-es/power-bi/developer/embedded/embedding](https://docs.microsoft.com/es-es/power-bi/developer/embedded/embedding)

Enlaces directos a la documentaci�n de las APIs:

- API REST Power BI: [https://docs.microsoft.com/es-es/rest/api/power-bi/](https://docs.microsoft.com/es-es/rest/api/power-bi/)
- API JavaScript: [https://github.com/Microsoft/PowerBI-JavaScript/wiki](https://github.com/Microsoft/PowerBI-JavaScript/wiki)
- API REST de Azure para manejar las capacidades Power BI Embedded: [https://docs.microsoft.com/es-es/rest/api/power-bi-embedded/](https://docs.microsoft.com/es-es/rest/api/power-bi-embedded/)

Si desarrollas en .NET, hay una biblioteca para conectarse a la API REST de Power BI: [https://www.nuget.org/packages/Microsoft.PowerBI.Api/](https://www.nuget.org/packages/Microsoft.PowerBI.Api/).  
Y tambi�n hay otro paquete NuGet con la biblioteca JavaScript para Power BI: [https://www.nuget.org/packages/Microsoft.PowerBI.JavaScript/](https://www.nuget.org/packages/Microsoft.PowerBI.JavaScript/).

Por �ltimo te dejo un link a ejemplos preparados por Microsoft en .NET Framework, .NET Core, Python, Java y NodeJS: [https://github.com/microsoft/PowerBI-Developer-Samples](https://github.com/microsoft/PowerBI-Developer-Samples)
