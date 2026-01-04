---
layout: post
title: "PoC ETL low cost con Fabric - Capacidad"
date: 2024-02-22
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

Continuamos la serie de ETL low cost con Microsoft Fabric y en esta ocasi�n vamos a hablar sobre la capacidad Fabric: qu� es una capacidad, c�mo podemos obtenerla, cuanto cuesta y como podemos "encenderla" y "apagarla".

<!--more-->

### Capacidad Fabric

Una capacidad Fabric representa los recursos de c�mputo donde se van a ejecutar las tareas y se ofrecen en diferentes tama�os o SKU, que van desde F2 que es la m�nima capacidad, y le siguen F4, F8, F16, F32 y as� hasta F2048. A mayor tama�o de capacidad, es mayor el rendimiento y este se mide en unidades de capacidad por segundo o CUs (en ingl�s). Una capacidad F2 tiene un rendimiento de 2 CUs, mientras que una capacidad F2048 tiene un rendimiento de 2048 CUs.

Hay que tener en cuenta que Fabric tratar� de ejecutar las tareas en el menor tiempo posible aunque para ello exceda moment�neamente los CUs de la capacidad que tenemos contratada. Luego para compensarlo, distribuir� los CUs gastados en ese pico en un per�odo de tiempo que es de 5 minutos para las tareas interactivas y de 24 horas para las tareas en segundo plano. Este proceso se conoce como "bursting and smoothing" y puedes leer m�s sobre ello en este art�culo: [https://blog.fabric.microsoft.com/es-es/blog/fabric-capacities-everything-you-need-to-know-about-whats-new-and-whats-coming](https://blog.fabric.microsoft.com/es-es/blog/fabric-capacities-everything-you-need-to-know-about-whats-new-and-whats-coming)

Ya si el volumen de tareas es tal que excede continuamente el rendimiento de la capacidad, si se aplica una regulaci�n ("throttling") donde las tareas nuevas no se ejecutar�n hasta que no haya suficientes recursos.

**El "bursting and smoothing" nos permite planificar la capacidad a contratar teniendo en cuenta el rendimiento promedio de uso y no el rendimiento m�ximo.**

### Costes de las capacidades Fabric

Las capacidades Fabric se pueden obtener de dos maneras:

- Si tienes una capacidad Premium, la capacidad Fabric viene incluida, s�lo tienes que activarla. Una capacidad Premium P1 se corresponde con una capacidad Fabric F64, P2 con 128 y as� hasta llegar a P5 con F1024.
- Comprar capacidad Fabric en Azure en modalidad "pay as you go". Los precios de estas capacidades comienzan en **297 euros/mes para F2**.  
    Visita esta p�gina para ver los precios de todas las capacidades: [https://azure.microsoft.com/es-es/pricing/details/microsoft-fabric/](https://azure.microsoft.com/es-es/pricing/details/microsoft-fabric/).  
    Al coste de la capacidad hay que sumarle el **coste de almacenamiento en OneLake** que puedes consultar en la misma p�gina, pero que no es alto.

Como estamos hablando de una soluci�n "low cost" queda descartada la licencia Premium, por lo que nos centraremos en la licencia "pay as you go". El precio de entrada, de la F2, parece bastante razonable, aunque habr�a que ver si una capacidad F2 tiene suficiente rendimiento para nuestra ETL.

Pero podemos ahorrar m�s porque este precio es una estimaci�n para un mes completo, pero estas capacidades **se pueden pausar y reanudar seg�n sea necesario y se facturan por segundo**, por lo que podemos "encender" la capacidad cuando hacemos el ETL y el resto del tiempo mantenerla en pausa.

La tabla siguiente muestra los precios por hora de las capacidades Fabric y vemos, por ejemplo, que el precio de una **capacidad F2 es de 0,408 euros / hora**. ![Tabla con los precios por hora de las capacidades Fabric](/assets/images/posts/2024-02-22-poc-etl-low-cost-fabric-capacidad/dataXbi-PoC-Fabric-ETL-low-cost-Capacidad-Precios-hora.png)

La �ltima columna de la tabla muestra unos precios m�s bajos y para acceder a ellos hay que reservar una capacidad por todo un a�o haciendo un �nico pago anual o pagando la cuota de cada mes. En este caso el **precio de una capacidad F2 es de 0,243 euros / hora**.

La imagen siguiente muestra un pantallazo del portal de Azure en el momento en que se est� comprando una reserva de capacidad Fabric. Se esta reservando 1 CU con una cuota mensual de 89,41 euros que hace un total anual de 1072,92 euros. ![Pantallazo del portal de Azure mostrando como reservar capacidad Fabric](/assets/images/posts/2024-02-22-poc-etl-low-cost-fabric-capacidad/dataXbi-PoC-Fabric-ETL-low-cost-Capacidad-Precios-reserva.png)

Es interesante que se pueden reservar los CU individualmente como en este ejemplo que hemos reservado 1 CU.

Este descuento se aplica al consumo por hora de las capacidades que tengas contratadas. Si en una hora se consume menos de lo reservado, se cobra lo reservado, si se consume m�s, la diferencia se cobra al precio de "pay as you go". Para m�s detalles y ejemplos, puedes leer este art�culo: [https://learn.microsoft.com/es-es/azure/cost-management-billing/reservations/fabric-capacity](https://learn.microsoft.com/es-es/azure/cost-management-billing/reservations/fabric-capacity)

En resumen, **podemos lograr mantener los costes contenidos si pausamos la capacidad cuando no la estemos usando y podr�amos bajarlos a�n mas si reservamos capacidades**.

En el diagrama siguiente trato de explicar c�mo se calcula el coste de una capacidad cuando esta se pausa, al menos como yo lo entiendo en este momento. ![Diagrama que explica c�mo se calcula el coste de una capacidad cuando esta se pausa.](/assets/images/posts/2024-02-22-poc-etl-low-cost-fabric-capacidad/dataXbi-PoC-Fabric-ETL-low-cost-Capacidad.png) Resumiendo el diagrama, si la capacidad se para, se cobrar� el coste mientras estuvo encendida m�s la deuda que haya debido al "bursting".

Al analizar los costes hay que tener en cuenta que **vamos a necesitar la capacidad "encendida" cuando estemos desarrollando o estemos dando mantenimiento**.

Y por cierto, **a una capacidad tambi�n se le puede cambiar el SKU en cualquier momento, por ejemplo de F2 a F16** de la misma manera que se pausa y se reanuda. Por ejemplo, podemos tener una capacidad para desarrollo con F2 "encendida" durante el horario laboral, pero aumentar la capacidad en momentos puntuales en que veamos que se enlentece el trabajo.

Tambi�n podr�amos ir al sitio de Ideas de Fabric y proponer que saquen una licencia para desarrolladores a un precio similar al PPU, por ejemplo. 😁

### Medir la utilizaci�n de la capacidad

Es importante medir la utilizaci�n de la capacidad para identificar los recursos que m�s consumen y tomar medidas para bajar el consumo. Tambi�n es importante medir cuando estamos haciendo una prueba de concepto para poder estimar qu� capacidad vamos a necesitar e incluso si vale la pena reservar.

Para ello Microsoft distribuye gratuitamente la aplicaci�n de Power BI "[Fabric Capacity Matrics](https://learn.microsoft.com/es-es/fabric/enterprise/metrics-app)"

Aqu� tienes un pantallazo de de la aplicaci�n mostrando las m�tricas de algunas de las pruebas que hemos hecho. ![Pantallazo de la aplicaci�n de Power BI Fabric Capacity Metrics](/assets/images/posts/2024-02-22-poc-etl-low-cost-fabric-capacidad/dataXbi-PoC-Fabric-ETL-low-cost-Capacidad-Capacity-Metrics.png)

Al final de esta serie volveremos a esta aplicaci�n para mostrar los consumos con m�s detalles.

### Pausar y reanudar la capacidad

Bueno, supongamos que ya te convenc� de que puedes hacer un ETL "low cost" con Fabric 😊 pero faltar�a una pieza del rompecabezas, que es c�mo automatizar la pausa y reanudaci�n de la capacidad Fabric. Te adelanto que es posible y te voy a dar varias alternativas.

Primero te muestro un pantallazo del portal de Azure donde se ve una capacidad Fabric F2 que est� en pausa y c�mo apretando un bot�n se puede reanudar.  
![Pantallazo del portal de Azure mostrando una capacidad Fabric en pausa](/assets/images/posts/2024-02-22-poc-etl-low-cost-fabric-capacidad/dataXbi-PoC-Fabric-ETL-low-cost-Capacidad-Pausar-Reanudar-Azure.png)

En el momento de escribir este blog no existe ninguna opci�n en la interfaz de usuario de Fabric para manejar de manera autom�tica la pausa y reanudaci�n de una capacidad. Pero si se puede hacer utilizando la API REST de Azure, porque al fin y al cabo, una capacidad Fabric es otro recurso m�s de Azure.

La **primera opci�n** que te presento es el c�digo que ha compartido Kasper Kirkegaard en este repositorio de GitHub: [https://github.com/nocsi-zz/fabric-capacity-management](https://github.com/nocsi-zz/fabric-capacity-management) que en realidad son 3 opciones: Azure Data Factory, canalizaci�n de Fabric o Postman.

Si tienes la posibilidad de utilizar Azure Data Factory, podr�as tener una sola capacidad Fabric que es la que pausas y reanudas desde Azure, y los costes de Data Factory no deben ser significativos (aunque siempre hay que comprobar).

La opci�n de hacerlo desde una canalizaci�n de Fabric implica que hay que tener al menos dos capacidades de Fabric, una es la que se pausa/reanuda y la otra tendr�a que estar "encendida" siempre. Esto puede ser factible para una soluci�n un poco menos "low cost", pero donde el coste se podr�a mantener a�n bajo si utilizamos una capacidad F2 con reserva.

La opci�n de Postman nos sirve para hacer pruebas manuales o para utilizarlo como base para implementar un script o una aplicaci�n.

La **segunda opci�n** que te presento la ha compartido Pat Mahoney en su canal de YouTube: [https://youtu.be/VIf3bCDf8mM?si=4l3nhylG5n-pXk3p](https://youtu.be/VIf3bCDf8mM?si=4l3nhylG5n-pXk3p) y consiste en hacer un flujo con Power Automate. De esta manera puedes utilizar una sola capacidad de Fabric si tienes la licencia apropiada de Microsoft 365. La �nica pega que le veo desde el punto de vista "low cost" es que necesita el conector [Azure Resource Manager](https://powerautomate.microsoft.com/es-es/connectors/details/shared_arm/azure-resource-manager/) que es Premium.

La **tercera y �ltima opci�n** que te presento es de la casa 😊 y es la herramienta de l�nea de comandos `pbicmd` que estamos desarrollando con la idea de que pueda ser utilizada para automatizar tareas de Power BI. Para esta prueba de concepto le hemos incorporado varias opciones para manejar las capacidades Fabric: obtener detalles de las capacidades, pausar o reanudar una capacidad, y cambiar el SKU de una capacidad.

Para m�s informaci�n de la herramienta vista la p�gina [https://www.dataxbi.com/pbicmd/](https://www.dataxbi.com/pbicmd/)

![Mensaje de ayuda de la herramienta pbicmd mostrando los subcomandos del comando fabric.](/assets/images/posts/2024-02-22-poc-etl-low-cost-fabric-capacidad/dataXbi-PoC-Fabric-ETL-low-cost-Capacidad-Pausar-Reanudar-pbicmd.png)

Dicha herramienta est� implementada con Python y es de c�digo abierto, por lo que puedes adaptarla a tus necesidades. Adem�s del c�digo fuente distribuimos un ejecutable EXE que puedes utilizar sin tener que instalar Python. En el caso de esta prueba de concepto, existe un servidor Windows donde se ejecuta una puerta de enlace y es desde donde ejecutamos `pbicmd`.

##### Todas las entradas de esta serie **ETL "low cost" con Fabric**

1. [Arquitectura](https://www.dataxbi.com/blog/2024/02/11/poc-etl-low-cost-fabric-arquitectura/)
2. [Capacidad](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/)
3. [Capa bronce](https://www.dataxbi.com/blog/2024/03/07/poc-etl-low-cost-con-fabric-capa-bronce/)
4. [Carga incremental](https://www.dataxbi.com/blog/2024/03/26/poc-etl-low-cost-fabric-carga-incremental/)
5. [Capas plata y oro](https://www.dataxbi.com/blog/2024/04/27/poc-etl-low-cost-fabric-capas-plata-oro/)
6. [Costes](https://www.dataxbi.com/blog/2024/05/08/poc-etl-low-cost-fabric-costes/)
