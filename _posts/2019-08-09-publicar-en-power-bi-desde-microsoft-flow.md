---
layout: post
title: "Publicar en Power BI desde Microsoft Flow"
date: 2019-08-09
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
---

En esta entrada mostramos como publicar en Power BI desde Microsoft Flow un conjunto de datos hacia los ambientes de prueba o de producción.

<!--more-->

Al desarrollar un proyecto es una buena práctica tener un ambiente de desarrollo, separado de producción y, según la envergadura del proyecto, otros ambientes para pruebas. En Power BI podemos crear Areas de Trabajo para cada ambiente y usar [parámetros de consulta](https://www.dataxbi.com/blog/2019/07/11/parametros-de-consulta/) para definir la configuración de cada ambiente.

### Escenario

Por ejemplo, podríamos tener un escenario como este:

- El archivo PBIX está en una carpeta de OneDrive, con lo que tenemos la historia de los cambios.
- Utiliza como fuente de datos un archivo Excel y tiene dos parámetros de consulta, _Data Folder_ y _Data Filename_, para indicar la ubicación del archivo Excel.
- Tenemos una copia del archivo Excel en el ordenador donde desarrollamos con Power BI Desktop.
- El archivo Excel de producción está en un servidor que tiene instalado la puerta de enlace de datos de Power BI, y donde está configurada la ruta de acceso al archivo Excel.

Como la ubicación del archivo Excel es distinta en el entorno local y en el entorno de producción, cada vez que se publique en el servicio Power BI, hay que cambiar manualmente los valores de los parámetros.

Para automatizar la tarea vamos a crear un flujo con Microsoft Flow que hará lo siguiente:

- Obtendrá el archivo PBIX desde OneDrive y lo importará en el servicio Power BI

- Modificará los parámetros a los valores requeridos en producción

- Refrescará el conjunto de datos

### Conector Power BI REST API

Utilizaremos la [API REST de Power BI](https://docs.microsoft.com/es-es/rest/api/power-bi/), para lo cual tendremos que crear un conector personalizado en Flow, porque aunque ya [existe uno](https://emea.flow.microsoft.com/es-es/connectors/shared_powerbi/power-bi/), es muy limitado.

Llamaremos a las siguientes operaciones de la API REST de Power BI:

- [Post Import In Group](https://docs.microsoft.com/es-es/rest/api/power-bi/imports/postimportingroup)

- [Get Import In Group](https://docs.microsoft.com/es-es/rest/api/power-bi/imports/getimportingroup)

- [Update Parameters In Group](https://docs.microsoft.com/rest/api/power-bi/datasets/updateparametersingroup)

- [Refresh Dataset In Group](https://docs.microsoft.com/rest/api/power-bi/datasets/refreshdatasetingroup)

Sobre cómo crear un conector personalizado ya hablamos en [una entrada anterior](https://www.dataxbi.com/blog/2019/04/10/refrescar-un-conjunto-de-datos-power-bi-desde-una-azure-logic-app/). Y hay más información en otros blogs, como [este de Konstantinos Ioannou](https://medium.com/@Konstantinos_Ioannou/refresh-powerbi-dataset-with-microsoft-flow-73836c727c33), con todos los detalles de la configuración de seguridad, y [este de Chris Webb](https://blog.crossjoin.co.uk/2018/10/19/calling-the-power-bi-rest-api-from-microsoft-flow-part-1-creating-a-flow-custom-connector/), que explica cómo utilizar un archivo [Open API](https://github.com/Microsoft/PowerBI-CSharp/blob/master/sdk/swaggers/swaggerV2.json).

Sin embargo, si utilizamos directamente este archivo para crear el conector, veremos que todas las acciones y referencias tienen errores de validación. La causa de los errores es que en el archivo Open API no se asignó el tipo _object_ a ninguna de las definiciones. Nosotros lo hemos modificado y hemos compartido el [nuevo archivo en GitHub](https://github.com/dataxbi/powerbi-api-swagger/blob/master/swaggerV2.json).

También hicimos otra modificación, en la operación _Imports\_PostImportInGroup_ adicionamos un parámetro para poder adjuntar un archivo PBIX.

Esta es la definición JSON del parámetro:

```

{
     "name": "pbixFile",
     "in": "formData",
     "description": "PBIX to upload",
     "required": false,
     "type": "file"
  }
```

Con estos cambios, nuestro archivo está listo para crear el connector personalizado. Los pasos los pueden consultar en los blogs que hemos mencionado antes, por lo cual no los vamos a repetir. Sólo agregar que le pondremos el nombre _Power BI REST API_.

### Inicio del flujo

Una vez hayamos creado el conector, podemos comenzar con el flujo y para ello creamos uno usando la opción _Instantáneo: desde cero_, le ponemos el nombre _Power BI Publish_ y seleccionamos que el flujo se desencadenará desde Microsoft Flow.

![creación del flujo para publicar en Power BI desde Microsoft Flow](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-01.jpg)

Ya dentro del flujo, lo primero que haremos es inicializar algunas variables.

- _Ruta OneDrive del PIBX_, de tipo cadena, con la ubicación del archivo PBIX que queremos publicar.

- _ID del Ãrea de Trabajo_, de tipo cadena, para indicar dónde queremos publicar. Para obtener este ID, podemos ir al sitio de Power BI, entrar al área de trabajo, y mirar en el URL  
    ![ID del área de trabajo en Power BI](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-02.jpg)
    

- _Parámetros Conjunto Datos_, de tipo matriz, que incializaremos con un objeto JSON con los valores de los parámetros en el ambiente de producción.
    
    ```
    
    [
      {
        "name": "Data Folder",
        "newValue": "C:\\data\\powerbi"
      },
      {
        "name": "Data Filename",
        "newValue": "DataProduction.xlsx"
      }
    ]
    ```
    

- _Omitir Informe_, de tipo booleano, para indicar si queremos publicar el informe contenido en el PBIX, o sí sólo queremos publicar el conjunto de datos.

![Variables del flujo](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-03.jpg)

Los dos siguientes pasos del flujo consisten en obtener el archivo PBIX desde OneDrive y para ello buscamos el conector de _OneDrive para la Empresa_ y las acciones _Obtener contenido de archivo mediante ruta de acceso_ y _Obtener metadatos de archivo mediante ruta de acceso_. Adicionamos estos dos pasos al flujo, nos autenticamos en OndeDrive si es necesario, y en ambos casos le asignamos al parámetro _Ruta de archivo_ la variable _Ruta OneDrive del PBIX_.

![Obteniendo contenido y metadata del archivo PBIX desde OndeDrive](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-04.jpg)

### Importar el archivo PBIX en Power BI

Ya estamos listos para importar el archivo PBIX y lo haremos adicionando un nuevo paso. Buscamos el conector _Power BI REST API_, lo escogemos, buscamos la acción con el nombre _Creates new content on the specified workspace from .pbix, .json, Excel, Rdl, or file path in OneDrive for Business_, y configuramos los parámetros como se muestra en la siguiente imagen.

![Paso para importar archivo PBIX](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-05.jpg)

Los parámetros _filePath_ y _connectionType_ sólo son necesarios si se quiere publicar un archivo Excel que esté almacenado en OneDrive, y el parámetro _fileUrl_ es para cuando se va a publicar un PBIX con tamaño mayor de 1 GB desde un blob de Azure. Estos tres parámetros los dejaremos en blanco.

Los parámetros _pbixFile_ y _pbixFile (nombre de archivo)_ aparecen debido al parámetro de tipo _file_ que adicionamos en el archivo Open API, y son estos parámetros los que nos permitirán publicar el archivo PBIX que hemos obtenido desde OneDrive.

Antes de guardar el flujo, se debe re-nombrar este paso, porque el nombre sugerido es muy largo.

#### Evitar error 403

Esta acción de la API de Power BI reporta de forma inmediata que ha comenzado la importación del archivo, y devuelve el ID del proceso de importación. Luego se puede llamar a otra acción de la API para saber el estado de la importación, y eso es lo que vamos a hacer en los próximos pasos. Pero antes queremos hacer una observación.

Si guardamos el flujo y lo ejecutamos, es muy probable que ocurra un error en el último paso y obtengamos el código de estado 403. Pero si vamos al sitio de Power BI veremos que el conjunto de datos sí se creó o se actualizó. Para evitar este error, debemos ir a la configuración del paso y desactivar el modelo asincrónico. La causa del error es que la API de Power BI no envía la información necesaria para que Flow pueda sondear la terminación de la operación asincrónica.

![Desactivación del modelo asincrónico](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-06.jpg)

#### Bucle

En los próximos pasos haremos un bucle esperando que termine la importación y guardaremos en una variable el ID de conjunto de datos que nos devuelvan, que lo necesitaremos para los dos últimos pasos.

![Bucle para consultar el estado de la importación del archivo PBIX](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-07.jpg)

Para chequear el estado de la importación creamos un paso donde volvemos a utilizar el conector _Power BI REST API_ y la acción con el nombre _Returns the specified import from the specified workspace_, y le pasamos como parámetros la variable _ID Area de Trabajo_ y el ID de la importación que recibimos como respuesta en el paso anterior.

Este paso lo insertamos en un bucle _Repetir hasta_, que termina cuando el estado de la importación sea _"Succeeded"_.

Dentro del bucle, y después de chequear el estado, tenemos un paso de control para preguntar si ya está disponible el ID del conjunto de datos importado y asignárselo a una variable.

### Actualizar parámetros y refrescar

El próximo paso después del bucle es para actualizar los parámetros del conjunto de datos, y para ello volvemos a utilizar el connector _Power BI API REST_, esta vez con la acción _Updates the parameters values for the specified dataset from the specified workspace_. Le indicamos el área de trabajo usando la variable que definimos al principio. El ID del conjunto de datos lo obtenemos de la variable que llenamos dentro del bucle. Y al parámetro _updateDetails_ le asignamos el JSON que definimos en la variable _Parámetros Conjunto Datos_.

![Paso para actualizar parámetros de consulta](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-08.jpg)

Y llegamos al último paso donde empleamos la acción _Triggers a refresh for the specified dataset from the specified workspace_, para indicarle a Power BI que refresque el conjunto de datos, y que de esta manera se actualicen los datos desde el archivo Excel indicado en los parámetros que modificamos en el paso anterior.

![Paso para refrescar el conjunto de datos](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-09.jpg)

### Ejecución

Bueno, ya el flujo está listo, podemos guardarlo y ejecutarlo.

![Ejecución del flujo](/assets/images/posts/2019-08-09-publicar-en-power-bi-desde-microsoft-flow/blog-publicar-power-bi-flow-10.jpg)

La imagen muestra el resultado de una ejecución, donde se puede ver que el bucle se repitió 5 veces antes de que se comprobara que la importación había terminado.

### Conclusiones

Hemos construido un flujo que puede emplearse para automatizar la publicación de los conjuntos de datos Power BI hacia el ambiente de pruebas o de producción. Este flujo se podría adaptar para llamarlo desde una PowerApp que le pase los parámetros para cambiar el área de trabajo, la ubicación del PBIX y los parámetros de consulta, y así podríamos manejar la publicación de varios proyectos hacia varios ambientes.
