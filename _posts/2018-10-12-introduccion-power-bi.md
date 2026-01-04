---
layout: post
title: "Introducción a Power BI"
date: 2018-10-12
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
---

Power BI es una solución creada por Microsoft para resolver varios problemas del análisis de datos, como la adquisición, el modelado y la visualización.

<!--more-->

### Componentes

Está formado por varios componentes, que a continuación describimos brevemente.

#### Power BI Desktop

Aplicación gratuita de escritorio para Windows con la que se puede conectar a distintas fuentes de datos, limpiarlos y transformarlos, crear un modelo de datos y crear informes. Tiene un Editor de Consultas que utiliza el lenguaje M, para la captura y procesamiento de los datos. En la creación del modelo de datos se utiliza el lenguaje DAX. El resultado se almacena en un archivo PBIX.

#### Servicio Power BI

Servicio en línea donde se pueden publicar los archivos PBIX para compartirlos con otros usuarios y programar la actualización periódica de los datos. También permite crear cuadros de mando, establecer alertas y exportar los datos a Excel. Se pueden editar los reportes en línea, pero no el modelo de datos.

  

#### On-Premise Data Gateway

Aplicación Windows que permite conectar los datos con el servicio de Power BI. Hay dos versiones, una versión personal, para conectar los datos en el ordenador de un individuo, y otra versión para ser instalada en un servidor y conectar los datos desde los servidores de la empresa. No es necesario usar un Gateway si los datos están alojados en un servicio de Azure, como, por ejemplo, Azure SQL Server.

#### Power BI Report Server

Aplicación Windows para ser instalada en los servidores de la empresa que permite publicar los archivos PBIX y también informes hechos para SQL Server Report Server. Algunas características del servicio Power BI no están presentes en Power BI Report Server, por ejemplo, la creación de paneles de mando y de alertas. Hay una versión de Power BI Desktop optimizada para Power BI Report Server.

#### Power BI Mobile Apps

Aplicaciones móviles para Android, iOS y Windows 10 para conectarse al Servicio Power BI o a Power BI Report Server y ver los reportes en un móvil o una tableta.

#### Power BI API

El Servicio Power BI ofrece una API con la que se pueden integrar los informes en las aplicaciones hechas a la medida. También se pueden enviar flujos de datos hacía el Servicio Power BI para crear informes que reportan en tiempo real.

### Orígenes de datos

Para la captación de datos, Power BI ofrece conectores para una gran variedad de orígenes de datos. Las conexiones se establecen al diseñar el modelo de datos y los datos son cargados desde estos orígenes hacia el modelo cuando se hace un refrescamiento. En un archivo PIBX pueden coexistir conexiones a varios orígenes de datos. Si el modelo se publica en el Servicio Power BI y hay datos que residen en sistemas de la empresa, hay que configurar On-Premise Gateway.

Existe una biblioteca de código (SDK) para crear conectores a la medida, usando el lenguaje M, por lo que podrás encontrar otros conectores desarrollados por terceros, que no se mencionan aquí, o también podrás crear tus propios conectores.

Describimos a continuación algunos de los conectores, agrupándolos en las mismas categorías usadas por Power BI Desktop.

#### Archivos

Entre los tipos de archivos soportados están Excel, CSV, XML y JSON. También se puede utilizar una carpeta que contenga varios archivos del mismo tipo y con la misma estructura. Los archivos y las carpetas pueden estar almacenados en un sistema de la empresa o en SharePoint. Cuando publiquemos en el Servicio Power BI, en el primer caso habría que configurar On-Premise Gateway, pero no así en el segundo caso.

#### Bases de datos

Es extensa la lista de bases de datos soportada, comenzando con las de Microsoft: SQL Server, Access y Analysis Service, y continuando con MySQL, Postgre SQL, Sybase, así como Oracle, IBM, SAP y otros. La conexión a estas bases de datos desde el Servicio Power BI requiere la configuración de On-Premise Gateway.

#### Power BI

Es posible conectarse a un conjunto de datos de otro PBIX que haya sido publicado en el Servicio Power BI. En este caso no es posible coexistir con otros orígenes de datos.

#### Azure

