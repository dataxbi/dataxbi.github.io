---
layout: post
title: "PoC ETL low cost con Fabric - Arquitectura"
date: 2024-02-11
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

En esta entrada queremos proponer una arquitectura donde se utilicen dos �reas de trabajo, una con capacidad Fabric para realizar la ETL de los datos y otra �rea de trabajo con licencia PRO que contiene el modelo sem�ntico en modo de almacenamiento importar. La idea es mejorar el proceso de ETL que tenemos sustituyendo los flujos de datos GEN 1 por los componentes de ingenier�a de datos de Fabric: flujos de datos GEN 2, las canalizaciones y los cuadernos de notas de Spark, apagando y encendiendo la capacidad Fabric para mantener bajos los costes.

<!--more-->

### Arquitectura actual

Tenemos un cliente para el cu�l hemos desarrollado un modelo sem�ntico cuyos or�genes de datos provienen de distintas fuentes: SharePoint, MySQL y API REST. Conectado a ese modelo sem�ntico tenemos un informe que est� publicado en el servicio de Power BI en un �rea con licencia PRO. El n�mero de visores del informe est� sobre las 30 personas y todos tienen licencia de Power BI Pro, lo que supone un coste de alrededor de 330 € mensuales aproximadamente. El cliente no desea comprar una capacidad Premium para el �rea que contiene el informe y en la siguiente imagen puedes ver la arquitectura actual con que cuenta:

![dataXbi - PoC de ETL con Fabric Arquitectura Actual](/assets/images/posts/2024-02-11-poc-etl-low-cost-fabric-arquitectura/dataXbi-PoC-ETL-Fabric-Arquitectura-Actual.png)  
  

Como puedes ver en la imagen se utilizan distintos or�genes de datos y el proceso de ETL se realiza con flujos de datos GEN 1. El problema que tenemos es que este proceso es muy lento y no se puede realizar actualizaci�n incremental de los datos porque esa opci�n solo est� disponible en las capacidades Premium y PPU.

El primer origen de datos es una carpeta de SharePoint donde est�n almacenados en ficheros CSV los datos de las entidades del negocio: clientes, productos, tiendas y vendedores.

![dataXbi - PoC ETL Fabric Origenes de Datos de SharePoint](/assets/images/posts/2024-02-11-poc-etl-low-cost-fabric-arquitectura/dataXbi-PoC-ETL-Fabric-Origenes-SharePoint.png)  
  

Tambi�n en SharePoint, dentro de la carpeta presupuestos, est�n almacenados en archivos CSV los presupuestos mensuales.

![dataXbi - PoC ETL con Fabric Origenes SharePoint Presupuestos](/assets/images/posts/2024-02-11-poc-etl-low-cost-fabric-arquitectura/dataXbi-PoC-ETL-Fabric-Origenes-SharePoint-Presupuestos.png)  
  

Y en la carpeta tickets est�n los tickets de soporte de los clientes almacenados en archivos CSV diarios.

![dataXbi - PoC de ETL con Fabric Origenes SharePoint Tickets](/assets/images/posts/2024-02-11-poc-etl-low-cost-fabric-arquitectura/dataXbi-PoC-ETL-Fabric-Origenes-SharePoint-Tickets.png)  
  
El segundo origen de datos es MySQL. Este origen es on premise y requiere de una puerta de enlace para su actualizaci�n. Tienen dos bases de datos: Empresa EUR y Empresa USD. Ambas bases de datos contienen una tabla Ventas que tiene la misma estructura, una para almacenar las ventas en euros y otra para las ventas en d�lares. Los datos de las dos tablas han de combinarse para analizar las ventas totales:

![dataXbi - PoC de ETL con Fabric Origenes MySQL](/assets/images/posts/2024-02-11-poc-etl-low-cost-fabric-arquitectura/dataXbi-PoC-Fabric-ETL-low-cost-MySQL.png)  
  

El �ltimo origen de datos es una API REST de donde se descarga cada d�a un archivo JSON con el cambio de la moneda. En el informe las ventas totales se muestran en euros por lo que es necesario transformar los valores costes y precios unitarios de la tabla Ventas de la base de datos Empresa USD de d�lares a euros antes de combinarlas.

El proceso de ETL lo realizamos en flujos de datos GEN 1, en el servicio Power BI. Desde Power BI Desktop nos conectamos a los flujos de datos y cargamos los datos en el modelo. El archivo resultante pesa menos de 1 GB.

El proceso de ETL es muy lento y la idea es mejorarlo. Una de las opciones que hemos valorado es utilizar licencias PPU para cada usuario, que tienen un coste de 18,00 euros mensuales aproximadamente. Esto nos brinda una mejora significativa que es que podemos utilizar actualizaci�n incremental en los flujos de datos GEN 1 pero tiene la desventaja de que el coste de licencias se dispara alrededor de los 600 € mensuales.

