---
layout: post
title: "Introducci�n a Power BI"
date: 2018-10-12
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
---

Power BI es una soluci�n creada por Microsoft para resolver varios problemas del an�lisis de datos, como la adquisici�n, el modelado y la visualizaci�n.

<!--more-->

### Componentes

Est� formado por varios componentes, que a continuaci�n describimos brevemente.

#### Power BI Desktop

Aplicaci�n gratuita de escritorio para Windows con la que se puede conectar a distintas fuentes de datos, limpiarlos y transformarlos, crear un modelo de datos y crear informes. Tiene un Editor de Consultas que utiliza el lenguaje M, para la captura y procesamiento de los datos. En la creaci�n del modelo de datos se utiliza el lenguaje DAX. El resultado se almacena en un archivo PBIX.

#### Servicio Power BI

Servicio en l�nea donde se pueden publicar los archivos PBIX para compartirlos con otros usuarios y programar la actualizaci�n peri�dica de los datos. Tambi�n permite crear cuadros de mando, establecer alertas y exportar los datos a Excel. Se pueden editar los reportes en l�nea, pero no el modelo de datos.

  

#### On-Premise Data Gateway

Aplicaci�n Windows que permite conectar los datos con el servicio de Power BI. Hay dos versiones, una versi�n personal, para conectar los datos en el ordenador de un individuo, y otra versi�n para ser instalada en un servidor y conectar los datos desde los servidores de la empresa. No es necesario usar un Gateway si los datos est�n alojados en un servicio de Azure, como, por ejemplo, Azure SQL Server.

#### Power BI Report Server

Aplicaci�n Windows para ser instalada en los servidores de la empresa que permite publicar los archivos PBIX y tambi�n informes hechos para SQL Server Report Server. Algunas caracter�sticas del servicio Power BI no est�n presentes en Power BI Report Server, por ejemplo, la creaci�n de paneles de mando y de alertas. Hay una versi�n de Power BI Desktop optimizada para Power BI Report Server.

#### Power BI Mobile Apps

Aplicaciones m�viles para Android, iOS y Windows 10 para conectarse al Servicio Power BI o a Power BI Report Server y ver los reportes en un m�vil o una tableta.

#### Power BI API

El Servicio Power BI ofrece una API con la que se pueden integrar los informes en las aplicaciones hechas a la medida. Tambi�n se pueden enviar flujos de datos hac�a el Servicio Power BI para crear informes que reportan en tiempo real.

### Or�genes de datos

Para la captaci�n de datos, Power BI ofrece conectores para una gran variedad de or�genes de datos. Las conexiones se establecen al dise�ar el modelo de datos y los datos son cargados desde estos or�genes hacia el modelo cuando se hace un refrescamiento. En un archivo PIBX pueden coexistir conexiones a varios or�genes de datos. Si el modelo se publica en el Servicio Power BI y hay datos que residen en sistemas de la empresa, hay que configurar On-Premise Gateway.

Existe una biblioteca de c�digo (SDK) para crear conectores a la medida, usando el lenguaje M, por lo que podr�s encontrar otros conectores desarrollados por terceros, que no se mencionan aqu�, o tambi�n podr�s crear tus propios conectores.

Describimos a continuaci�n algunos de los conectores, agrup�ndolos en las mismas categor�as usadas por Power BI Desktop.

#### Archivos

Entre los tipos de archivos soportados est�n Excel, CSV, XML y JSON. Tambi�n se puede utilizar una carpeta que contenga varios archivos del mismo tipo y con la misma estructura. Los archivos y las carpetas pueden estar almacenados en un sistema de la empresa o en SharePoint. Cuando publiquemos en el Servicio Power BI, en el primer caso habr�a que configurar On-Premise Gateway, pero no as� en el segundo caso.

#### Bases de datos

Es extensa la lista de bases de datos soportada, comenzando con las de Microsoft: SQL Server, Access y Analysis Service, y continuando con MySQL, Postgre SQL, Sybase, as� como Oracle, IBM, SAP y otros. La conexi�n a estas bases de datos desde el Servicio Power BI requiere la configuraci�n de On-Premise Gateway.

#### Power BI

Es posible conectarse a un conjunto de datos de otro PBIX que haya sido publicado en el Servicio Power BI. En este caso no es posible coexistir con otros or�genes de datos.

#### Azure

