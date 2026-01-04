---
layout: post
title: "ETL low cost con Fabric versión 2 - Encender la capacidad"
date: 2025-02-03
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "etl-low-cost-fabric"
  - "fabric"
---

**Actuallizado el 19 de marzo de 2025**: He actualizado este blog debido a que ya es posible utilizar la API REST de Fabric para ejecutar una canalización de datos con una entidad de servicio. También he actualizado la herramienta **pbicmd**.

Siguiendo con la nueva versión de nuestra serie sobre ETL "low cost" con Fabric, esta vez proponemos una técnica más completa para controlar la capacidad Fabric desde un servidor "on premise", con el objetivo de minimizar el tiempo que la capacidad permanece encendida pero sin hacer nada.

<!--more-->

Recordamos que en [esta serie](https://www.dataxbi.com/blog/2025/01/07/etl-low-cost-fabric-version2-arquitectura/) estamos trabajando con dos áreas de trabajo: una con **capacidad Fabric** que sólo se enciende para hacer la ETL, y otra con **licencia Pro** con un modelo semántico de Power BI en modo de almacenamiento importar.

En esta entrada explicamos como hemos implementado un mecanismo que nos permite hacer lo siguiente desde un servidor "on premise":

- Encender la capacidad Fabric
- Inciar una canalización de datos que orquesta toda la ETL y actualiza el modelo semántico
- Monitorizar la actualización del modelo semántico de Power BI
- Apagar la capacidad Fabric

Este mecanismos lo hemos implementado en nuestra herramienta de línea de comando **[pbicmd](https://github.com/dataxbi/pbicmd)** para que se pueda programar su **ejecución automática**.

![Diagrama que muestra un área de trabajo Fabric, otro área de trabajo con licencia Pro o PPU y un servidor on premise que enciende y apaga la capacidad Fabric.](/assets/images/posts/2025-02-03-etl-low-cost-fabric-version2-encender-capacidad/dataXbi-ETL-low-cost-fabric-v2-encender-capacidad.png)

### Preparativos

Para probar este mecanismo, hemos creado un modelo semántico muy sencillo que consiste en una sola tabla con los [viajes de los taxis de Nueva York](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) en un mes.

Dichos datos ya están cargados en una tabla en un Lakehouse en el área de trabajo con capacidad Fabric.

Por otra parte, hemos creado un informe con Power BI Desktop que importa los datos de la tabla de taxis utilizando el punto de conexión SQL del Lakehouse, y hemos publicado dicho informe en el área de trabajo con licencia Pro.

Volviendo al área de trabajo con capacidad Fabric, hemos creado una **canalización de datos** que actualiza los datos del modelo semántico de Power BI que está en el área de trabajo con licencia Pro. En un caso real, esta canalización es la que orquestaría toda la ETL, antes de actualizar el modelo semántico, pero para esta demostración la hemos querido mantener lo más sencilla posible.

### Encendido y apagado de la capacidad Fabric

En la [versión anterior de esta serie](https://www.dataxbi.com/blog/2024/02/22/poc-etl-low-cost-fabric-capacidad/#pausar_capacidad) ya comentamos varias opciones para encender y apagar la capacidad.

En este caso nos interesa poderlo hacer desde la línea de comandos de un servidor "on premise", por lo que vamos a utilizar nuestra herramienta [pbicmd](https://github.com/dataxbi/pbicmd?tab=readme-ov-file#comando-fabric).

En dicha herramienta ya tenemos un comando que nos permite encender y apagar la capacidad. Pero el mecanismo que vamos a describir aquí lo hemos incorporado como un nuevo comando.

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

  

### Actualización del modelo semántico de Power BI

Al crear la canalización de datos nos encontramos con un problema, porque aunque existe una actividad para [actualizar un modelo semántico](https://learn.microsoft.com/es-es/fabric/data-factory/semantic-model-refresh-activity?wt.mc_id=MVP_367391), no funciona con modelos semánticos que estén en áreas de trabajo con licencia Pro.

Afortunadamente, podemos implementar la actualización del modelo semántico con [la API REST de Power BI](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/refresh-dataset-in-group?wt.mc_id=MVP_367391). Y para más fortuna, existe la librería [Semantic Link](https://learn.microsoft.com/es-es/fabric/data-science/semantic-link-overview?wt.mc_id=MVP_367391) con la que es muy fácil hacerlo.

Por cierto, Semantic Link tiene la función [refresh\_dataset](https://learn.microsoft.com/en-us/python/api/semantic-link-sempy/sempy.fabric?view=semantic-link-python#sempy-fabric-refresh-dataset?wt.mc_id=MVP_367391) para actualizar un modelo semántico, pero le sucede lo mismo que a la actividad de la canalización de datos, que no funciona con modelos semánticos en áreas de trabajo con licencia Pro.

Pero gracias a una charla de [Rafael Báguena](https://www.linkedin.com/in/rafaelbaguena/) conocimos que Semantic Link cuenta con la clase [PowerBIRestClient](https://learn.microsoft.com/en-us/python/api/semantic-link-sempy/sempy.fabric.powerbirestclient?view=semantic-link-python?wt.mc_id=MVP_367391), con la que la actualización de un modelo semántico en un área de trabajo Pro se puede implementar con este código Python:

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

Con este código hemos creado, en el área de trabajo Fabric, un **notebook Python**, y en la canalización de datos hemos configurado una actividad para que ejecute está notebook.

En el notebook hemos colocado las variables WORKSPACE\_ID, DATASET\_ID y RETRY\_COUNT en una celda de parámetros, para que sean configurables desde la canalización de datos, y a esta le hemos agregado una actividad para que envíe un mensaje a Teams si se detecta un error al tratar de actualizar el modelo semántico.

![Canalización de datos que actualiza un modelo semántico de Power BI](/assets/images/posts/2025-02-03-etl-low-cost-fabric-version2-encender-capacidad/dataXbi-ETL-low-cost-fabric-v2-encender-capacidad-canalizacion-datos.png)

### Ejecución automática de la canalización de datos

Esto es posible utilizando la [API REST de Fabric para ejecutar tareas](https://learn.microsoft.com/en-us/rest/api/fabric/core/job-scheduler/run-on-demand-item-job?wt.mc_id=MVP_367391).

En el caso de la canalización de datos, la llamada a la API quedaría de esta manera:

```
https://api.fabric.microsoft.com/v1/workspaces/{workspace_id}/items/{data_pipeline_id}/jobs/instances?jobType=Pipeline

```

Cuando escribí la primera versión de este blog, esta funcionalidad no admitía la autenticación con una entidad de servicio, por lo que decidí no utilizarla y en su lugar implementar otro mecanismo para iniciar la canalización de datos, que incluía la creación de un fichero de control. Pero, **esta API ya admite la autenticación con una entidad de servicio, por lo que ahora el proceso ha quedado más sencillo**.

### Monitorización de la actualización del modelo semántico

Ye hemos logrado echar a andar la canalización de datos desde el cliente, y ahora necesitamos saber cuando ha terminado la ETL para apagar la capacidad.

Lo que se nos ocurrió fue utilizar la [API REST de Power BI para obtener la historia de actualizaciones de un modelo semántico](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history-in-group?wt.mc_id=MVP_367391) y poder detectar si ha habido una nueva actualización del modelo semántico en el área de trabajo con licencia Pro, luego de que se inició la canalización de datos.

Por tanto, la aplicación se mantiene en un bucle donde cada varios minutos obtiene los detalles de la última actualización hasta que sucede una de dos cosas: se detecta que se ha actualizado el modelo semántico, o se llega a un límite de intentos.  
En cualquiera de los dos casos, el próximo paso es apagar la capacidad, luego de esperar un par de minutos.

### Comando fabricetl de pbicmd

Lo que hemos descrito en este post lo hemos implementado en el nuevo comando [**fabricetl** de nuestra herramienta de línea de comando **pbicmd**](https://github.com/dataxbi/pbicmd?tab=readme-ov-file#comando-fabricetl).

Para resumir, el comando hace lo siguiente:

- Enciende una capacidad Fabric
- Inicia la ejecución de una canalización de datos que hace la ETL y actualiza el modelo semántico
- Se queda esperando a que un modelo semántico se actualice
- Apaga la capacidad

Es necesario pasarle varios parámetros para indicarle la capacidad Fabric, las áreas de trabajo y el modelo semántico.  
Todos estos parámetros se explican en la documentación de **pbicmd**.

### Permisos de la entidad de servicio

Para finalizar, quiero comentar sobre la autenticación, ya que se están utilizando APIs de Azure, Fabric y Power BI que requieren autenticación. Además, para que la herramienta **pbicmd** se pueda ejecutar de manera automática, es necesario autenticarse con una **entidad de servicio**, la cual se configura en Azure, como explicamos en un [blog anterior](https://www.dataxbi.com/blog/2024/12/30/pbicmd-cli-automatizar-tareas-power-bi/#autenticacion).

En este caso, hay que otorgar permisos adicionales a la entidad de servicio::

- En el portal de Azure, accede a la capacidad Fabric y, en la opción de Control de Acceso (IAM), agrega la entidad de servicio con el rol de Colaborador. Esto es necesario para poder encender y apagar la capacidad.
- En las dos áreas de trabajo, tanto en la que tiene capacidad Fabric como en la que tiene licencia Pro, se debe conceder acceso a la entidad de servicio con el rol de Colaborador.
