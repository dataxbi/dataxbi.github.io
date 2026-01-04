---
layout: post
title: "Parámetros de consulta dinámica M"
date: 2020-11-03
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
---

En la actualización de Power BI Desktop de octubre 2020, en el apartado Preparación de datos se incluye la opción Parámetros de consulta dinámica M que permite a los usuarios actualizar dinámicamente los parámetros desde la vista de informe. Para actualizar los valores de los parámetros se utilizan filtros y segmentaciones, de esta forma se mejora el rendimiento de las consultas, especialmente cuando el informe se construye sobre un conjunto de datos muy grande o usando una lógica de consulta compleja.

<!--more-->

En esta entrada veremos el uso de parámetros de consulta dinámica M usando el conector Azure Data Explorer (Kusto) y como fuente de datos Application Insights de Azure Monitor.

![Parámetros de consulta dinámica M](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-parametros-dinamicos-m.png)

Azure Data Explorer (ADX) es un servicio de exploración de datos altamente escalable y rápido para datos de telemetría y registro. Le ayuda a administrar los numerosos flujos de datos emitidos por las aplicaciones de software actuales para poder recopilar, almacenar y analizar los datos.

Permite analizar grandes volúmenes de datos diversos desde cualquier origen de datos, como sitios web, aplicaciones, dispositivos de IoT, etc. Estos datos se usan para el diagnóstico, la supervisión, la creación de informes, el aprendizaje automático y las funcionalidades de análisis adicionales. Azure Data Explorer simplifica el proceso de ingesta de estos datos y permite realizar consultas ad hoc complejas en los datos en cuestión de segundos.

Por otra parte, Azure Data Explorer (ADX), se integra con Azure Monitor (AM) a través de una nueva característica, el proxy ADX facilitando la carga de datos desde Azure Monitor. El proxy ADX, le permite mapear las aplicaciones de Application Insights (AI) y las áreas de trabajo de Log Analytics (LA) de Azure Monitor como un clúster virtual, consultarlo mediante herramientas ADX y conectarse a él como un segundo clúster.

En Power BI Desktop tenemos un conector nativo para ADX, Azure Data Explorer (Kusto), que nos permite conectarnos a datos en modo DirectQuery y es el que utilizaremos para conectar nuestros datos en el ejemplo.

### Parámetros de consulta dinámica M

El uso de parámetros de consulta dinámica M, es una característica que está en vista previa y hay que habilitarla en Opciones y configuración | Opciones de Power BI Desktop.

![dataXbi-habilitar-parametros-dinamicos](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-habilitar-parametros-dinamicos.png)  
  

Los parámetros de consulta dinámica M requieren que la conexión a los datos sea en modo DirectQuery.

### Pasos para el uso de los parámetros de consulta dinámica:

1. Crear los parámetros de consulta necesarios
2. Referenciar los parámetros en una o varias consultas creadas con almacenamiento en modo DirectQuery.
3. Por cada parámetro crear una tabla con una columna que contenga los posibles valores del parámetro.
4. Enlazar cada parámetro con la tabla correspondiente.
5. En la vista de informe, añadir segmentaciones usando como campos las columnas vinculadas a cada parámetro.

### Un ejemplo del uso de parámetros dinámicos:

La fuente de datos de nuestro ejemplo es una consulta de Application Insights, un servicio de Microsoft que permite monitorear nuestras aplicaciones.

En este caso el servicio se ha usado para labores de marketing, para analizar los patrones de uso y entender las necesidades de los usuarios y mejorar continuamente nuestra aplicación. Los datos que se están monitoreando son el número de vistas de páginas, los usurarios nuevos y recurrentes, su ubicación geográfica, principales acciones, así como otras estadísticas de uso.

Desde Application Insights (AI) se pueden exportar las consultas a los datos en formato CSV y en lenguaje Power Query M, para conectarnos desde Power BI Desktop utilizando el conector Web. Si utilizamos esta consulta estaremos utilizando el modo de conexión a datos Importar y no el modo DirectQuery, que es el requerido para los parámetros dinámicos.