Siendo un producto de Microsoft, se integra muy bien con los servicios de Azure, pudiendo conectarse, entre otros, a Azure SQL Database, Azure SQL Warehouse, Azure Analysis Service, Azure Blob Storage y Azure Table Storage. Para estos orígenes de datos no es necesario configurar On-Premise Gateway.

#### Servicios en línea

Es posible conectarse a muchos servicios en línea, por ejemplo, Google Analytics, Facebook, Salesforce, y muchos otros más. También a algunos de Microsoft, como SharePoint Online, Exchange Online o Dynamics 365.

#### Otros

En esta categoría hay conectores que son más bien generales, como Web, que permite conectarse a páginas web y extraer datos del HTML. ODBC y OLE DB para conectarse a bases de datos que aún no tengan su propio conector. OData para conectarse a servicios de datos que utilicen este protocolo. También existen conectores para cargar los datos usando los lenguajes R, Python y M.

### Opciones de almacenamiento

Hay varias formas en que un reporte puede acceder a los datos y que a continuación resumimos.

#### Importar

Esta es la opción más común y la que permite usar más funciones de Power BI. Los datos son traídos desde el origen y son almacenados dentro del modelo en una forma comprimida y optimizada para un acceso rápido.

#### DirectQuery

No se almacena ningún dato en el modelo, sino que se hacen consultas directas al origen de datos. Esta opción sólo es soportada por algunas fuentes de datos, sobre todo por bases de datos.

Es posible tener un modelo en que algunas tablas usen la opción DirectQuery y otras la opción de importar.

#### Conectarse en directo a un modelo de datos

En este caso el modelo y los datos residen en un servicio externo, que puede ser Analysis Service o el Servicio Power BI y los reportes usan los datos directamente desde allí.

#### Flujos de datos en tiempo real

El modelo contiene los datos, pero estos son enviados desde el origen de datos usando la API de Power BI, en lugar de que sea Power BI el que traiga los datos, como sucede en las otras opciones.

### Licencias

El Servicio Power BI tiene varias opciones de licencia.

#### Free

Hay una licencia que es gratuita y para uso individual. No es posible compartir los informes con otros usuarios del Servicio Power BI.

La única forma de compartir es con la opción Publicar en la web, que genera un URL con un código y cualquiera que lo tenga puede ver el reporte, sin tener que autenticarse.

#### Pro

Con la licencia Pro se pueden compartir los informes con otros usuarios que también tengan una licencia Pro, pero no con usuarios con licencia Free. Cuesta 9 euros por usuario por mes y se pueden comprar a través de una licencia de Office 365.

Esta licencia también permite utilizar la opción Analizar en Excel, con la que se puede acceder al modelo de datos desde Excel.

#### Premium

La licencia Premium permite tener nodos dedicados con determinada capacidad de procesamiento y de almacenamiento. Existen varios niveles de precios, acorde a las capacidades permitidas.

Para crear los reportes es necesario tener licencias Pro, pero para verlos sólo es necesario la licencia Free y se pueden crear todas las licencias Free que se quieran.

Al comprar una licencia Premium se obtiene una licencia equivalente de Power BI Report Server, que puede ser instalado en los servidores de la empresa.

Esta licencia también da derecho a usar la API de Power BI para embeber los informes en aplicaciones a la medida dentro de la empresa.

#### Embedded

Esta licencia es para desarrollar aplicaciones para terceros que incorporen los informes hechos en Power BI. El desarrollador de la aplicación necesita una licencia Pro para crear los informes y una licencia Embedded para poder acceder a los informes desde la aplicación. Los usuarios de la aplicación no necesitan ninguna licencia de Power Bi.

### Conclusión

En resumen, Power BI es un conjunto de servicios, aplicaciones y conectores que se combinan para integrar datos de diversos orígenes en un único modelo con el fin de analizarlos, visualizarlos de forma interactiva y compartirlos con quien los necesite. Es escalable, por lo que puede usarse tanto de forma personal, en PYMES o en grandes empresas. Tiene una alta disponibilidad, por lo que puede utilizarse desde cualquier lugar en ordenadores, móviles o tabletas (iOS y Android).
