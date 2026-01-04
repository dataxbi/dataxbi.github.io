---
layout: post
title: "Refrescar un conjunto de datos Power BI desde una Azure Logic App"
date: 2019-04-10
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "powerbi"
---

En la demostraci�n [Elecciones Generales de abril 2019](https://www.dataxbi.com/elecciones-generales-abril-2019/) utilizamos una p�gina de Wikipedia como fuente de datos y quer�amos que no transcurriera mucho tiempo desde que se actualizara est� p�gina hasta que lo hiciera el conjunto de datos. Una forma de hacerlo es con una Azure Logic App que utilice la API REST de Power BI.

<!--more-->

### Requisitos

Para seguir las instrucciones es necesario disponer de:

- Licencia Power BI Pro
- Cuenta en Azure en el mismo dominio que la cuenta de Power BI Pro

### Estructura de la Logic App

La Logic App es sencilla y consiste en estos pasos:

1. Se inicia con un _trigger_ HTTP que cada 30 minutos revisa la p�gina de Wikipedia para saber la fecha de �ltima modificaci�n
2. Se averigua si la modificaci�n fue hecha hace menos de 30 minutos
3. Si as� fue, se usa la API REST de Power BI para enviar la orden de refrescar el conjunto de datos

![Azure Logic App refrescar conjunto datos Power BI](/assets/images/posts/2019-04-10-refrescar-un-conjunto-de-datos-power-bi-desde-una-azure-logic-app/dataxbi-azure-logic-app-refrescar-conjunto-datos-power-bi.png)

### Conexi�n a la p�gina web

Para consultar la fecha de modificaci�n de la p�gina, no es necesario descargar todo el contenido de la misma, sino que basta con descargar el encabezado HTTP y revisar el par�metro Last-Modified. Por esa raz�n, en el _trigger_ HTTP utilizamos el m�todo HEAD.

![Azure Logic App refrescar conjunto datos Power BI trigger HTTP HEAD](/assets/images/posts/2019-04-10-refrescar-un-conjunto-de-datos-power-bi-desde-una-azure-logic-app/dataxbi-azure-logic-app-refrescar-conjunto-datos-power-bi-trigger-HTTP-HEAD.png)

### Conexi�n a Power BI

Para refrescar el conjunto de datos necesitamos utilizar la API REST de Power BI.

Existe un conector Power BI para Logic Apps, pero a�n es muy limitado y solo tiene un _trigger_ para recibir alertas desde Power BI y una acci�n para enviar datos en tiempo real a un conjunto de datos.

Sin embargo hay disponible una definici�n [OpenAPI (Swagger)](https://github.com/Microsoft/PowerBI-CSharp/blob/master/sdk/swaggers/swaggerV2.json) de la API REST de Power BI, por lo que es relativamente sencillo crear un conector Power BI.

#### Registrar aplicaci�n

Antes de crear el conector, debemos registrar nuestra aplicaci�n para que pueda utilizar la API REST de Power BI.

1. Ir a la p�gina [https://dev.powerbi.com/apps](https://dev.powerbi.com/apps)
2. Autenticarse con la cuenta de Power BI
3. Ir al siguiente paso y llenar los par�metros:
    - Nombre: El nombre que desee
    - Tipo de aplicaci�n: Server-side web application
    - URL del sitio: URL de tu sitio web o blog o cualquier otro
    - URL de redirecci�n: https://login.live.com/oauth20\_desktop.srf
    - Acceso a la API: S�lo es necesario seleccionar _Read and write all datasets_
4. Pulsar el bot�n _Register_
5. Copiar el _Client ID_ y el _Client Secret_ que se mostrar�n cuando termine el registro

#### Crear el conector

Ya estamos listos para crear el conector.

1. En el portal de Azure adicionamos un nuevo recurso del tipo Logic Apps Custom Connector
2. Nombre del conector: Conector Power BI API
3. En los detalles generales, indicamos que es una API REST, como aparece por defecto, pero en el modo de importar seleccionamos la opci�n OpenAPI URL, pegamos este enlace: `https://raw.githubusercontent.com/Microsoft/PowerBI-CSharp/master/sdk/swaggers/swaggerV2.json` y pulsamos el bot�n Importar. El resto de los datos se actualizar�n desde el archivo importado.
4. Vamos a la secci�n **Seguridad** y en el tipo de autenticaci�n escogemos **OAuth 2.0** son los siguientes par�metros:
    - Proveedor de identidad: Azure Active Directory
    - Client ID: El copiado al registrar la aplicaci�n
    - Client secret: El copiado al registrar la aplicaci�n
    - Login URL: https://login.windows.net
    - ID de inquilino: common
    - URL del recurso: https://analysis.windows.net/powerbi/api
    - Alcance: openid
5. En la secci�n **Definici�n** puedes revisar que hay m�s de 100 acciones, que se crearon desde el archivo que importamos. Todas las acciones tienen alertas, pero son peque�os detalles que por ahora podemos ignorar. Para esta aplicaci�n solo nos interesa la acci�n que refresca un conjunto de datos en un �rea de trabajo.
6. Pulsa el bot�n **crear** que est� arriba a la derecha
7. Espera unos minutos a que se cree el conector, y vuelve a entrar en la secci�n **Seguridad** y busca el par�metro _Redirect URL_ que debe estar al final de la secci�n. Copia el valor de este par�metro, para usarlo a continuaci�n. En mi caso tiene el valor `https://logic-apis-westeurope.consent.azure-apim.net/redirect`, pero en tu caso puede variar.

Ahora debemos actualizar el URL de redirecci�n, copiado en el paso anterior, en la aplicaci�n que hemos registrado en el primer paso.

1. En el portal de Azure, en **Todos los servicios** seleccionamos **Registros de Aplicaciones** y buscamos la aplicaci�n que creamos desde https://dev.powerbi.com/apps
2. Una vez dentro de la aplicaci�n, vamos a **Configuraci�n** y despu�s a **URL de respuesta**, donde agregamos el URL que tenemos copiado y eliminamos el que hab�amos escrito al crear la aplicaci�n

Todos los detalles para crear el conector los he tomado de una [excelente entrada de blog de Konstantinos Ioannou](https://medium.com/@Konstantinos_Ioannou/refresh-powerbi-dataset-with-microsoft-flow-73836c727c33).

#### Utilizar el conector

Una vez creado el conector, solo queda utilizarlo dentro de la Logic App y para ello a�adimos una acci�n y buscamos el conector con el nombre **Conector Power BI API** y buscamos la acci�n con el nombre _Triggers a refresh for the specified dataset from the specified workspace._

Tenga en cuenta que antes de guardar los cambios a la Logic App, tendr� que renombrar la acci�n para quitarle el punto al final, o al intentar guardar, recibir� un mensaje de error porque los nombre de las acciones no pueden terminar en punto o espacio.

Al adicionar la acci�n, deber� autenticarse con sus credenciales de Power BI y a continuaci�n podr� llenar el **ID del �rea de trabajo** y el **ID del conjunto de datos**. Estos IDs los puede ver si entra en el servicio de Power BI, selecciona el �rea de trabajo y despu�s selecciona el conjunto de datos. En el URL del conjunto de datos ver� ambos IDs.

Recomiendo adicionar el parametro **refreshRequest** y entrar el valor  
`{ "notifyOption": "MailOnFailure" }`  
para recibir alertas por correo electr�nico si falla el refrescamiento.

![Azure Logic App refrescar conjunto datos Power BI](/assets/images/posts/2019-04-10-refrescar-un-conjunto-de-datos-power-bi-desde-una-azure-logic-app/dataxbi-azure-logic-app-refrescar-conjunto-datos-power-bi-conector.png)

### Conclusi�n

Podr�amos hacer otras Logic Apps similares para refrescar conjuntos de datos Power BI a partir de otras condiciones, aprovechando los _triggers_ disponibles. Tenga en cuenta que para una licencia Power BI Pro no se puede refrescar un conjunto de datos m�s de 8 veces al d�a.

El conector creado puede utilizarse para enviar otras acciones de la API REST a Power BI.

Esta aplicaci�n tambi�n se podr�a implementar con Microsoft Flow.