![dataXbi - exportar-consulta-M-Application-Insights](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-exportar-consulta-M-Application-Insights.png)  
  

Desde AI exportaremos la consulta en lenguaje Power Query M en un archivo de texto (.TXT). Este archivo contiene la consulta en lenguaje M y los pasos a seguir para crearla en Power Query. En este caso no seguiremos los pasos pero nos quedaremos con parte de la consulta, la que está enmarcada en color rojo en la siguiente imagen.

![dataXbi -archivo-txt-consulta-M-Application-Insights](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-archivo-txt-consulta-M-Application-Insights-1.png)  
  

La copiamos a un editor de texto. La consulta está escrita en lenguaje Kusto y combina dos tablas, la de eventos y la de páginas visitadas filtradas en un período de tiempo.

![dataXbi - consulta-M-Application-Insights](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-consulta-M-Application-Insights-1.png)  
  

Ya estamos listos para realizar los pasos para crear los parámetros dinámicos.

### Paso 1:

Creamos dos parámetros: FechaInicio y FechaFin de tipo Fecha/Hora y le asignaremos valores por defecto.

![dataXbi - parametro-FechaInicio](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-parametro-FechaInicio-1.png)  
  

Si nos fijamos en la consulta que tenemos en el editor de texto veremos que después del origen de los datos hay una expresión â€œwhereâ€ donde se especifica la fecha y hora de inicio y final del período a analizar.

![dataXbi - consulta-M-Application-Insights](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-consulta-M-Application-Insights-2.png)  
  

Estos valores son fijos y los reemplazaremos por los parámetros creados anteriormente para poder modificar dinámicamente el período de carga de los datos, como se muestra en la siguiente imagen.

![dataXbi - consulta-M-Application-Insights-con-parametros](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-consulta-M-Application-Insights-con-parametros.png)

### Paso 2:

Crearemos una conexión a un origen de datos Azure Data Explorer (Kusto). Para ello seleccionamos Obtener datos y buscamos el conector.

![dataXbi-conectar-azure-data-explorer](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dtaXbi-conectar-azure-data-explorer-2.png)  
  

