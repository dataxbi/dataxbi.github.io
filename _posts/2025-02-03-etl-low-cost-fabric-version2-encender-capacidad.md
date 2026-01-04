---
layout: post
title: "ETL low cost con Fabric versi�n 2 - Encender la capacidad"
date: 2025-02-03
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

**Actuallizado el 19 de marzo de 2025**: He actualizado este blog debido a que ya es posible utilizar la API REST de Fabric para ejecutar una canalizaci�n de datos con una entidad de servicio. Tambi�n he actualizado la herramienta **pbicmd**.

Siguiendo con la nueva versi�n de nuestra serie sobre ETL "low cost" con Fabric, esta vez proponemos una t�cnica m�s completa para controlar la capacidad Fabric desde un servidor "on premise", con el objetivo de minimizar el tiempo que la capacidad permanece encendida pero sin hacer nada.

<!--more-->

Recordamos que en [esta serie](https://www.dataxbi.com/blog/2025/01/07/etl-low-cost-fabric-version2-arquitectura/) estamos trabajando con dos �reas de trabajo: una con **capacidad Fabric** que s�lo se enciende para hacer la ETL, y otra con **licencia Pro** con un modelo sem�ntico de Power BI en modo de almacenamiento importar.

En esta entrada explicamos como hemos implementado un mecanismo que nos permite hacer lo siguiente desde un servidor "on premise":

- Encender la capacidad Fabric
- Inciar una canalizaci�n de datos que orquesta toda la ETL y actualiza el modelo sem�ntico
- Monitorizar la actualizaci�n del modelo sem�ntico de Power BI
- Apagar la capacidad Fabric

Este mecanismos lo hemos implementado en nuestra herramienta de l�nea de comando **[pbicmd](https://github.com/dataxbi/pbicmd)** para que se pueda programar su **ejecuci�n autom�tica**.

![Diagrama que muestra un �rea de trabajo Fabric, otro �rea de trabajo con licencia Pro o PPU y un servidor on premise que enciende y apaga la capacidad Fabric.](/assets/images/posts/2025-02-03-etl-low-cost-fabric-version2-encender-capacidad/dataXbi-ETL-low-cost-fabric-v2-encender-capacidad.png)

### Preparativos

Para probar este mecanismo, hemos creado un modelo sem�ntico muy sencillo que consiste en una sola tabla con los [viajes de los taxis de Nueva York](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) en un mes.

Dichos datos ya est�n cargados en una tabla en un Lakehouse en el �rea de trabajo con capacidad Fabric.

Por otra parte, hemos creado un informe con Power BI Desktop que importa los datos de la tabla de taxis utilizando el punto de conexi�n SQL del Lakehouse, y hemos publicado dicho informe en el �rea de trabajo con licencia Pro.

Volviendo al �rea de trabajo con capacidad Fabric, hemos creado una **canalizaci�n de datos** que actualiza los datos del modelo sem�ntico de Power BI que est� en el �rea de trabajo con licencia Pro. En un caso real, esta canalizaci�n es la que orquestar�a toda la ETL, antes de actualizar el modelo sem�ntico, pero para esta demostraci�n la hemos querido mantener lo m�s sencilla posible.

### Encendido y apagado de la capacidad Fabric

En la [versi�n anterior de esta serie](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/#pausar_capacidad) ya comentamos varias opciones para encender y apagar la capacidad.

En este caso nos interesa poderlo hacer desde la l�nea de comandos de un servidor "on premise", por lo que vamos a utilizar nuestra herramienta [pbicmd](https://github.com/dataxbi/pbicmd?tab=readme-ov-file#comando-fabric).

En dicha herramienta ya tenemos un comando que nos permite encender y apagar la capacidad. Pero el mecanismo que vamos a describir aqu� lo hemos incorporado como un nuevo comando.

Para implementar el encendido y el apagado hemos utilizado directamente la API REST de Azure para manejar recursos, y que en este caso consiste en hacer una solicitud **HTTP GET** a uno de estos URLs:

<figure>

<figcaption>

Encender la capacidad Fabric:

</figcaption>

```
https://management.azure.com/{capacity_id}/resume?api-version=2022-07-01-preview

```

</figure>

<figure>

<figcaption>

Apagar la capacidad Fabric:

</figcaption>

```
https://management.azure.com/{capacity_id}/suspend?api-version=2022-07-01-preview

```

</figure>

  

### Actualizaci�n del modelo sem�ntico de Power BI

Al crear la canalizaci�n de datos nos encontramos con un problema, porque aunque existe una actividad para [actualizar un modelo sem�ntico](https://learn.microsoft.com/es-es/fabric/data-factory/semantic-model-refresh-activity?wt.mc_id=MVP_367391), no funciona con modelos sem�nticos que est�n en �reas de trabajo con licencia Pro.

Afortunadamente, podemos implementar la actualizaci�n del modelo sem�ntico con [la API REST de Power BI](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/refresh-dataset-in-group?wt.mc_id=MVP_367391). Y para m�s fortuna, existe la librer�a [Semantic Link](https://learn.microsoft.com/es-es/fabric/data-science/semantic-link-overview?wt.mc_id=MVP_367391) con la que es muy f�cil hacerlo.

Por cierto, Semantic Link tiene la funci�n [refresh\_dataset](https://learn.microsoft.com/en-us/python/api/semantic-link-sempy/sempy.fabric?view=semantic-link-python#sempy-fabric-refresh-dataset?wt.mc_id=MVP_367391) para actualizar un modelo sem�ntico, pero le sucede lo mismo que a la actividad de la canalizaci�n de datos, que no funciona con modelos sem�nticos en �reas de trabajo con licencia Pro.

Pero gracias a una charla de [Rafael B�guena](https://www.linkedin.com/in/rafaelbaguena/) conocimos que Semantic Link cuenta con la clase [PowerBIRestClient](https://learn.microsoft.com/en-us/python/api/semantic-link-sempy/sempy.fabric.powerbirestclient?view=semantic-link-python?wt.mc_id=MVP_367391), con la que la actualizaci�n de un modelo sem�ntico en un �rea de trabajo Pro se puede implementar con este c�digo Python:

```
import sempy.fabric as fabric

WORKSPACE_ID = "xxxxxxxx-xxxx-xxxx-xxx-xxxxxxxxxxxx"
DATASET_ID = "xxxxxxxx-xxxx-xxxx-xxx-xxxxxxxxxxxx"
RETRY_COUNT = 3

pbi = fabric.PowerBIRestClient()
body = {
  "notifyOption": "MailOnFailure",
  "retryCount": RETRY_COUNT
}
pbi.post(f"https://api.powerbi.com/v1.0/myorg/groups/{WORKSPACE_ID}/datasets/{DATASET_ID}/refreshes", json=body)   

```

Con este c�digo hemos creado, en el �rea de trabajo Fabric, un **notebook Python**, y en la canalizaci�n de datos hemos configurado una actividad para que ejecute est� notebook.

En el notebook hemos colocado las variables WORKSPACE\_ID, DATASET\_ID y RETRY\_COUNT en una celda de par�metros, para que sean configurables desde la canalizaci�n de datos, y a esta le hemos agregado una actividad para que env�e un mensaje a Teams si se detecta un error al tratar de actualizar el modelo sem�ntico.

![Canalizaci�n de datos que actualiza un modelo sem�ntico de Power BI](/assets/images/posts/2025-02-03-etl-low-cost-fabric-version2-encender-capacidad/dataXbi-ETL-low-cost-fabric-v2-encender-capacidad-canalizacion-datos.png)

### Ejecuci�n autom�tica de la canalizaci�n de datos

Esto es posible utilizando la [API REST de Fabric para ejecutar tareas](https://learn.microsoft.com/en-us/rest/api/fabric/core/job-scheduler/run-on-demand-item-job?wt.mc_id=MVP_367391).

En el caso de la canalizaci�n de datos, la llamada a la API quedar�a de esta manera:

```
https://api.fabric.microsoft.com/v1/workspaces/{workspace_id}/items/{data_pipeline_id}/jobs/instances?jobType=Pipeline

```

Cuando escrib� la primera versi�n de este blog, esta funcionalidad no admit�a la autenticaci�n con una entidad de servicio, por lo que decid� no utilizarla y en su lugar implementar otro mecanismo para iniciar la canalizaci�n de datos, que inclu�a la creaci�n de un fichero de control. Pero, **esta API ya admite la autenticaci�n con una entidad de servicio, por lo que ahora el proceso ha quedado m�s sencillo**.

### Monitorizaci�n de la actualizaci�n del modelo sem�ntico

Ye hemos logrado echar a andar la canalizaci�n de datos desde el cliente, y ahora necesitamos saber cuando ha terminado la ETL para apagar la capacidad.

Lo que se nos ocurri� fue utilizar la [API REST de Power BI para obtener la historia de actualizaciones de un modelo sem�ntico](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history-in-group?wt.mc_id=MVP_367391) y poder detectar si ha habido una nueva actualizaci�n del modelo sem�ntico en el �rea de trabajo con licencia Pro, luego de que se inici� la canalizaci�n de datos.

Por tanto, la aplicaci�n se mantiene en un bucle donde cada varios minutos obtiene los detalles de la �ltima actualizaci�n hasta que sucede una de dos cosas: se detecta que se ha actualizado el modelo sem�ntico, o se llega a un l�mite de intentos.  
En cualquiera de los dos casos, el pr�ximo paso es apagar la capacidad, luego de esperar un par de minutos.

### Comando fabricetl de pbicmd

Lo que hemos descrito en este post lo hemos implementado en el nuevo comando [**fabricetl** de nuestra herramienta de l�nea de comando **pbicmd**](https://github.com/dataxbi/pbicmd?tab=readme-ov-file#comando-fabricetl).

Para resumir, el comando hace lo siguiente:

- Enciende una capacidad Fabric
- Inicia la ejecuci�n de una canalizaci�n de datos que hace la ETL y actualiza el modelo sem�ntico
- Se queda esperando a que un modelo sem�ntico se actualice
- Apaga la capacidad

Es necesario pasarle varios par�metros para indicarle la capacidad Fabric, las �reas de trabajo y el modelo sem�ntico.  
Todos estos par�metros se explican en la documentaci�n de **pbicmd**.

### Permisos de la entidad de servicio

Para finalizar, quiero comentar sobre la autenticaci�n, ya que se est�n utilizando APIs de Azure, Fabric y Power BI que requieren autenticaci�n. Adem�s, para que la herramienta **pbicmd** se pueda ejecutar de manera autom�tica, es necesario autenticarse con una **entidad de servicio**, la cual se configura en Azure, como explicamos en un [blog anterior](https://www.dataxbi.com/blog/2024/12/30/pbicmd-cli-automatizar-tareas-power-bi/#autenticacion).

En este caso, hay que otorgar permisos adicionales a la entidad de servicio::

- En el portal de Azure, accede a la capacidad Fabric y, en la opci�n de Control de Acceso (IAM), agrega la entidad de servicio con el rol de Colaborador. Esto es necesario para poder encender y apagar la capacidad.
- En las dos �reas de trabajo, tanto en la que tiene capacidad Fabric como en la que tiene licencia Pro, se debe conceder acceso a la entidad de servicio con el rol de Colaborador.
