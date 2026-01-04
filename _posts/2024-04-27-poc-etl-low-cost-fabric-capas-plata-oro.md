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

En esta capa se llevarán a cabo la mayoría de las transformaciones que requieren los datos. Para realizar las transformaciones utilizaremos flujos de datos.

Los datos de origen de esta capa se encuentran en el Lakehouse **datos\_origen**, de la capa Bronce, y están almacenados en tablas.

El destino de los datos será otro Lakehouse al que llamaremos **datos\_transformados** y también se almacenarán en tablas.

Crearemos un flujo de datos para transformar todas las tablas de dimensiones y luego crearemos otro por cada tabla de hechos: presupuestos, tickets y ventas. En total serán 4 flujos de datos.

![dataXbi - ETL con Flujos de datos Transformaciones](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD.png)  
  

### Flujo de datos Gen2 transformar\_dimensiones

Al crear el flujo de datos escogeremos como origen de datos el Lakehouse dentro de las opciones de Microsoft Fabric.

![dataXbi-ETL con Flujos de datos Transformaciones Lakehouse](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Nuevo-FD-Lakehouse.png)  
  

A continuación especificamos la conexión.

![dataXbi-ETL-Trafsormaciones con Flujos de datos nueva conexion](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Nueva-Conexion-FD-Lakehouse.png)  
  

Elegimos en el navegador el área de trabajo donde se encuentra el Lakehouse, desplegamos los objetos y seleccionamos datos\_origen, el Lakehouse que creamos en la capa Bronce y donde están almacenados los datos.

![dataXbi-ETL con Flujo de datos Trafsormaciones-Area de Trabajo](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Nuevo-FD-Area-Trabajo.png)  
  

En el flujo de datos se crea una consulta con el mismo nombre del Lakehouse que contiene las tablas.

![dataXbi-ETL con Flujos de datos Transformaciones Tablas](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Nuevo-FD-Lakehouse-Tablas.png)  
  

A esta consulta le deshabilitaremos el almacenamiento provisional y crearemos referencias para cada uno de los orígenes de datos que nos interesan: clientes, productos, tiendas, municipios y vendedores.

![dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-deshabilitar-almacenamiento](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-deshabilitar-almacenamiento.png)  
  

Todas las consultas requerirán transformaciones como asignar el tipo de datos correspondiente a cada columna, recordemos que los datos se almacenaron como texto, y a todas las consultas excepto a municipios se le añadirá una columna índice como llave sustituta.

En el caso de la tabla clientes, transformaremos la columna fecha de nacimiento para calcular la edad del cliente y añadiremos una columna índice que será la clave subrogada de esta consulta.

![dataXbi-ETL con Flujos de datos Transformaciones Tabla-clientes](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-clientes.png)  
  

Cuando el origen de datos no contiene grandes volúmenes de datos y si no va a unir datos de diferentes fuentes de datos o si no está realizando transformaciones de proceso o memoria intensivas, como unir o agregar grandes volúmenes de datos podemos deshabilitar el almacenamiento provisional y cargar directamente en el destino de salida.

Si nos fijamos en la consulta tiendas podemos ver un rayo de color naranja, esto indica que en esta consulta se usará el motor de proceso mejorado durante la actualización. Esta consulta consulta combina datos de tiendas y municipios.

![dataXbi-ETL con Flujos de datos Trafsormaciones combinar tablas tiendas y municipios](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-tiendas-combinacion.png)  
  

El resto de consultas no requiere de transformaciones especificas por eso no las analizaremos en detalle.

Por último debemos asignar un destino a cada una de las consulta excepto a municipios y datos\_origen. El destino de todas las consultas será un nuevo Lakehouse, **datos\_transformados**.

![dataXbi-ETL con Flujos de datos Transformaciones clientes tabla destino](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-clientes-destino.png)  
  

Para definir el nuevo destino escogemos Lakehouse y a continuación como hicimos al inicio seleccionamos primero el área de trabajo y luego el Lakehouse.

![dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-clientes-destino-configuracion](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-clientes-destino-configuracion.png)

Especificamos si la tabla es nueva o ya existe y el nuevo nombre de la tabla. Escogemos el método de actualización, las opciones del esquema y el mapeo de los campos entre origen y destino. Recuerda que los nombres de las columnas no deben contener espacios en blanco.

### Flujo de datos Gen2 transformar\_ventas

El flujo de datos transformar\_ventas es muy similar al transformar\_dimensiones. Al igual que en el flujo transformar\_dimensiones creamos una consulta que conecte con el Lakehouse datos\_origen y la referenciamos: ventas\_eur, ventas\_usd y conversion\_eur. A las consultas ventas\_eur y ventas\_usd le añadiremos una columna con el nombre de la tabla de origen para poder diferenciarlas luego. La consulta ventas\_usd debe combinarse con la consulta conversion\_eur para transformar los importes de dolar a euro. Finalmente las consultas ventas\_eur y ventas\_usd se anexan para formar la consulta ventas. La consulta ventas es la única que tendrá un destino.

![dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-ventas-anexar](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Lakehouse-Tabla-ventas-anexar.png)  
  

De la misma forma que creamos el flujo de datos transformar\_ventas creamos transformar\_presupuestos y transformar\_tickets.

### Orquestar el proceso de transformar los datos

Para orquestar todas las transformaciones de esta capa crearemos una canalización igual que hicimos en la capa de bronce. A esta canalización la llamaremos **transformar\_datos** y lo que hará será llamar cada uno de los flujos de datos para que se ejecuten en orden secuencial.

![dataXbi-ETL-Transformaciones-Canalización](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Canalización.png)  
  

Ejecutamos la canalización y podemos ver los tiempos que demora cada flujo de datos en ejecutarse así como el tiempo total que demora la canalización.

Una vez ejecutada la canalización podemos ver el Lakehouse datos\_transformados con todos los datos cargados.

## La capa Oro

En esta capa se llevarán a cabo las últimas transformaciones y se dejará a punto el modelo tabular que cargaremos en el modelo semántico.

Para la capa de oro los datos se almacenarán en un Almacén, en lugar de un Lakehouse, al que llamaremos **modelo\_datos**.

Para realizar la carga de los datos en el almacén y realizar las últimas transformaciones crearemos un único flujo de datos al que llamamos **modelar**. Tendrá como origen de datos el Lakehouse **datos\_transformados** y al igual que hicimos en la capa Plata crearemos una consulta maestra que conecte con el Lakehouse y que contendrá todas las tablas.

![dataXbi-ETL- Flujo de datos Modelar](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Modelar.png)

Como parte de las transformaciones que se llevarán a cabo en esta capa está el combinar las tablas de hechos con las tablas de dimensiones para reemplazar el campo clave de negocio por el campo clave sustituta que creamos en la capa de Plata. También asignaremos el tipo de datos correspondiente a cada columna de cada tabla. Crearemos la tabla Calendario con los campos requeridos. Se elegirán las columnas que se utilizarán en cada tabla del modelo semántico.

![dataXbi-ETL-Trafsormaciones-FD-Modelar-Tabla-ventas](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-FD-Modelar-Tabla-ventas.png)

Todas las consultas tendrán como destino el Almacén **modelo\_datos**. La configuración del destino es muy similar a la del Lakehouse solo que el esquema no puede ser dinámico.

![dataXbi-ETL-Almacen](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Trafsormaciones-Almacen.png)

En esta capa no necesitaremos de una canalización porque solamente debemos ejecutar un flujo de datos.

## Orquestar el proceso completo de ETL

Para ejecutar todo el proceso de ETL hemos creado una nueva canalización **etl\_completa**. Esta canalización será la que se encargue de ejecutar las canalizaciones de las capas bronce y plata y el flujo de datos Gen 2 de la capa de oro y actualizar el modelo semántico del área de trabajo PRO.

![dataXbi-ETL Completa - Canalización](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Completa-Canalización.png)  
  

Para la actualización del modelo semántico del área de trabajo PRO estamos utilizando la [API REST de Power BI](https://learn.microsoft.com/es-es/rest/api/power-bi/datasets/refresh-dataset) y la implementamos como una actividad Web de la canalización.

En la configuración de la actividad Web se debe crear una conexión y seleccionarla, especificar la dirección relativa del dataset que se quiere actualizar y elegir el método Post entre otras propiedades.

![ETL completa con canalización y actividad-Web](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-ETL-Completa-Canalización-Actividad-Web-1.png)  
  

**Nota**: En el momento de escribir esta entrada ya está disponible una actividad de canalización para actualizar el modelo semántico.

![dataXbi-Canalizacion-Actividad Actualización del Modelo Semántico](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-Canalizacion-Actividad-Actualizar-Modelo-Semantico.png)  
  

Finalmente estamos listos para ejecutar la canalización y llevar a cabo todo el proceso de ETL.

Una vez que los datos se han cargado en el modelo semántico podemos apagar la capacidad Fabric y trabajar con el modelo semántico y el informe.

![dataXbi-Modelo Semántico](/assets/images/posts/2024-04-27-poc-etl-low-cost-fabric-capas-plata-oro/dataXbi-Modelo-Semantico.png)  
  

En la próxima y última entrada de la serie mostraremos los costes de todo el proceso de ETL.

##### Todas las entradas de esta serie **ETL "low cost" con Fabric**

1. [Arquitectura](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/)
2. [Capacidad](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/)
3. [Capa bronce](https://www.dataxbi.com/blog/2024/03/07/poc-etl-low-cost-con-fabric-capa-bronce/)
4. [Carga incremental](https://www.dataxbi.com/blog/2024/03/26/poc-etl-low-cost-fabric-carga-incremental/)
5. [Capas plata y oro](https://www.dataxbi.com/blog/2024/04/27/poc-etl-low-cost-fabric-capas-plata-oro/)
6. [Costes](https://www.dataxbi.com/blog/2024/05/08/poc-etl-low-cost-fabric-costes/)