En la opción Clúster escribiremos la URL: [https://help.kusto.windows.net](https://help.kusto.windows.net), que es el clúster de ayuda de Azure Data Explorer.

En la opción Base de datos escribiremos: Samples, que es la base de datos del clúster de ayuda.

En Nombre de la tabla o consulta de Azure Data Explorer primero especificaremos nuestro clúster, luego nuestra base de datos y por último la consulta a ejecutar. Los tres elementos se separan por un punto.

Para especificar nuestro clúster utilizaremos la función cluster y le pasaremos como parámetro la URL de nuestro clúster dinámico:

En el caso de Application Insights será:

`https://ade.applicationinsights.io/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/microsoft.insights/components/ai-app-name`

Debemos sustituir los valores: subscription-id, resource-group-name y ai-app-name por los valores de nuestro recurso Application Insights.

Quedará como sigue:

`cluster('https://ade.applicationinsights.io/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/microsoft.insights/components/ai-app-name)`

A continuación escribimos un punto "." e indicamos nuestra base de datos que deberá coincidir con el nombre del componente ai-app-name. Para especificar la base de datos utilizamos la función database y le pasamos el nombre de nuestro componente.

cluster('https://ade.applicationinsights.io/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/microsoft.insights/components/ai-app-name)`.database(ai-app-name)`  
  

Seguidamente escribimos un punto "." y añadimos la consulta que tennemos en el editor de texto donde previamente hemos reemplazado los valores de fecha por los parámetros.

cluster('https://ade.applicationinsights.io/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/microsoft.insights/components/ai-app-name).database(ai-app-name)`.union pageViews,customEvents | where timestamp between(datetime(""" & DateTime.ToText(FechaInicio,"yyyy-MM-dd hh:mm") &""")..datetime(""" & DateTime.ToText(FechaFin,"yyyy-MM-dd hh:mm")`  
  

Por último, seleccionamos DirectQuery como modo de conectividad de datos y nos queda la consulta:

![dtaXbi-conectar-azure-data-explorer-con-parametros](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dtaXbi-conectar-azure-data-explorer-con-parametros2.png)  
  

### Paso 3:

En este paso se crean las tablas que utilizaremos para filtrar los parámetros. Una por cada parámetro.

En nuestro ejemplo serán dos tablas, una para el parámetro FechaInicio y otra para el parámetro FechaFin, con los valores de fecha y hora que podrá tomar cada uno.

![dataXbi-tabla-SesionInicio-M](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-tabla-SesionInicio-M.png)  
  

Cargamos las tres tablas en el modelo. Las tablas no deben estar relacionadas.

### Paso 4:

En este paso se vinculan los parámetros a las tablas de valores.

En la vista de relaciones del modelo, para cada una de las tablas de fecha que hemos creado, seleccionamos la columna de fecha y en el panel de propiedades de la columna la enlazamos con el parámetro que corresponda.

![dataXbi-enlazar-columna-con-parametro](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dtaXbi-enlazar-columna-con-parametro.png)  
  

### Paso 5:

En la vista de informe añadimos una visualización con los datos a mostrar y dos segmentaciones de datos con los campos de fecha de cada una de las tablas. Ya podemos comenzar a segmentar los valores de fecha y revisar el efecto que provocan en la visualización.

![dataXbi-parametros-dinamicos-visualizacion](/assets/images/posts/2020-11-03-parametros-consulta-dinamica-m/dataXbi-parametros-dinamicos-visualizacion.png)  
  
  
  

### Limitaciones del uso de parámetros dinámicos:

#### Fuentes DirectQuery no soportadas:

- Fuentes de datos basadas en T-SQL: SQL Server, Azure SQL Database, Synapse SQL pools (aka Azure SQL Data Warehouse), and Synapse SQL OnDemand pools
- Fuentes de datos Live connect: Azure Analysis Services, SQL Server Analysis Services, Power BI Datasets
- Otras: Oracle, Teradata and Relational SAP Hana

#### Fuentes Direct Query parcialmente soportadas (a través de endpoint XMLA / TOM):

- SAP BW
- SAP Hana

#### Tipos de parámetros no soportados:

- Any
- Duration
- True/False
- Binary

#### Filtros no soportados:

- Relative time slicer or filter
- Relative date
- Hierarchy slicer
- Multi-field include filter
- Exclude filter / Not filters
- Cross-highlighting
- Drill down filter
- Cross drill filter
- Top N filter

#### Operaciones no soportadas:

- And
- Contains
- Less than
- Greater than
- Starts with
- Does not start with
- Is not
- Does not contains
- Select all
- Is blank
- Is not blank

## Referencias:

[Dynamic M query parameters in Power BI Desktop (preview)](https://docs.microsoft.com/en-us/power-bi/connect-data/desktop-dynamic-m-query-parameters)  
  
[Query data in Azure Monitor using Azure Data Explorer (Preview)](https://docs.microsoft.com/en-us/azure/data-explorer/query-monitor-data)  
  
[Power BI data sources](https://docs.microsoft.com/en-us/power-bi/connect-data/power-bi-data-sources)  
  
[Procedimientos recomendados para usar Power BI para consultar y visualizar datos de Azure Data Explorer](https://docs.microsoft.com/es-es/azure/data-explorer/power-bi-best-practices#tips-for-using-the-azure-data-explorer-connector-for-power-bi-to-query-data)  
  
[Chris Webb's BI Blog](https://blog.crossjoin.co.uk/2020/10/25/why-im-excited-about-dynamic-m-parameters-in-power-bi/)