Siendo un producto de Microsoft, se integra muy bien con los servicios de Azure, pudiendo conectarse, entre otros, a Azure SQL Database, Azure SQL Warehouse, Azure Analysis Service, Azure Blob Storage y Azure Table Storage. Para estos or�genes de datos no es necesario configurar On-Premise Gateway.

#### Servicios en l�nea

Es posible conectarse a muchos servicios en l�nea, por ejemplo, Google Analytics, Facebook, Salesforce, y muchos otros m�s. Tambi�n a algunos de Microsoft, como SharePoint Online, Exchange Online o Dynamics 365.

#### Otros

En esta categor�a hay conectores que son m�s bien generales, como Web, que permite conectarse a p�ginas web y extraer datos del HTML. ODBC y OLE DB para conectarse a bases de datos que a�n no tengan su propio conector. OData para conectarse a servicios de datos que utilicen este protocolo. Tambi�n existen conectores para cargar los datos usando los lenguajes R, Python y M.

### Opciones de almacenamiento

Hay varias formas en que un reporte puede acceder a los datos y que a continuaci�n resumimos.

#### Importar

Esta es la opci�n m�s com�n y la que permite usar m�s funciones de Power BI. Los datos son tra�dos desde el origen y son almacenados dentro del modelo en una forma comprimida y optimizada para un acceso r�pido.

#### DirectQuery

No se almacena ning�n dato en el modelo, sino que se hacen consultas directas al origen de datos. Esta opci�n s�lo es soportada por algunas fuentes de datos, sobre todo por bases de datos.

Es posible tener un modelo en que algunas tablas usen la opci�n DirectQuery y otras la opci�n de importar.

#### Conectarse en directo a un modelo de datos

En este caso el modelo y los datos residen en un servicio externo, que puede ser Analysis Service o el Servicio Power BI y los reportes usan los datos directamente desde all�.

#### Flujos de datos en tiempo real

El modelo contiene los datos, pero estos son enviados desde el origen de datos usando la API de Power BI, en lugar de que sea Power BI el que traiga los datos, como sucede en las otras opciones.

### Licencias

El Servicio Power BI tiene varias opciones de licencia.

#### Free

Hay una licencia que es gratuita y para uso individual. No es posible compartir los informes con otros usuarios del Servicio Power BI.

La �nica forma de compartir es con la opci�n Publicar en la web, que genera un URL con un c�digo y cualquiera que lo tenga puede ver el reporte, sin tener que autenticarse.

#### Pro

Con la licencia Pro se pueden compartir los informes con otros usuarios que tambi�n tengan una licencia Pro, pero no con usuarios con licencia Free. Cuesta 9 euros por usuario por mes y se pueden comprar a trav�s de una licencia de Office 365.

Esta licencia tambi�n permite utilizar la opci�n Analizar en Excel, con la que se puede acceder al modelo de datos desde Excel.

#### Premium

La licencia Premium permite tener nodos dedicados con determinada capacidad de procesamiento y de almacenamiento. Existen varios niveles de precios, acorde a las capacidades permitidas.

Para crear los reportes es necesario tener licencias Pro, pero para verlos s�lo es necesario la licencia Free y se pueden crear todas las licencias Free que se quieran.

Al comprar una licencia Premium se obtiene una licencia equivalente de Power BI Report Server, que puede ser instalado en los servidores de la empresa.

Esta licencia tambi�n da derecho a usar la API de Power BI para embeber los informes en aplicaciones a la medida dentro de la empresa.

#### Embedded

Esta licencia es para desarrollar aplicaciones para terceros que incorporen los informes hechos en Power BI. El desarrollador de la aplicaci�n necesita una licencia Pro para crear los informes y una licencia Embedded para poder acceder a los informes desde la aplicaci�n. Los usuarios de la aplicaci�n no necesitan ninguna licencia de Power Bi.

### Conclusi�n

En resumen, Power BI es un conjunto de servicios, aplicaciones y conectores que se combinan para integrar datos de diversos or�genes en un �nico modelo con el fin de analizarlos, visualizarlos de forma interactiva y compartirlos con quien los necesite. Es escalable, por lo que puede usarse tanto de forma personal, en PYMES o en grandes empresas. Tiene una alta disponibilidad, por lo que puede utilizarse desde cualquier lugar en ordenadores, m�viles o tabletas (iOS y Android).
