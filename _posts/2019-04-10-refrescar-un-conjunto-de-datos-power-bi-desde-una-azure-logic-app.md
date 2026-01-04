---
layout: post
title: "Refrescar un conjunto de datos Power BI desde una Azure Logic App"
date: 2019-04-10
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "powerbi"
---

En la demostración [Elecciones Generales de abril 2019](https://www.dataxbi.com/elecciones-generales-abril-2019/) utilizamos una página de Wikipedia como fuente de datos y queríamos que no transcurriera mucho tiempo desde que se actualizara está página hasta que lo hiciera el conjunto de datos. Una forma de hacerlo es con una Azure Logic App que utilice la API REST de Power BI.

<!--more-->

### Requisitos

Para seguir las instrucciones es necesario disponer de:

- Licencia Power BI Pro
- Cuenta en Azure en el mismo dominio que la cuenta de Power BI Pro

### Estructura de la Logic App

La Logic App es sencilla y consiste en estos pasos:

1. Se inicia con un _trigger_ HTTP que cada 30 minutos revisa la página de Wikipedia para saber la fecha de última modificación
2. Se averigua si la modificación fue hecha hace menos de 30 minutos
3. Si así fue, se usa la API REST de Power BI para enviar la orden de refrescar el conjunto de datos

![Azure Logic App refrescar conjunto datos Power BI](/assets/images/posts/2019-04-10-refrescar-un-conjunto-de-datos-power-bi-desde-una-azure-logic-app/dataxbi-azure-logic-app-refrescar-conjunto-datos-power-bi.png)

### Conexión a la página web

Para consultar la fecha de modificación de la página, no es necesario descargar todo el contenido de la misma, sino que basta con descargar el encabezado HTTP y revisar el parámetro Last-Modified. Por esa razón, en el _trigger_ HTTP utilizamos el método HEAD.

![Azure Logic App refrescar conjunto datos Power BI trigger HTTP HEAD](/assets/images/posts/2019-04-10-refrescar-un-conjunto-de-datos-power-bi-desde-una-azure-logic-app/dataxbi-azure-logic-app-refrescar-conjunto-datos-power-bi-trigger-HTTP-HEAD.png)

### Conexión a Power BI

Para refrescar el conjunto de datos necesitamos utilizar la API REST de Power BI.

Existe un conector Power BI para Logic Apps, pero aún es muy limitado y solo tiene un _trigger_ para recibir alertas desde Power BI y una acción para enviar datos en tiempo real a un conjunto de datos.

Sin embargo hay disponible una definición [OpenAPI (Swagger)](https://github.com/Microsoft/PowerBI-CSharp/blob/master/sdk/swaggers/swaggerV2.json) de la API REST de Power BI, por lo que es relativamente sencillo crear un conector Power BI.

#### Registrar aplicación

Antes de crear el conector, debemos registrar nuestra aplicación para que pueda utilizar la API REST de Power BI.

1. Ir a la página [https://dev.powerbi.com/apps](https://dev.powerbi.com/apps)
2. Autenticarse con la cuenta de Power BI
3. Ir al siguiente paso y llenar los parámetros:
    - Nombre: El nombre que desee
    - Tipo de aplicación: Server-side web application
    - URL del sitio: URL de tu sitio web o blog o cualquier otro
    - URL de redirección: https://login.live.com/oauth20\_desktop.srf
    - Acceso a la API: Sólo es necesario seleccionar _Read and write all datasets_
4. Pulsar el botón _Register_
5. Copiar el _Client ID_ y el _Client Secret_ que se mostrarán cuando termine el registro

#### Crear el conector

Ya estamos listos para crear el conector.

1. En el portal de Azure adicionamos un nuevo recurso del tipo Logic Apps Custom Connector
2. Nombre del conector: Conector Power BI API
3. En los detalles generales, indicamos que es una API REST, como aparece por defecto, pero en el modo de importar seleccionamos la opción OpenAPI URL, pegamos este enlace: `https://raw.githubusercontent.com/Microsoft/PowerBI-CSharp/master/sdk/swaggers/swaggerV2.json` y pulsamos el botón Importar. El resto de los datos se actualizarán desde el archivo importado.
4. Vamos a la sección **Seguridad** y en el tipo de autenticación escogemos **OAuth 2.0** son los siguientes parámetros:
    - Proveedor de identidad: Azure Active Directory
    - Client ID: El copiado al registrar la aplicación
    - Client secret: El copiado al registrar la aplicación
    - Login URL: https://login.windows.net
    - ID de inquilino: common
    - URL del recurso: https://analysis.windows.net/powerbi/api
    - Alcance: openid
5. En la sección **Definición** puedes revisar que hay más de 100 acciones, que se crearon desde el archivo que importamos. Todas las acciones tienen alertas, pero son pequeños detalles que por ahora podemos ignorar. Para esta aplicación solo nos interesa la acción que refresca un conjunto de datos en un área de trabajo.
6. Pulsa el botón **crear** que está arriba a la derecha
7. Espera unos minutos a que se cree el conector, y vuelve a entrar en la sección **Seguridad** y busca el parámetro _Redirect URL_ que debe estar al final de la sección. Copia el valor de este parámetro, para usarlo a continuación. En mi caso tiene el valor `https://logic-apis-westeurope.consent.azure-apim.net/redirect`, pero en tu caso puede variar.

Ahora debemos actualizar el URL de redirección, copiado en el paso anterior, en la aplicación que hemos registrado en el primer paso.

1. En el portal de Azure, en **Todos los servicios** seleccionamos **Registros de Aplicaciones** y buscamos la aplicación que creamos desde https://dev.powerbi.com/apps
2. Una vez dentro de la aplicación, vamos a **Configuración** y después a **URL de respuesta**, donde agregamos el URL que tenemos copiado y eliminamos el que habíamos escrito al crear la aplicación

Todos los detalles para crear el conector los he tomado de una [excelente entrada de blog de Konstantinos Ioannou](https://medium.com/@Konstantinos_Ioannou/refresh-powerbi-dataset-with-microsoft-flow-73836c727c33).

#### Utilizar el conector

Una vez creado el conector, solo queda utilizarlo dentro de la Logic App y para ello añadimos una acción y buscamos el conector con el nombre **Conector Power BI API** y buscamos la acción con el nombre _Triggers a refresh for the specified dataset from the specified workspace._

Tenga en cuenta que antes de guardar los cambios a la Logic App, tendrá que renombrar la acción para quitarle el punto al final, o al intentar guardar, recibirá un mensaje de error porque los nombre de las acciones no pueden terminar en punto o espacio.

Al adicionar la acción, deberá autenticarse con sus credenciales de Power BI y a continuación podrá llenar el **ID del área de trabajo** y el **ID del conjunto de datos**. Estos IDs los puede ver si entra en el servicio de Power BI, selecciona el área de trabajo y después selecciona el conjunto de datos. En el URL del conjunto de datos verá ambos IDs.

Recomiendo adicionar el parametro **refreshRequest** y entrar el valor  
`{ "notifyOption": "MailOnFailure" }`  
para recibir alertas por correo electrónico si falla el refrescamiento.

![Azure Logic App refrescar conjunto datos Power BI](/assets/images/posts/2019-04-10-refrescar-un-conjunto-de-datos-power-bi-desde-una-azure-logic-app/dataxbi-azure-logic-app-refrescar-conjunto-datos-power-bi-conector.png)

### Conclusión

Podríamos hacer otras Logic Apps similares para refrescar conjuntos de datos Power BI a partir de otras condiciones, aprovechando los _triggers_ disponibles. Tenga en cuenta que para una licencia Power BI Pro no se puede refrescar un conjunto de datos más de 8 veces al día.

El conector creado puede utilizarse para enviar otras acciones de la API REST a Power BI.

Esta aplicación también se podría implementar con Microsoft Flow.
