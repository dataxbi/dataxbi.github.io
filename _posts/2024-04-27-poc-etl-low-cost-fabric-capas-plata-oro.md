---
layout: post
title: "PoC ETL low cost con Fabric - Capas plata y oro"
date: 2024-04-27
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

En esta nueva entrada estaremos hablando de como organizamos la segunda y tercera capas de la arquitectura **Medallion** de nuestra prueba de concepto. A estas capas se les conoce como **Plata** y **Oro**.

<!--more-->

## La capa Plata

En esta capa se llevar�n a cabo la mayor�a de las transformaciones que requieren los datos. Para realizar las transformaciones utilizaremos flujos de datos.

Los datos de origen de esta capa se encuentran en el Lakehouse **datos\_origen**, de la capa Bronce, y est�n almacenados en tablas.

El destino de los datos ser� otro Lakehouse al que llamaremos **datos\_transformados** y tambi�n se almacenar�n en tablas.

Crearemos un flujo de datos para transformar todas las tablas de dimensiones y luego crearemos otro por cada tabla de hechos: presupuestos, tickets y ventas. En total ser�n 4 flujos de datos.

![dataXbi - ETL con Flujos de datos Transformaciones](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD.png)  
  

### Flujo de datos Gen2 transformar\_dimensiones

Al crear el flujo de datos escogeremos como origen de datos el Lakehouse dentro de las opciones de Microsoft Fabric.

![dataXbi-ETL con Flujos de datos Transformaciones Lakehouse](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Nuevo-FD-Lakehouse.png)  
  

A continuaci�n especificamos la conexi�n.

![dataXbi-ETL-Trafsormaciones con Flujos de datos nueva conexion](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Nueva-Conexion-FD-Lakehouse.png)  
  

Elegimos en el navegador el �rea de trabajo donde se encuentra el Lakehouse, desplegamos los objetos y seleccionamos datos\_origen, el Lakehouse que creamos en la capa Bronce y donde est�n almacenados los datos.

![dataXbi-ETL con Flujo de datos Trafsormaciones-Area de Trabajo](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Nuevo-FD-Area-Trabajo.png)  
  

En el flujo de datos se crea una consulta con el mismo nombre del Lakehouse que contiene las tablas.

![dataXbi-ETL con Flujos de datos Transformaciones Tablas](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Nuevo-FD-Lakehouse-Tablas.png)  
  

A esta consulta le deshabilitaremos el almacenamiento provisional y crearemos referencias para cada uno de los or�genes de datos que nos interesan: clientes, productos, tiendas, municipios y vendedores.

![dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-deshabilitar-almacenamiento](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-deshabilitar-almacenamiento.png)  
  

Todas las consultas requerir�n transformaciones como asignar el tipo de datos correspondiente a cada columna, recordemos que los datos se almacenaron como texto, y a todas las consultas excepto a municipios se le a�adir� una columna �ndice como llave sustituta.

En el caso de la tabla clientes, transformaremos la columna fecha de nacimiento para calcular la edad del cliente y a�adiremos una columna �ndice que ser� la clave subrogada de esta consulta.

![dataXbi-ETL con Flujos de datos Transformaciones Tabla-clientes](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-clientes.png)  
  

Cuando el origen de datos no contiene grandes vol�menes de datos y si no va a unir datos de diferentes fuentes de datos o si no est� realizando transformaciones de proceso o memoria intensivas, como unir o agregar grandes vol�menes de datos podemos deshabilitar el almacenamiento provisional y cargar directamente en el destino de salida.

Si nos fijamos en la consulta tiendas podemos ver un rayo de color naranja, esto indica que en esta consulta se usar� el motor de proceso mejorado durante la actualizaci�n. Esta consulta consulta combina datos de tiendas y municipios.

![dataXbi-ETL con Flujos de datos Trafsormaciones combinar tablas tiendas y municipios](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-tiendas-combinacion.png)  
  

El resto de consultas no requiere de transformaciones especificas por eso no las analizaremos en detalle.

Por �ltimo debemos asignar un destino a cada una de las consulta excepto a municipios y datos\_origen. El destino de todas las consultas ser� un nuevo Lakehouse, **datos\_transformados**.

![dataXbi-ETL con Flujos de datos Transformaciones clientes tabla destino](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-clientes-destino.png)  
  

Para definir el nuevo destino escogemos Lakehouse y a continuaci�n como hicimos al inicio seleccionamos primero el �rea de trabajo y luego el Lakehouse.

![dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-clientes-destino-configuracion](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-clientes-destino-configuracion.png)

Especificamos si la tabla es nueva o ya existe y el nuevo nombre de la tabla. Escogemos el m�todo de actualizaci�n, las opciones del esquema y el mapeo de los campos entre origen y destino. Recuerda que los nombres de las columnas no deben contener espacios en blanco.

### Flujo de datos Gen2 transformar\_ventas

El flujo de datos transformar\_ventas es muy similar al transformar\_dimensiones. Al igual que en el flujo transformar\_dimensiones creamos una consulta que conecte con el Lakehouse datos\_origen y la referenciamos: ventas\_eur, ventas\_usd y conversion\_eur. A las consultas ventas\_eur y ventas\_usd le a�adiremos una columna con el nombre de la tabla de origen para poder diferenciarlas luego. La consulta ventas\_usd debe combinarse con la consulta conversion\_eur para transformar los importes de dolar a euro. Finalmente las consultas ventas\_eur y ventas\_usd se anexan para formar la consulta ventas. La consulta ventas es la �nica que tendr� un destino.

![dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-ventas-anexar](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-ventas-anexar.png)  
  

De la misma forma que creamos el flujo de datos transformar\_ventas creamos transformar\_presupuestos y transformar\_tickets.

### Orquestar el proceso de transformar los datos

Para orquestar todas las transformaciones de esta capa crearemos una canalizaci�n igual que hicimos en la capa de bronce. A esta canalizaci�n la llamaremos **transformar\_datos** y lo que har� ser� llamar cada uno de los flujos de datos para que se ejecuten en orden secuencial.

![dataXbi-ETL-Transformaciones-Canalizaci�n](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Canalizaci�n.png)  
  

Ejecutamos la canalizaci�n y podemos ver los tiempos que demora cada flujo de datos en ejecutarse as� como el tiempo total que demora la canalizaci�n.

Una vez ejecutada la canalizaci�n podemos ver el Lakehouse datos\_transformados con todos los datos cargados.

## La capa Oro

En esta capa se llevar�n a cabo las �ltimas transformaciones y se dejar� a punto el modelo tabular que cargaremos en el modelo sem�ntico.

Para la capa de oro los datos se almacenar�n en un Almac�n, en lugar de un Lakehouse, al que llamaremos **modelo\_datos**.

Para realizar la carga de los datos en el almac�n y realizar las �ltimas transformaciones crearemos un �nico flujo de datos al que llamamos **modelar**. Tendr� como origen de datos el Lakehouse **datos\_transformados** y al igual que hicimos en la capa Plata crearemos una consulta maestra que conecte con el Lakehouse y que contendr� todas las tablas.

![dataXbi-ETL- Flujo de datos Modelar](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Modelar.png)

Como parte de las transformaciones que se llevar�n a cabo en esta capa est� el combinar las tablas de hechos con las tablas de dimensiones para reemplazar el campo clave de negocio por el campo clave sustituta que creamos en la capa de Plata. Tambi�n asignaremos el tipo de datos correspondiente a cada columna de cada tabla. Crearemos la tabla Calendario con los campos requeridos. Se elegir�n las columnas que se utilizar�n en cada tabla del modelo sem�ntico.

![dataXbi-ETL-Trafsormaciones-FD-Modelar-Tabla-ventas](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Modelar-Tabla-ventas.png)

Todas las consultas tendr�n como destino el Almac�n **modelo\_datos**. La configuraci�n del destino es muy similar a la del Lakehouse solo que el esquema no puede ser din�mico.

![dataXbi-ETL-Almacen](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Almacen.png)

En esta capa no necesitaremos de una canalizaci�n porque solamente debemos ejecutar un flujo de datos.

## Orquestar el proceso completo de ETL

Para ejecutar todo el proceso de ETL hemos creado una nueva canalizaci�n **etl\_completa**. Esta canalizaci�n ser� la que se encargue de ejecutar las canalizaciones de las capas bronce y plata y el flujo de datos Gen 2 de la capa de oro y actualizar el modelo sem�ntico del �rea de trabajo PRO.

![dataXbi-ETL Completa - Canalizaci�n](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Completa-Canalizaci�n.png)  
  

Para la actualizaci�n del modelo sem�ntico del �rea de trabajo PRO estamos utilizando la [API REST de Power BI](https://learn.microsoft.com/es-es/rest/api/power-bi/datasets/refresh-dataset) y la implementamos como una actividad Web de la canalizaci�n.

En la configuraci�n de la actividad Web se debe crear una conexi�n y seleccionarla, especificar la direcci�n relativa del dataset que se quiere actualizar y elegir el m�todo Post entre otras propiedades.

![ETL completa con canalizaci�n y actividad-Web](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Completa-Canalizaci�n-Actividad-Web-1.png)  
  

**Nota**: En el momento de escribir esta entrada ya est� disponible una actividad de canalizaci�n para actualizar el modelo sem�ntico.

![dataXbi-Canalizacion-Actividad Actualizaci�n del Modelo Sem�ntico](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-Canalizacion-Actividad-Actualizar-Modelo-Semantico.png)  
  

Finalmente estamos listos para ejecutar la canalizaci�n y llevar a cabo todo el proceso de ETL.

Una vez que los datos se han cargado en el modelo sem�ntico podemos apagar la capacidad Fabric y trabajar con el modelo sem�ntico y el informe.

![dataXbi-Modelo Sem�ntico](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-Modelo-Semantico.png)  
  

En la pr�xima y �ltima entrada de la serie mostraremos los costes de todo el proceso de ETL.

##### Todas las entradas de esta serie **ETL "low cost" con Fabric**

1. [Arquitectura](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/)
2. [Capacidad](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/)
3. [Capa bronce](https://www.dataxbi.com/blog/2024/03/07/poc-etl-low-cost-con-fabric-capa-bronce/)
4. [Carga incremental](https://www.dataxbi.com/blog/2024/03/26/poc-etl-low-cost-fabric-carga-incremental/)
5. [Capas plata y oro](https://www.dataxbi.com/blog/2024/04/27/poc-etl-low-cost-fabric-capas-plata-oro/)
6. [Costes](https://www.dataxbi.com/blog/2024/05/08/poc-etl-low-cost-fabric-costes/)