### Arquitectura propuesta

La otra idea que hemos tenido y que es por la que queremos apostar es utilizar la Capacidad Fabric y aprovechar todas las ventajas que nos ofrece. Utilizar�amos Fabric solo para realizar la ETL y luego se cargar�an los datos en un modelo sem�ntico que estar�a en otra �rea de trabajo con capacidad Power BI en lugar de Fabric. Una vez cargados los datos en el modelo sem�ntico, la capacidad Fabric se apagar�a hasta la pr�xima actualizaci�n. El reto est� en encender y apagar Fabric a nuestra conveniencia.

La arquitectura propuesta es la que se muestra en la siguiente imagen:

![dataXbi - PoC de ETL con Fabric Propuesta de Arquitectura](/assets/images/posts/2024-02-11-poc-etl-low-cost-fabric-arquitectura/dataXbi-PoC-ETL-Fabric-Propuesta-Arquitectura.png)  
  

Para implementar esta arquitectura siguiendo las buenas pr�cticas de dise�o recomendadas para Fabric y como continuaci�n de la metodolog�a de trabajo de buenas pr�cticas [para organizar las consultas en el editor de Power Query](https://www.dataxbi.com/blog/2023/08/30/tips-organizar-consultas-power-query-video/), de la que ya hemos hablado en otras entradas de nuestro blog, hemos implementado la _arquitectura medallion_ de almac�n de lago.

Esta arquitectura es un patr�n de dise�o de datos que se utiliza para organizar l�gicamente los datos en un lakehouse y consta de tres capas o zonas distintas, aunque pueden ser m�s. Cada capa tiene como objetivo mejorar de forma incremental y progresiva la estructura y la calidad de los datos almacenados en el lago a medida que fluyen a trav�s de cada capa. Este enfoque multicapa nos ayuda a crear una �nica fuente de la verdad para los datos empresariales.

La siguiente imagen muestra la _arquitectura medallion_ que hemos dise�ado para nuestra prueba de concepto. Como se observa en la imagen se ha creado un Lakehouse para almacenar los datos de cada capa.

![dataXbi - PoC de ETL con Fabric - Propuesta Arquitectura Medallion](/assets/images/posts/2024-02-11-poc-etl-low-cost-fabric-arquitectura/dataXbi-PoC-ETL-Fabric-Propuesta-Arquitectura-Medallion.png)

La primera capa, conocida como bronce y a la que llamamos **datos\_origen**, almacena los datos tal y como est�n en el origen. La implementaci�n t�pica requiere que los datos tengan la misma estructura y est�n en el mismo formato que el origen.

La segunda capa, plata, es donde se realizan la mayor parte de las transformaciones sobre los datos. Al Lakehouse de esta capa le hemos llamado **datos\_transformados**. Aqu� se realiza la limpieza de los datos, se crean las claves sustitutas, se anexan y combinan tablas.

La �ltima capa, oro, es donde se enriquecen los datos y se aplica la capa final de transformaciones de datos y reglas de calidad de datos para crear el esquema de estrella con sus tablas de hechos y dimensiones. A esta capa la hemos llamado **modelo\_datos**. A esta capa nos conectar�amos desde Power BI para importar los datos al modelo sem�ntico.

Para orquestar todo el proceso de ETL hemos creado una canalizaci�n que hemos llamado **etl\_completa**.

![dataXbi - PoC de ETL con Fabric canalizacion etl completa](/assets/images/posts/2024-02-11-poc-etl-low-cost-fabric-arquitectura/dataXbi-PoC-ETL-Fabric-Lakehouse-canalizacion-etl_completa.png)

Esta canalizaci�n a su vez llama a otras canalizaciones y componentes para realizar las tareas requeridas en cada capa y de las cuales hablaremos en pr�ximas entradas.

##### Todas las entradas de esta serie **ETL "low cost" con Fabric**

1. [Arquitectura](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/)
2. [Capacidad](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/)
3. [Capa bronce](https://www.dataxbi.com/blog/2024/03/07/poc-etl-low-cost-con-fabric-capa-bronce/)
4. [Carga incremental](https://www.dataxbi.com/blog/2024/03/26/poc-etl-low-cost-fabric-carga-incremental/)
5. [Capas plata y oro](https://www.dataxbi.com/blog/2024/04/27/poc-etl-low-cost-fabric-capas-plata-oro/)
6. [Costes](https://www.dataxbi.com/blog/2024/05/08/poc-etl-low-cost-fabric-costes/)
