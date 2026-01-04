---
layout: post
title: "PoC ETL low cost con Fabric – Costes"
date: 2024-05-08
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

En esta �ltima entrada de la serie comparamos los costes de ejecutar todo el proceso de ETL "low cost" dos veces. La primera vez solo "encedemos" la capacidad Fabric para hacer el ETL, y la segunda vez mantenemos la capacidad encendida durante m�s de 24 horas despu�s de ejecutar el ETL.

<!--more-->

Las dos ejecuciones del proceso de ETL las hice con una capacidad F2 que tiene 2 unidades de capacidad (CU) a un precio de unos 40 c�ntimos de euros por hora, y que se mantiene pausada la mayor parte del tiempo.  
La primera ejecuci�n fue el d�a 4 de mayo, y reanud� la capacidad Fabric justo antes de comenzar, y la paus� al terminar.  
La segunda ejecuci�n fue el d�a 6 de mayo, y reanud� la capacidad Fabric justo antes de comenzar, pero no la paus� hasta el d�a siguiente, 7 de mayo.

En la siguiente captura de pantalla del centro de supervisi�n de Fabric se muestran las dos ejecuciones de la canalizaci�n `etl_completa`. La primera ejecuci�n est� marcada en color rojo y la segunda en color azul. Las fechas est�n en el formato (mes/d�a/a�o).  
Se puede observar que la primera ejecuci�n comenz� el d�a 4-mayo-2024 a las 2:04 PM y demor� 32 minutos, mientras que la segunda ejecuci�n comenz� el d�a 7-mayo-2024 a las 8:12 AM y demor� 49 minutos. ![Captura de pantalla del Centro de Supervisi�n de Fabric](/assets/images/posts/2024-05-08-poc-etl-low-cost-fabric-costes/dataXbi-Fabric-ETL-low-cost-Costes-.Centro-supervision.png)

Para confirmar el tiempo que estuvo activa la capacidad Fabric, se puede utilizar la aplicaci�n gratuita de Power BI "**Fabric Capacity Metrics**" donde podemos ir a la pesta�a "System events" de la tabla que aparece en la parte superior derecha.

La siguiente imagen es una captura de pantalla de "Fabric Capacity Metrics" donde a la izquierda se ve un gr�fico de columnas con las unidades de capacidad (CU) consumidas, y a la derecha se ve una tabla con los cambios de estado de la capacidad. De nuevo he marcado en color rojo la primera ejecuci�n y en color azul la segunda.

El gr�fico de columnas nos revela que la primera ejecuci�n consumi� m�s CU que la segunda, y en la tabla de la derecha distinguimos que la capacidad estuvo activa el d�a 4-mayo-2024 desde las 11:58 hasta las 12:43 del mismo d�a, y estuvo activa de nuevo desde el d�a 6-mayo-2024 a las 6:03 hasta el d�a 7-mayo-2024 a las 10:35. Hay que tener en cuenta que las fechas est�n en formato (d�a/mes/a�o) y que la hora est� en UTC por lo que hay 2 horas de diferencia con la hora en Espa�a. ![Captura de pantalla de la aplicaci�n Power BI Fabric Capacity Metrics donde se muestra el consumo de unidades de capacidad para cada una de las dos ejecuciones y el horario en que estuvo activa la capacidad.](/assets/images/posts/2024-05-08-poc-etl-low-cost-fabric-costes/dataXbi-Fabric-ETL-low-cost-Costes-.Capacity-Metrics-1.png)

Un dato que me parece muy interesante es **c�mo se distribuye la capacidad utilizada a lo largo del tiempo** cuando la capacidad se pausa luego de terminar la primera ejecuci�n, o cuando se mantiene activa durante m�s de 24 horas luego de terminar la segunda ejecuci�n. Y para ello volver� a utilizar "Fabric Capacity Metrics".

