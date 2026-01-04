---
layout: post
title: "Probando la Scanner API de Power BI"
date: 2021-08-23
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "python"
---

La Scanner API es parte de las APIs de administración del servicio de Power BI y nos permite extraer información de las áreas de trabajo de un inquilino. En esta entrada comparto un script Python que he hecho para probarla.

<!--more-->

La motivación para esta prueba fue el [anuncio](https://powerbi.microsoft.com/es-es/blog/scanner-api-is-now-in-ga/) hecho la semana pasada de la disponibilidad general (GA) de la Scanner API.

Para entender cómo funciona, te recomiendo comenzar por esta página de la documentación: [https://docs.microsoft.com/en-us/power-bi/admin/service-admin-metadata-scanning](https://docs.microsoft.com/en-us/power-bi/admin/service-admin-metadata-scanning)

El script Python completo lo he compartido en GitHub: [https://github.com/dataxbi/powerbi-api-admin-scan](https://github.com/dataxbi/powerbi-api-admin-scan)

### Autenticación

Para acceder a la Scanner API se necesitan permisos de administración en el inquilino de Power BI, y cuando se implemente una herramienta que utilice la API, se recomienda utilizar la autenticación de identidad de servicio, para lo que se requiere el ID de cliente y el secreto de cliente (o contraseña) de una aplicación registrada en Azure Active Directory. De esta forma se tendrá acceso a la API, pero no se tendrá acceso al portal de administración de inquilino de Power BI.

En esta página de la documentación [https://docs.microsoft.com/es-es/power-bi/admin/read-only-apis-service-principal-authentication](https://docs.microsoft.com/es-es/power-bi/admin/read-only-apis-service-principal-authentication) se explican cómo habilitar la autenticación de identidad de servicio, para lo que hay que utilizar el portal de Azure y la administración de inquilinos del servicio de Power BI.

Al terminar la configuración, para poder hacer la autenticación se deben tener estos datos:

- Nombre del inquilino de Power BI
- ID cliente de la aplicación Azure AD
- Secreto de cliente (o contraseña) para la aplicación Azure AD

En el siguiente fragmento de código te muestro de manera simplificada cómo hacer la autenticación y obtener un access token con la [biblioteca MSAL para Python](https://github.com/AzureAD/microsoft-authentication-library-for-python):

![Autenticación de identidad de servicio con MSAL en Python](/assets/images/posts/2021-08-23-probando-scanner-api-power-bi/powerbi-api-admin-scan-python-1.png)

### Utilizando la Scanner API

La Scanner API en realidad consiste en utilizar 4 operaciones de la [API de administración de Power BI](https://docs.microsoft.com/es-es/rest/api/power-bi/admin), que trabajan de forma asincrónica para rastrear las áreas de trabajo en busca de la información.

El flujo de trabajo se describe en la [documentación](https://docs.microsoft.com/en-us/power-bi/admin/service-admin-metadata-scanning#run-metadata-scanning) y sería así:

1. Llamar a la operación [`GetModifiedWorkspaces`](https://docs.microsoft.com/es-es/rest/api/power-bi/admin/workspace-info-get-modified-workspaces) para obtener una lista con los IDs de las áreas de trabajo.
2. Dividir la lista en pedazos de no más de 100 IDs y por cada pedazo hacer una llamada a la operación [`WorkspaceGetInfo`](https://docs.microsoft.com/es-es/rest/api/power-bi/admin/workspace-info-post-workspace-info) para iniciar el barrido de las áreas de trabajo de la lista.
3. Mantenerse encuestando a la operación [`WorkspaceScanStatus`](https://docs.microsoft.com/es-es/rest/api/power-bi/admin/workspace-info-get-scan-status) hasta que indique que se ha obtenido la información de las áreas de trabajo.
4. LLamar a la operación [`WorkspaceScanResult`](https://docs.microsoft.com/es-es/rest/api/power-bi/admin/workspace-info-get-scan-result) para obtener lo información de las áreas de trabajo indicadas en la llamada a WorkspaceGetInfo.

Al llamar a la operación `GetModifiedWorkspaces` se le puede pasar el parámetro `modifiedSince` para que busque sólo en las áreas de trabajo que se han modificado desde una fecha. Y la recomendación es hacer de inicio un barrido completo, guardar la fecha en que se hizo y en la siguiente vez que se utilice la API, pasar el parámetro para hacer un barrido incremental.

La operación `WorkspaceGetInfo` tiene varios parámetros opcionales para ampliar la información que se devuelve de cada área de trabajo:

- `datasetExpressions`
- `datasetSchema`
- `datasourceDetails`
- `getArtifactUsers`
- `lineage`

Tened en cuenta que para que la Scanner API devuelva esta información detallada, hay que activar dos opciones en la administración del inquilino de Power BI, como se explica en la doumentatción: [https://docs.microsoft.com/es-es/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning](https://docs.microsoft.com/es-es/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning)

Además la Scanner API utiliza una caché para guardar la información de los conjuntos de datos y que esta caché sólo se actualiza cuando un conjunto de datos es actualizado o es publicado en el servicio de Power BI. Si la Scanner API no encuentra la información del conjunto de datos en la caché, no la devuelve, aunque se haya indicado que lo haga con alguno de los parámetros `datasetExpressions` o `datasetSchema`.

En el siguiente fragmento de código se muestra la función para llamar a la operación `WorkspaceGetInfo`, usando la [biblioteca Requests](https://docs.python-requests.org/en/master/), donde se puede ver que se le pasan todos los parámetros opcionales para obtener toda la información que sea posible.

![Llamando a la Scanner API de Power BI desde Python](/assets/images/posts/2021-08-23-probando-scanner-api-power-bi/powerbi-api-admin-scan-python-2.png)

Para el resto de las operaciones de la API he creado funciones similares.

A continuación muestro cómo he implementado el flujo para un barrido completo. El barrido parcial no lo he implementado para esta prueba.

![Flujo para hacer escaneo completo con la Scanner API de Power BI](/assets/images/posts/2021-08-23-probando-scanner-api-power-bi/powerbi-api-admin-scan-python-3.png)

### Datos obtenidos

La Scanner API devuelve los datos en formato JSON, y por cada área de trabajo brinda información de los conjuntos de datos, los informes, los cuadros de mandos y los flujos de datos. El script guarda en un fichero este JSON, pero además, crea un fichero JSON separado para cada área de trabajo y crea cinco ficheros CSV.

A continuación enumero las columnas de cada fichero CSV para dar una idea de de toda la información que nos brinda la Scanner API:

- workspaces.csv
    - id
    - name
    - type
    - state
    - isOnDedicatedCapacity
    - users
    - capacityId
    - dataRetrievalState
- reports.csv
    - report.id
    - report.name
    - report.datasetId
    - report.users
    - report.createdDateTime
    - report.modifiedDateTime
    - report.modifiedBy
    - report.appId
    - report.endorsementDetails.endorsement
    - workspace.id
    - workspace.name
- dashboards.csv
    - dashboard.id
    - dashboard.displayName
    - dashboard.isReadOnly
    - dashboard.tiles
    - dashboard.users
    - dashboard.appId
    - workspace.id
    - workspace.name
- datasets.csv
    - dataset.id
    - dataset.name
    - dataset.tables
    - dataset.relationships
    - dataset.configuredBy
    - dataset.targetStorageMode
    - dataset.createdDate
    - dataset.contentProviderType
    - dataset.schemaRetrievalError
    - dataset.users
    - dataset.datasourceUsages
    - dataset.upstreamDataflows
    - dataset.description
    - dataset.endorsementDetails.endorsement
    - dataset.endorsementDetails.certifiedBy
    - workspace.id
    - workspace.name
- dataflows.csv
    - dataflow.objectId
    - dataflow.name
    - dataflow.description
    - dataflow.configuredBy
    - dataflow.modifiedBy
    - dataflow.modifiedDateTime
    - dataflow.datasourceUsages
    - dataflow.users
    - dataflow.endorsementDetails.endorsement
    - dataflow.endorsementDetails.certifiedBy
    - dataflow.upstreamDataflows
    - workspace.id
    - workspace.name

En cada fichero CSV se repiten las columnas del ID y el nombre del área de trabajo, para poder relacionar los ficheros entre sí.

Hay columnas que contienen una lista con más datos, por ejemplo, la columna `users` en todos los ficheros, o las columnas `tables` y `relationships` en el fichero `datasets.csv`

Recordad que el listado de tablas y relaciones de un conjunto de datos sólo se lee de la caché, por lo que si no ha actualizado o publicado el conjunto de datos está información no aparecerá.
