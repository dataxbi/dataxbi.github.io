---
layout: post
title: "Conectarse a los orígenes de datos desde Power BI Desktop y Excel 2016"
date: 2018-10-23
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

Antes de crear un modelo de datos debemos hacer un análisis de la información que se quiere mostrar para determinar qué datos nos hacen falta, donde se encuentran, en qué tipo de soporte están almacenados y como conectarnos a ellos.

<!--more-->

En esta entrada partiremos de la premisa de que ese análisis ya está hecho y solo nos falta conocer como conectarnos a los datos.

## Â¿Cómo conectarse a los distintos orígenes?

#### Desde Power BI Desktop

Para conectarte a un origen de datos desde Power BI Desktop, debes seleccionar la pestaña de inicio. Dentro del grupo Datos Externos despliega la opción Obtener datos.

[![clip_image003_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image003_thumb_thumb.jpg "clip_image003_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image003_thumb.jpg)

Se muestra un menú que contiene una lista de los orígenes más usados y un botón (Más...) para acceder al resto.

[![clip_image005_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image005_thumb_thumb.jpg "clip_image005_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image005_thumb.jpg)

Si oprimes el botón Más... accederás a una ventana que tiene dos paneles. El de la izquierda muestra las distintas categorías de fuentes de datos y cuando seleccionas una de ellas, en el de la derecha se mostrarán los orígenes disponibles para esa categoría.

[![clip_image007_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image007_thumb_thumb.jpg "clip_image007_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image007_thumb.jpg)

  

#### Desde Excel

En Excel 2016, para acceder a las fuentes de datos clica sobre la pestaña Datos, dentro del grupo Obtener y transformar está el menú Obtener datos.

[![clip_image009_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image009_thumb_thumb.jpg "clip_image009_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image009_thumb.jpg)

Si despliegas el menú se muestran las distintas categorías en que se agrupan los orígenes y al seleccionar una categoría se muestran las fuentes disponibles para esa categoría.

[![clip_image011_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image011_thumb_thumb.jpg "clip_image011_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image011_thumb.jpg)

Las categorías de datos disponibles son:

- Archivo
- Base de datos
- Power BI
- Azure
- Servicios en línea
- Otros

Como puedes observar estás categorías son válidas tanto para Power BI Desktop como MS Excel, excepto el servicio de Power BI que solo existe en Power BI Desktop.

Revisemos como conectarnos a cada una de las categorías.

  

## La categoría Archivo

Comprende los datos que se encuentran almacenados en documentos, como Excel, CSV, Texto, XML, JSON, PDF (\*) y en Carpetas, como carpetas de Windows y carpetas de SharePoint.

Si selecciones un documento se mostrará un cuadro de dialogo para escoger el archivo al que queremos conectarnos, como se muestra en la siguiente imagen:

[![clip_image013_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image013_thumb_thumb.jpg "clip_image013_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image013_thumb.jpg)

Si seleccionamos la opción Carpeta mostrará otro cuadro de dialogo donde debe estar escrita la ubicación de la carpeta local

[![clip_image015_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image015_thumb_thumb.jpg "clip_image015_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image015_thumb.jpg)

En el caso de la opción Carpeta de SharePoint debemos escribir la url de nuestro sitio de SharePoint, sin incluir las subcarpetas.

[![clip_image017_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image017_thumb_thumb.jpg "clip_image017_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image017_thumb.jpg)

Los orígenes marcados con (\*) no están disponibles en Microsoft Excel.

## La categoría base de datos

Proporciona conexión a un amplio conjunto de bases de datos:

- Base de datos de SQL Server
- Base de datos de Access
- Base de datos de SQL Server Analysis Services
- Base de datos de Oracle
- Base de datos IBM DB2
- Base de datos Informix de IBM (beta) (\*)
- IBM Netezza (\*)
- Base de datos de MySQL
- Base de datos de PostgreSQL
- Base de datos de Sybase
- Base de datos de Teradata
- Base de datos SAP HANA
- Servidor de aplicaciones de SAP Business Warehouse (\*)
- Servidor de mensajería de SAP Business Warehouse (beta) (\*)
- Amazon Redshift (\*)
- Impala (\*)
- Google BigQuery (\*)
- Snowflake (\*)
- Exasol (beta) (\*)
- Jethro (beta) (\*)

Las marcadas con (\*) solo están disponibles en Power BI Desktop.

Cuando seleccionas uno de estos orígenes, sino están instalados todos los componentes necesarios para acceder a los mismos mostrará una ventana con un enlace para la descarga de los componentes requeridos.

[![clip_image019_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image019_thumb_thumb.jpg "clip_image019_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image019_thumb.jpg)

Luego de que instales los componentes y selecciones nuevamente el origen se muestra un cuadro de dialogo donde debes especificar: servidor y base de datos. Esta información puede variar dependiendo del tipo de base de datos seleccionada.

[![clip_image021_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image021_thumb_thumb.jpg "clip_image021_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image021_thumb.jpg)

Una vez que introduces esta información y oprimes el botón Aceptar, tratará de conectarse con el origen.

Si se pudo establecer la conexión se abrirá una nueva ventana solicitándote las credenciales para acceder a los datos. Debes seleccionar primero el tipo de conexión y luego escribir el usuario y la contraseña y oprimir seguidamente el botón Conectar.

[![clip_image023_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image023_thumb_thumb.jpg "clip_image023_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image023_thumb.jpg)

Si son correctas las credenciales y tienes premisos en el servidor y la base de datos se abrirá el panel de navegación donde seleccionarás las tablas y vistas que usaras en el modelo.

[![clip_image025_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image025_thumb_thumb.jpg "clip_image025_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image025_thumb.jpg)

En el caso de la base de datos Access en lugar de requerir el nombre del servidor y de la base de datos se mostrará una ventana de exploración para que selecciones la base de datos, igual que con los archivos.

[![clip_image027_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image027_thumb_thumb.jpg "clip_image027_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image027_thumb.jpg)

#### La categoría Power BI

Proporciona las siguientes conexiones de datos:

- Conjunto de datos de Power BI

Este origen de datos no está disponible en Microsoft Excel.

Con esta opción podrás conectarte a los conjuntos de datos que estén publicados en tu área de trabajo o en las áreas de trabajo, tengas acceso., dentro de tu organización.

[![clip_image029_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image029_thumb_thumb.jpg "clip_image029_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image029_thumb.jpg)

## La categoría Azure

Proporciona las siguientes conexiones de datos:

- Azure SQL Database
- Azure SQL Data Warehouse
- Base de datos de Azure Analysis Services (\*)
- Azure Blob Storage
- Azure Table Storage
- Azure Cosmos DB (beta) (\*)
- Azure Data Lake Store
- Azure HDInsight (HDFS)
- Azure HDInsight Spark (Beta) (\*)
- HDInsight Interactive Query (Beta) (\*)
- KustoDB de Azure (beta) (\*)

Los orígenes marcados con (\*) no están disponibles en Microsoft Excel.

Para acceder a estos orígenes debes tener creada una cuenta en el portal de Azure y debes tener configurado algunos de estos servicios.

En la siguiente imagen nos conectaremos a una base de datos de Azure. Observe que al nombre del servidor se añade el sufijo \".database.windows.net\".

[![clip_image031_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image031_thumb_thumb.jpg "clip_image031_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image031_thumb.jpg)

Al igual que en cualquier otro tipo de base de datos hay que especificar las credenciales.

[![clip_image033_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image033_thumb_thumb.jpg "clip_image033_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image033_thumb.jpg)

## La categoría Servicios en línea

Proporciona las siguientes conexiones de datos:

- Lista de SharePoint Online
- Microsoft Exchange Online
- Dynamics 365 (en línea)
- Dynamics NAV (Beta) (\*)
- Dynamics 365 Business Central (\*)
- Common Data Service para aplicaciones (Beta) (\*)
- Common Data Service (Beta) (\*)
- Microsoft Azure Consumption Insights (Beta) (\*)
- Visual Studio Team Services (Beta) (\*)
- Objetos de Salesforce
- Informes de Salesforce
- Google Analytics (\*)
- Adobe Analytics (\*)
- appFigures (Beta) (\*)
- comScore Digital Analytix (beta) (\*)
- Dynamics 365 para Customer Insights (Beta) (\*)
- Data.World - Obtener un conjunto de datos (Beta) (\*)
- Facebook
- GitHub (Beta) (\*)
- MailChimp (Beta) (\*)
- Marketo (Beta) (\*)
- Mixpanel (Beta) (\*)
- Planview Enterprise One - PRM (Beta) (\*)
- PlanView Projectplace (Beta) (\*)
- QuickBooks Online (Beta) (\*)
- Smartsheet (\*)
- SparkPost (Beta) (\*)
- Stripe (Beta) (\*)
- SweetIQ (Beta) (\*)
- PlanView Enterprise One - CMT (Beta) (\*)
- Twilio (Beta) (\*)
- tyGraph (Beta) (\*)
- Webtrends (Beta) (\*)
- Zendesk (Beta) (\*)
- TeamDesk (Beta) (\*)

Los orígenes marcados con (\*) no están disponibles en Microsoft Excel.

Si seleccionamos un origen de esta categoría se muestra un cuadro de diálogo que nos indica que el conector es un servicio de terceros y nos advierte acerca de cómo las características y la disponibilidad pueden cambiar con el tiempo. En el ejemplo se usó el servicio de Google Analytics.

[![clip_image035_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image035_thumb_thumb.jpg "clip_image035_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image035_thumb.jpg)

Cuando oprimimos el botón Continuar se muestra otro cuadro de dialogo solicitándonos que iniciemos sesión en el servicio. Si las credenciales son correctas nos indicará que hemos iniciado sesión y podemos conectarnos a los datos.

[![clip_image037_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image037_thumb_thumb.jpg "clip_image037_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image037_thumb.jpg)

## La categoría Otros

Proporciona las siguientes conexiones de datos:

- Vertica (Beta) (\*)
- Web
- Lista de SharePoint
- Fuente de OData
- Active Directory
- Microsoft Exchange
- Archivo Hadoop (HDFS)
- Spark (\*)
- Script R (\*)
- Script de Python (\*)
- ODBC
- OLE DB
- Consulta en blanco

Los orígenes marcados con (\*) no están disponibles en Microsoft Excel.

Microsoft Excel cuenta con dos orígenes que no tiene Power BI Desktop:

Â· Desde una tabla o rango

Â· Desde Microsoft Query

Veamos algunos de estos orígenes:

#### El conector web

Nos permite conectarnos, extraer e importar los contenidos de las páginas web.

Si los datos se encuentran almacenados dentro de tablas la tarea será fácil. Si los datos no estuvieran almacenados en tablas podemos usar la característica Obtener datos de páginas web con ejemplos.

Cuando seleccionamos este origen debemos escribir la URL de la página donde se encuentran los datos que necesitamos

[![clip_image039_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image039_thumb_thumb.jpg "clip_image039_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image039_thumb.jpg)

Especificar la forma y credenciales que usaremos para conectarnos.

[![clip_image041_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image041_thumb_thumb.jpg "clip_image041_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image041_thumb.jpg)

Si los datos estuvieran almacenados en tablas escoger las tablas con los datos

[![clip_image043_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image043_thumb_thumb.jpg "clip_image043_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image043_thumb.jpg)

Si los datos no se almacenan en tablas como en la imagen siguiente

[![clip_image045_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image045_thumb_thumb.jpg "clip_image045_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image045_thumb.jpg)

Al conectarnos a este origen la ventana del navegador no nos muestra una tabla con los datos que necesitamos. En este caso la única tabla que muestra contiene la información que no necesitamos por lo que seleccionamos Agregar tabla mediante ejemplos.

[![clip_image047_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image047_thumb_thumb.jpg "clip_image047_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image047_thumb.jpg)

Se abre una ventana con la página web y una tabla debajo para escribir los datos que nos interesan. Bastará con escribir 1 o 2 filas.

[![clip_image049_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image049_thumb_thumb.jpg "clip_image049_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image049_thumb.jpg)

Especificamos algunos de los datos que nos interesan de la página para que el Power Query pueda extraerlos y oprimimos el botón Aceptar.

[![clip_image051_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image051_thumb_thumb.jpg "clip_image051_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image051_thumb.jpg)

#### El conector **OData**

Permite importar datos desde servicios de datos que utilicen este protocolo.

Cuando seleccionamos este origen se muestra el cuadro de dialogo siguiente, donde debemos escribir la URL de **OData**.

En el ejemplo usamos la URL de un servicio OData que expone la base de datos de ejemplo Northwind de Microsoft.

Si escribimos la dirección del servicio en el navegador, [http://services.odata.org/V3/Northwind/Northwind.svc](http://services.odata.org/V3/Northwind/Northwind.svc) podemos ver los distintos objetos de la base de datos que están expuestos en el servicio:

[![clip_image053_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image053_thumb_thumb.jpg "clip_image053_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image053_thumb.jpg)

De ellos escogeremos la tabla de clientes, Customers:

http://services.odata.org/V3/Northwind/Northwind.svc/Customers

[![clip_image055_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image055_thumb_thumb.jpg "clip_image055_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image055_thumb.jpg)

El navegador mostrará el contenido de la tabla:

[![clip_image057_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image057_thumb_thumb.jpg "clip_image057_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image057_thumb.jpg)

#### El conector **ODBC**

Permite importar datos desde cualquier controlador ODBC de terceros especificando un **Nombre de origen de datos (DSN)** o una _cadena de conexión_ o especificando una instrucción SQL para que se ejecute en el controlador ODBC.

La siguiente tabla tomada del artículo de Microsoft [Conectarse a los datos mediante las interfaces genéricas de Power BI Desktop](https://docs.microsoft.com/es-es/power-bi/desktop-connect-using-generic-interfaces), muestra orígenes de datos a los que **Power BI Desktop** se puede conectar mediante **ODBC.**

| Origen de datos externo | Vínculo para más información |
| --- | --- |
| Cassandra | [Controlador ODBC de Cassandra](http://www.simba.com/drivers/cassandra-odbc-jdbc/) |
| Couchbase DB | [Couchbase y Power BI](https://powerbi.microsoft.com/en-us/blog/visualizing-data-from-couchbase-server-v4-using-power-bi/) |
| DynamoDB | [Controlador ODBC de DynamoDB](http://www.simba.com/drivers/dynamodb-odbc-jdbc/) |
| Google BigQuery | [Controlador ODBC de BigQuery](http://www.simba.com/drivers/bigquery-odbc-jdbc/) |
| Hbase | [Controlador ODBC de Hbase](http://www.simba.com/drivers/hbase-odbc-jdbc/) |
| Hive | [Controlador ODBC de Hive](http://www.simba.com/drivers/hive-odbc-jdbc/) |
| IBM Netezza | [Información de IBM Netezza](https://www.ibm.com/support/knowledgecenter/SSULQD_7.2.1/com.ibm.nz.datacon.doc/c_datacon_plg_overview.html) |
| Presto | [Controlador ODBC de Presto](http://www.simba.com/drivers/presto-odbc-jdbc/) |
| Project Online | [Artículo sobre Project Online](https://docs.microsoft.com/es-es/power-bi/desktop-project-online-connect-to-data) |
| Progress OpenEdge | [Entrada de blog sobre el controlador ODBC Progress OpenEdge](https://www.progress.com/blogs/connect-microsoft-power-bi-to-openedge-via-odbc-driver) |

Para conectar con una base de datos usando ODBC debe configurar primero, si no está configurado, el origen en el Administrador de origen de datos, en las herramientas administrativas de Windows.

[![clip_image059_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image059_thumb_thumb.jpg "clip_image059_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image059_thumb.jpg)

En Power BI Desktop escogeremos Obtener datos desde ODBC y nos muestra la siguiente ventana:

[![clip_image061_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image061_thumb_thumb.jpg "clip_image061_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image061_thumb.jpg)

Seleccionamos el nombre asignado al origen y en el navegador se mostrarán todas las tablas que se encuentren en el directorio especificado.

[![clip_image063_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image063_thumb_thumb.jpg "clip_image063_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image063_thumb.jpg)

#### El conector **OLE DB**

Nos permite importar datos desde cualquier controlador OLE DB de terceros especificando una _cadena de conexión o_ una instrucción SQL para que se ejecute en el controlador OLE DB.

La siguiente tabla tomada del artículo de Microsoft [Conectarse a los datos mediante las interfaces genéricas de Power BI Desktop](https://docs.microsoft.com/es-es/power-bi/desktop-connect-using-generic-interfaces), muestra orígenes de datos a los que **Power BI Desktop** se puede conectar mediante **OLE DB**.

| Origen de datos externo | Vínculo para más información |
| --- | --- |
|   SAS OLE DB   | [Proveedor SAS para OLE DB](https://support.sas.com/downloads/package.htm?pid=648) |
| Sybase OLE DB | [Proveedor Sybase para OLE DB](http://infocenter.sybase.com/help/index.jsp?topic=/com.sybase.infocenter.dc35888.1550/doc/html/jon1256941734395.html) |

#### La consulta en blanco

Cuando creamos una conexión a una consulta en blanco, se abre inmediatamente el Editor de consultas, donde debemos escribir los pasos de esta nueva consulta usando el lenguaje de consultas M.

[![clip_image065_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image065_thumb_thumb.jpg "clip_image065_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image065_thumb.jpg)

Podemos hacerlo escribiendo una expresión en la barra de fórmulas.

[![clip_image067_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image067_thumb_thumb.jpg "clip_image067_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image067_thumb.jpg)

O desde el Editor avanzado.

[![clip_image069_thumb](/assets/images/posts/2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016/clip_image069_thumb_thumb.jpg "clip_image069_thumb")](https://www.dataxbi.com/wp-content/uploads/2018/10/clip_image069_thumb.jpg)

## SDK de Power Query

Si no quieres usar los conectores genéricos de ODBC y OLE DB tienes la opción de construir tu propio conector.

Microsoft pone a disposición de los programadores un SDK de Power Query con el cual podrás desarrollar conectores personalizados. Aquí tienes el enlace donde puedes encontrar toda la información disponible.

[https://github.com/Microsoft/DataConnectors](https://github.com/Microsoft/DataConnectors)

## Conclusión

En esta entrada hemos querido resumir los diferentes orígenes de datos a los que podemos conectarnos desde Power BI Desktop y Excel 2016, así como las particularidades de los más usados.

Hemos visto que para los orígenes de datos que no aparecen en el listado puedes usar los conectores genéricos de ODBC y OLE DB o construir tu propio conector usando el SDK de Power Query.

Te sugerimos que cada mes, después que actualices Power BI Desktop, revises esta lista de orígenes porque algunos que hoy aparecen como versión beta, y no deben usarse en producción, pueden cambiar a versión definitiva o que aparezcan nuevos orígenes como ocurre frecuentemente. Para activar algunos de los nuevos orígenes debes revisar las opciones de configuración de Power BI Desktop, fundamentalmente DirectQuery y Características de versión preliminar.