En la siguiente captura de pantalla, en el gr�fico de columnas de la izquierda he seleccionado el d�a 4-mayo-2024 que corresponde a la **primera ejecuci�n**, y en la derecha he utilizado la pesta�a "Utilization" para mostrar en otro gr�fico la distribuci�n de CU en el tiempo, como un porcentaje de la capacidad asignada (recuerda que en este caso es F2 o 2 CU). En este gr�fico de la derecha aparece s�lo una columna que representa un intervalo de 30 segundos y que es muy alta, con un valor total casi absurdo de m�s de 50000%. Este valor es tan alto porque est� indicando toda la capacidad utilizada por el "**bursting**", que es una caracter�stica de Fabric donde las tareas se ejecutan por encima de la capacidad contratada. En este caso, como la capacidad se paus�, el gr�fico nos muestra toda la capacidad consumida. ![Captura de pantalla de la aplicaci�n Power BI Fabric Capacity Metrics donde se muestra el consumo de capacidad a lo largo del tiempo de la primera ejecuci�n.](/assets/images/posts/2024-05-08-poc-etl-low-cost-fabric-costes/dataXbi-Fabric-ETL-low-cost-Costes-.Capacity-Metrics-2.png)

Para entender el valor de 50000% del gr�fico de la derecha, se puede mirar el tooltip, que muestro en la siguiente imagen, y donde aparecen varios datos, como que el 100% corresponde a 60 segundos de CU, que la capacidad total consumida fue de 35.004,38 segundos de CU y por lo tanto el porcentaje consumido es de 58340,63%.

La unidad segundos de CU, o CU(s) indica cuantos segundos de capacidad se han utilizado, y en el caso de F2 hay disponibles 2 CU en cada segundo o 2 CU(s) y en una hora habr�a disponible 7.200 CU(s) = 2 CU \* 3.600 segundos. En el gr�fico que estamos analizando, la columna representa un intervalo de 30 segundos, por lo que el 100% de CU(s) es 60 (2 CU x 30 segundos).

![Captura de pantalla del tooltip del gr�fico de columna de la derecha donde se puede ver que el 100% corresponde a 60 CU por segundos y que la capacidad consumida por el bursting es de 35004 CU por segundo, lo que representa un 58340%.](/assets/images/posts/2024-05-08-poc-etl-low-cost-fabric-costes/dataXbi-Fabric-ETL-low-cost-Costes-.Capacity-Metrics-2b.png)

  

A continuaci�n te muestro los mismos gr�ficos anteriores pero para la **segunda ejecuci�n**, donde se puede ver que el gr�fico de la derecha se ha aplanado manteniendo un valor de un 25% de la capacidad a lo largo del tiempo. Este es el resultado del "**smoothing**", que es otra caracter�stica de Fabric que distribuye la capacidad consumida a lo largo del tiempo, mientras la capacidad permanezca encendida. En el caso de las tareas de segundo plano, como son las tareas de ETL que hemos ejecutado, la distribuci�n se hace en un per�odo de 24 horas. En las tareas interactivas, el per�odo es de 1 hora.

Esta segunda ejecuci�n tuvo una duraci�n de 49 minutos, como vimos al principio, pero fue porque Fabric utiliz� por adelantado m�s capacidad de la contratada, pero luego esa capacidad en exceso se fue distribuyendo a lo largo de las siguientes 24 horas.

![Captura de pantalla de la aplicaci�n Power BI Fabric Capacity Metrics donde se muestra el consumo de capacidad a lo largo del tiempo de la segunda  ejecuci�n.](/assets/images/posts/2024-05-08-poc-etl-low-cost-fabric-costes/dataXbi-Fabric-ETL-low-cost-Costes-.Capacity-Metrics-3.png)

  

Para conocer los **costes** de ambas ejecuciones me he ido al **portal de Azure** y he creado el gr�fico que muestro a continuaci�n, donde a la izquierda se ve una barra que corresponde con la primera ejecuci�n y a la derecha se ven dos barras que corresponden a la segunda ejecuci�n m�s todo el tiempo que estuvo activa la capacidad.

