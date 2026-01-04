---
layout: post
title: "Probando la Scanner API de Power BI"
date: 2021-08-23
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "python"
---

La Scanner API es parte de las APIs de administraci�n del servicio de Power BI y nos permite extraer informaci�n de las �reas de trabajo de un inquilino. En esta entrada comparto un script Python que he hecho para probarla.

<!--more-->

La motivaci�n para esta prueba fue el [anuncio](https://powerbi.microsoft.com/es-es/blog/scanner-api-is-now-in-ga/) hecho la semana pasada de la disponibilidad general (GA) de la Scanner API.

Para entender c�mo funciona, te recomiendo comenzar por esta p�gina de la documentaci�n: [https://docs.microsoft.com/en-us/power-bi/admin/service-admin-metadata-scanning](https://docs.microsoft.com/en-us/power-bi/admin/service-admin-metadata-scanning)

El script Python completo lo he compartido en GitHub: [https://github.com/dataxbi/powerbi-api-admin-scan](https://github.com/dataxbi/powerbi-api-admin-scan)

### Autenticaci�n

Para acceder a la Scanner API se necesitan permisos de administraci�n en el inquilino de Power BI, y cuando se implemente una herramienta que utilice la API, se recomienda utilizar la autenticaci�n de identidad de servicio, para lo que se requiere el ID de cliente y el secreto de cliente (o contrase�a) de una aplicaci�n registrada en Azure Active Directory. De esta forma se tendr� acceso a la API, pero no se tendr� acceso al portal de administraci�n de inquilino de Power BI.

En esta p�gina de la documentaci�n [https://docs.microsoft.com/es-es/power-bi/admin/read-only-apis-service-principal-authentication](https://docs.microsoft.com/es-es/power-bi/admin/read-only-apis-service-principal-authentication) se explican c�mo habilitar la autenticaci�n de identidad de servicio, para lo que hay que utilizar el portal de Azure y la administraci�n de inquilinos del servicio de Power BI.

Al terminar la configuraci�n, para poder hacer la autenticaci�n se deben tener estos datos:

- Nombre del inquilino de Power BI
- ID cliente de la aplicaci�n Azure AD
- Secreto de cliente (o contrase�a) para la aplicaci�n Azure AD

En el siguiente fragmento de c�digo te muestro de manera simplificada c�mo hacer la autenticaci�n y obtener un access token con la [biblioteca MSAL para Python](https://github.com/AzureAD/microsoft-authentication-library-for-python):

![Autenticaci�n de identidad de servicio con MSAL en Python](/assets/images/posts/2021-08-23-probando-scanner-api-power-bi/powerbi-api-admin-scan-python-1.png)

### Utilizando la Scanner API

La Scanner API en realidad consiste en utilizar 4 operaciones de la [API de administraci�n de Power BI](https://docs.microsoft.com/es-es/rest/api/power-bi/admin), que trabajan de forma asincr�nica para rastrear las �reas de trabajo en busca de la informaci�n.

El flujo de trabajo se describe en la [documentaci�n](https://docs.microsoft.com/en-us/power-bi/admin/service-admin-metadata-scanning#run-metadata-scanning) y ser�a as�:

1. Llamar a la operaci�n [`GetModifiedWorkspaces`](https://docs.microsoft.com/es-es/rest/api/power-bi/admin/workspace-info-get-modified-workspaces) para obtener una lista con los IDs de las �reas de trabajo.
2. Dividir la lista en pedazos de no m�s de 100 IDs y por cada pedazo hacer una llamada a la operaci�n [`WorkspaceGetInfo`](https://docs.microsoft.com/es-es/rest/api/power-bi/admin/workspace-info-post-workspace-info) para iniciar el barrido de las �reas de trabajo de la lista.
3. Mantenerse encuestando a la operaci�n [`WorkspaceScanStatus`](https://docs.microsoft.com/es-es/rest/api/power-bi/admin/workspace-info-get-scan-status) hasta que indique que se ha obtenido la informaci�n de las �reas de trabajo.
4. LLamar a la operaci�n [`WorkspaceScanResult`](https://docs.microsoft.com/es-es/rest/api/power-bi/admin/workspace-info-get-scan-result) para obtener lo informaci�n de las �reas de trabajo indicadas en la llamada a WorkspaceGetInfo.

Al llamar a la operaci�n `GetModifiedWorkspaces` se le puede pasar el par�metro `modifiedSince` para que busque s�lo en las �reas de trabajo que se han modificado desde una fecha. Y la recomendaci�n es hacer de inicio un barrido completo, guardar la fecha en que se hizo y en la siguiente vez que se utilice la API, pasar el par�metro para hacer un barrido incremental.

La operaci�n `WorkspaceGetInfo` tiene varios par�metros opcionales para ampliar la informaci�n que se devuelve de cada �rea de trabajo:

- `datasetExpressions`
- `datasetSchema`
- `datasourceDetails`
- `getArtifactUsers`
- `lineage`

Tened en cuenta que para que la Scanner API devuelva esta informaci�n detallada, hay que activar dos opciones en la administraci�n del inquilino de Power BI, como se explica en la doumentatci�n: [https://docs.microsoft.com/es-es/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning](https://docs.microsoft.com/es-es/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning)

Adem�s la Scanner API utiliza una cach� para guardar la informaci�n de los conjuntos de datos y que esta cach� s�lo se actualiza cuando un conjunto de datos es actualizado o es publicado en el servicio de Power BI. Si la Scanner API no encuentra la informaci�n del conjunto de datos en la cach�, no la devuelve, aunque se haya indicado que lo haga con alguno de los par�metros `datasetExpressions` o `datasetSchema`.

En el siguiente fragmento de c�digo se muestra la funci�n para llamar a la operaci�n `WorkspaceGetInfo`, usando la [biblioteca Requests](https://docs.python-requests.org/en/master/), donde se puede ver que se le pasan todos los par�metros opcionales para obtener toda la informaci�n que sea posible.

![Llamando a la Scanner API de Power BI desde Python](/assets/images/posts/2021-08-23-probando-scanner-api-power-bi/powerbi-api-admin-scan-python-2.png)

Para el resto de las operaciones de la API he creado funciones similares.

A continuaci�n muestro c�mo he implementado el flujo para un barrido completo. El barrido parcial no lo he implementado para esta prueba.

![Flujo para hacer escaneo completo con la Scanner API de Power BI](/assets/images/posts/2021-08-23-probando-scanner-api-power-bi/powerbi-api-admin-scan-python-3.png)

### Datos obtenidos

La Scanner API devuelve los datos en formato JSON, y por cada �rea de trabajo brinda informaci�n de los conjuntos de datos, los informes, los cuadros de mandos y los flujos de datos. El script guarda en un fichero este JSON, pero adem�s, crea un fichero JSON separado para cada �rea de trabajo y crea cinco ficheros CSV.

A continuaci�n enumero las columnas de cada fichero CSV para dar una idea de de toda la informaci�n que nos brinda la Scanner API:

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

En cada fichero CSV se repiten las columnas del ID y el nombre del �rea de trabajo, para poder relacionar los ficheros entre s�.

Hay columnas que contienen una lista con m�s datos, por ejemplo, la columna `users` en todos los ficheros, o las columnas `tables` y `relationships` en el fichero `datasets.csv`

Recordad que el listado de tablas y relaciones de un conjunto de datos s�lo se lee de la cach�, por lo que si no ha actualizado o publicado el conjunto de datos est� informaci�n no aparecer�.