El coste total es de 14,08 euros, distribuidos en unos 2,25 euros de la primera ejecuci�n y unos 11,83 de la segunda ejecuci�n m�s el tiempo que estuvo activa la capacidad.

Creo que es importante se�alar que **mientras la capacidad est� activa se cobra cada minuto seg�n el precio de la capacidad contratada aunque no se utilice**.

![Captura de pantalla del portal de Azure donde se muestran los costes de las dos ejecuciones en un gr�fico de columnas apiladas.](/assets/images/posts/2024-05-08-poc-etl-low-cost-fabric-costes/dataXbi-Fabric-ETL-low-cost-Costes-Azure-1.png)

Para mostrar mejor lo que acabo de comentar, he cambiado el gr�fico anterior por uno de columnas agrupadas y he marcado con una flecha las columnas que corresponden a la capacidad sin utilizar. Como se ve, durante la segunda ejecuci�n la mayor parte del coste corresponde a capacidad sin utilizar.

Tambi�n se puede apreciar (si miramos con una lupa) que hay cierto coste asociado al almacenamiento de los datos y a la escritura en OneLake, aunque es muy bajo.

![Captura de pantalla del portal de Azure donde se muestran los costes de las dos ejecuciones en un gr�fico de columnas grupadas.](/assets/images/posts/2024-05-08-poc-etl-low-cost-fabric-costes/dataXbi-Fabric-ETL-low-cost-Costes-Azure-2.png)

Para entender **c�mo podemos estimar los costes a partir de la aplicaci�n "Fabric Capacity Metrcis"** voy a hacer un ejercicio con la primera ejecuci�n utilizando los CU(s) o segundos de CU reportados, que fueron **35.004,38 CU(s)**.

Si el precio por hora de una capacidad F2 es de unos 0,40 euros y una F2 tiene 2 CU, estamos pagando el CU a 0,20 euros por hora y por tanto el segundo de CU saldr�a a 0,0000555556 euros = 0,20 euros / 3.600 segundos. Si multiplicamos este valor por los 35.004,38 CU(s) reportados por "Fabric Capacity Metrics", obtenemos un coste aproximado de **1,94 euros**. A este valor habr�a que sumarle unos 0,30 euros por el peque�o tiempo que estuvo la capacidad activa sin hacer nada y alg�n coste m�nimo por el almacenamiento, como se ve en el gr�fico anterior de Azure. De aqu� saldr�a el coste reportado por Azure de unos 2,25 euros.

**Faltar�a hacer un an�lisis m�s detallado del consumo por cada componente de Fabric**, con lo que podr�amos tener m�s elementos a la hora de decidir cu�l componente utilizar para bajar los costes.

Pero el objetivo de la prueba de concepto que hemos hecho en esta serie era el de sustituir un proceso de ETL implementado con Flujos de Datos Gen 1 por otro similar utilizando Fabric, pero con la premisa de poder utilizar parte de lo que exist�a y que el cliente pudiera encargarse del mantenimiento, por lo que se prioriz� la utilizaci�n de los Flujos de Datos Gen2.

Quiz�s valga la pena hacer una segunda temporada de esta serie donde hagamos el mismo proceso pero sustituyendo los Flujos de Datos Gen2 por otros componentes y comparemos los costes. 😊

##### Todas las entradas de esta serie **ETL "low cost" con Fabric**

1. [Arquitectura](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/)
2. [Capacidad](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/)
3. [Capa bronce](https://www.dataxbi.com/blog/2024/03/07/poc-etl-low-cost-con-fabric-capa-bronce/)
4. [Carga incremental](https://www.dataxbi.com/blog/2024/03/26/poc-etl-low-cost-fabric-carga-incremental/)
5. [Capas plata y oro](https://www.dataxbi.com/blog/2024/04/27/poc-etl-low-cost-fabric-capas-plata-oro/)
6. [Costes](https://www.dataxbi.com/blog/2024/05/08/poc-etl-low-cost-fabric-costes/)
