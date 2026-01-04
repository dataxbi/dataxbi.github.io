---
layout: post
title: "pbicmd - CLI para automatizar tareas de Power BI"
date: 2024-12-30
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "python"
---

**pbicmd** es una pequeña herramienta de línea de comandos (CLI) para automatizar algunas tareas de Power BI. Está hecha con Python y es de código abierto. También se distribuye como un ejecutable EXE de Windows para que se pueda utilizar sin tener que instalar Python.

En este post quiero comentar los motivos que tuve para hacerla, resumir lo que puedes hacer con los comandos disponibles, explicar cómo funciona la autenticación y describir como está organizado el código y las librerías que utilizo.

<!--more-->

### Motivos para hacer pbicmd

Hay dos motivos por los que me decidí ha implementar esta herramienta:

1. Tener en un sólo lugar distintas cosas que he ido probando sobre la utilización de Python con Power BI
2. Disponer de una herramienta para incorporar a nuestra propuesta de ETL "low cost" con Fabric

**Sobre el primer punto**, más o menos desde el año 2020 he estado utilizando Python para trabajar con las APIs de Power BI. En muchas ocasiones lo he hecho por curiosidad, para investigar, y también a veces he implementado pequeñas herramientas ya sea para utilizarlas internamente durante el desarrollo de algún proyecto, o para entregarla al cliente como parte del proyecto.

Algunas de estas pruebas las he publicado en nuestro blog: [https://www.dataxbi.com/blog/tag/python/](https://www.dataxbi.com/blog/tag/python/)

**Sobre el segundo punto**, desde el inicio de este año 2024 hemos estado promoviendo el uso de lo que hemos llamado ETL "low cost" con Fabric, y nos interesaba contar con una herramienta para automatizar el "encendido" y el "apagado" de una capacidad Fabric y que se pudiera ejecutar desde el ordenador del cliente donde está instalada la puerta de enlace.

Puedes leer en nuestro blog la serie sobre ETL "low cost" con Fabric: [https://www.dataxbi.com/blog/tag/etl-low-cost-fabric](https://www.dataxbi.com/blog/tag/etl-low-cost-fabric)

### Descargar pbicmd

El repositorio de `pbicmd` en GitHub es este: [https://github.com/dataxbi/pbicmd](https://github.com/dataxbi/pbicmd)

Si trabajas en Windows, para utilizar `pbicmd` no es necesario instalar nada, basta con descargar el fichero ZIP con la última versión desde:  
[https://github.com/dataxbi/pbicmd/releases](https://github.com/dataxbi/pbicmd/releases)  
y expandirlo para obtener el ejecutable `pbicmd.exe` que es lo único que contiene el ZIP.  
  
Luego abrimos una línea de comando en Windows, por ejemplo, con la aplicación Terminal, y nos cambiamos a la carpeta donde tengamos `pbicmd.exe`.

### Comandos

En la imagen siguiente se muestran los comandos disponibles en **pbicmd**, que son menos de los que quisiera y un poco eclécticos ðŸ˜‰, pero que se pueden dividir en 3 categorías:

1. Comandos que ejecutan consultas DAX en un modelo semántico

3. Comandos que permiten automatizar algunas tareas de Microsoft Fabric

5. Comandos que convierten ficheros CSV o JSON a los formatos Parquet o Delta

![Pantallazo de la ayuda general de pbicmd donde se ven los comandos disponibles en pbicmd](/assets/images/posts/2024-12-30-pbicmd-cli-automatizar-tareas-power-bi/pbicmd-v0.8.0-help.png)

Cada comando tiene varias opciones que están documentadas en el [repositorio de GitHub](https://github.com/dataxbi/pbicmd), pero a continuación te hago un resumen de cada uno, con ejemplos de uso.

#### Comando `dax`

Ejecuta una consulta DAX sobre un modelo semántico publicado en el servicio de Power BI y guarda el resultado en un fichero CSV o Parquet. Funciona con una licencia Pro.

**Ejemplo 1**: Ejecuta la consulta DAX guardada en el fichero `consulta.dax` contra el modelo semántico con el ID `dddddddd-dddd-dddd-dddd-dddddddddddd` y guarda el resultado en un fichero CSV.

```
./pbicmd.exe dax consulta.dax -d dddddddd-dddd-dddd-dddd-dddddddddddd -o c:/datos/resultado_consulta.csv

```

**Ejemplo 2**: Ejecuta la consulta DAX guardada en el fichero `consulta.dax` contra el modelo semántico con el ID `dddddddd-dddd-dddd-dddd-dddddddddddd` y guarda el resultado en un fichero Parquet.

```
./pbicmd.exe dax consulta.dax -d dddddddd-dddd-dddd-dddd-dddddddddddd -o c:/datos/resultado_consulta.parquet -f parquet

```

  
  

#### Comando `daxdif`

Compara la ejecución de una misma consulta DAX sobre dos modelos semánticos publicados en el servicio de Power BI y guarda las diferencias en un fichero CSV. Para hacer la comparación de valores numéricos, redondea a 4 lugares decimales y utiliza un valor de tolerancia de 0.01. Tanto el redondeo como la tolerancia se pueden cambiar utilizando parámetros.

**Ejemplo:** Ejecuta la consulta DAX guardada en el fichero `consulta.dax` contra los modelos semánticos con los IDs `dddddddd-dddd-dddd-dddd-dddddddddddd` y `eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee` y guarda el resultado de la comparación en el fichero `c:/datos/resultado_comparacion.csv`.

```
./pbicmd.exe daxdif consulta.dax -d1 dddddddd-dddd-dddd-dddd-dddddddddddd -d2 eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee -od c:/datos/resultado_comparacion.csv

```

  
  

#### Comando `semdoc`

Genera páginas HTML con la documentación de un modelo semántico que está publicado en el servicio de Power BI.

Para implementar este comando he utilizado las funciones INFO de DAX, y creo que merece un blog aparte.

**Ejemplo:** Genera la documentación del modelo semántico con el ID `dddddddd-dddd-dddd-dddd-dddddddddddd` y la guarda en la carpeta `c:\doc\modelo1`

```
./pbicmd.exe semdoc dddddddd-dddd-dddd-dddd-dddddddddddd -o c:\doc\modelo1

```

  
  

#### Comando `fabric`

Tiene varios subcomandos para manejar las capacidades de Microsoft Fabric.

**Ejemplo 1:** Obtiene un listado de las capacidades Fabric en la subscripción de Azure con el ID `ssssssss-ssss-ssss-ssss-ssssssssssss`.

```
./pbicmd.exe fabric capacities -as ssssssss-ssss-ssss-ssss-ssssssssssss

```

**Ejemplo 2:** "Enciende" la capacidad Fabric que tiene el ID `/subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/resourceGroups/fabric-etl/providers/Microsoft.Fabric/capacities/fabricetl`.

```
./pbicmd.exe fabric resume -c /subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/resourceGroups/fabric-etl/providers/Microsoft.Fabric/capacities/fabricetl 

```

**Ejemplo 3:** "Apaga" la capacidad Fabric con el ID `/subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/resourceGroups/fabric-etl/providers/Microsoft.Fabric/capacities/fabricetl`.

```
./pbicmd.exe fabric suspend -c /subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/resourceGroups/fabric-etl/providers/Microsoft.Fabric/capacities/fabricetl 

```

**Ejemplo 4:** Cambia a F4 el SKU de la capacidad Fabric con el ID `/subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/resourceGroups/fabric-etl/providers/Microsoft.Fabric/capacities/fabricetl`.

```
./pbicmd.exe fabric sku -c /subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/resourceGroups/fabric-etl/providers/Microsoft.Fabric/capacities/fabricetl -k F4

```

  
  

#### Comando `fabriclh`

Utiliza la API de Fabric para manejar los _lakehouses_ de un área de trabajo, y tiene 3 subcomandos para listar, crear o borrar.

**Ejemplo 1:** Lista los _lakehouses_ del área de trabajo con el ID `wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww`.

```
./pbicmd.exe fabriclh list -ws wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww

```

**Ejemplo 2:** Crea un _lakehouse_ con el nombre `LH1` en el área de trabajo con el ID `wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww`.

```
./pbicmd.exe fabriclh create -ws wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww -n LH1

```

**Ejemplo 3:** Borra el _lakehouse_ con el ID `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` ubicado en el área de trabajo con el ID `wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww`.

```
./pbicmd.exe fabriclh delete -ws wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww -lh xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

```

  
  

#### Comando `fabricwh`

Utiliza la API de Fabric para hacer operaciones de backup/restore en un _warehouse_ de Fabric.

**Ejemplo 1:** Lista los puntos de restauración del _warehouse_ con el ID `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, ubicado en el área de trabajo con el ID `wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww`.

```
./pbicmd.exe fabricwh listrestpoints -ws wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww -wh xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

```

**Ejemplo 2:** Crea un punto de restauración en el _warehouse_ con el ID `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, ubicado en el área de trabajo con el ID `wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww`.

```
./pbicmd.exe fabricwh createrestpoints -ws wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww -wh xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

```

**Ejemplo 2:** Crea un punto de restauración en el _warehouse_ con el ID `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, ubicado en el área de trabajo con el ID `wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww`.

```
./pbicmd.exe fabricwh createrestpoints -ws wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww -wh xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

```

**Ejemplo 3:** Borra el punto de restauración `2024-12-31T11:56:04.4127705Z` del _warehouse_ con el ID `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, ubicado en el área de trabajo con el ID `wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww`.

```
./pbicmd.exe fabricwh delrestpoints -ws wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww -wh xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -rp 2024-12-31T11:56:04.4127705Z

```

**Ejemplo 4:** Restaura el _warehouse_ con el ID `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, ubicado en el área de trabajo con el ID `wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww` al punto de restauración `2024-12-31T11:56:04.4127705Z`.

```
./pbicmd.exe fabricwh restore -ws wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww -wh xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -rp 2024-12-31T11:56:04.4127705Z

```

  
  

#### Comando `toparquet`

Convierte ficheros CSV o JSON a Parquet. Puede convertir un solo fichero o todos los ficheros de una carpeta que cumplan con un patrón.

**Ejemplo 1:** Convierte un fichero CSV a Parquet.

```
./pbicmd.exe toparquet c:\taxis\yellow_tripdata_2021-01.csv -o c:\taxis\parquet\trips_2021-01.parquet

```

**Ejemplo 2:** Convierte a Parquet los ficheros CSV de una carpeta que cumplan con el patrón `yellow_tripdata_*.csv`

```
./pbicmd.exe toparquet c:\taxis -p yellow_tripdata_*.csv -o c:\taxis\parquet

```

**Ejemplo 3:** Convierte a Parquet todos los ficheros JSON de la carpeta `c:datos\json`

```
./pbicmd.exe toparquet c:datos\json -f json

```

  
  

#### Comando `todelta`

Convierte ficheros CSV o JSON a una tabla Delta. Puede convertir un solo fichero o todos los ficheros de una carpeta que cumplan con un patrón.

**Ejemplo 1:** Crea una tabla Delta con los datos de un fichero CSV y la guarda en la carpeta `c:\taxis_delta`

```
./pbicmd.exe todelta c:\taxis\yellow_tripdata_2021-01.csv c:\taxis_delta

```

**Ejemplo 2:** Crea una tabla Delta con los ficheros CSV de la carpeta `c:\taxis` que cumplan con el patrón `yellow_tripdata_*.csv` y la guarda en la carpeta `c:\taxis_delta`

```
./pbicmd.exe todelta c:\taxis c:\taxis_delta -p yellow_tripdata_*.csv

```

**Ejemplo 3:** Crea una tabla Delta a partir de los ficheros JSON de la carpeta `c:datos\json` y la guarda en la carpeta `c:\taxis_delta`

```
./pbicmd.exe todelta c:datos\json c:\datos\json_delta -f json

```

  
  

#### Comando `delta`

Permite optimizar una tabla Delta.

**Ejemplo 1:** Optimiza la tabla Delta consolidando varios ficheros Parquet pequeños en un fichero más grande. Es útil cuando hacemos actualizaciones incrementales con pocos datos. Esta operación puede tardar si hay muchos ficheros que procesar.

```
./pbicmd.exe delta c:/datos/tabla_delta -do

```

**Ejemplo 2:** Ejecuta la operación VACUUM para eliminar los archivos Parquet que han sido marcados para borrar, respetando el período de retención, que normalmente es de 7 días.

```
./pbicmd.exe delta c:/datos/tabla_delta -dv

```

**Ejemplo 3:** Ejecuta la operación VACUUM, pero sin ningún período de retención.

```
./pbicmd.exe delta c:/datos/tabla_delta -dv0

```

### Autenticación

Los comandos que utilizan las APIs de Power BI o de Fabric requieren autenticarse con un usuario que tenga acceso al área de trabajo de Power BI o a una subscripción de Azure.

Cuando ejecutamos estos comandos manualmente, esta autenticación será interactiva, por lo que abrirá el navegador por defecto con la página de autenticación de Microsoft donde debemos indicar nuestras credenciales de la misma manera que lo haríamos si entráramos al servicio de Power BI.

Pero si queremos ejecutar `pbicmd` de manera automática, en lugar de utilizar un usuario y una contraseña hay que crear en Azure una entidad de servicio y luego dar acceso a dicha entidad de servicio a un área de trabajo de Power BI.

En esta página de la documentación de Microsoft se describe el proceso (para este caso interesa hasta el paso 4): [https://learn.microsoft.com/es-es/power-bi/developer/embedded/embed-service-principal#step-1---create-a-microsoft-entra-app](https://learn.microsoft.com/es-es/power-bi/developer/embedded/embed-service-principal#step-1---create-a-microsoft-entra-app)

Para autenticarse se emplean tres parámetros de dicha entidad de servicio: el **ID de cliente**, el **ID del inquilino** y el **secreto de cliente**.  
Estos tres parámetros se deben asignar a las siguientes variables del entorno antes de ejecutar `pbicmd`:

```
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
AZURE_TENANT_ID

```

Por ejemplo, en PowerShell se puede hacer así:

```
$env:AZURE_CLIENT_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
$env:AZURE_CLIENT_SECRET = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
$env:AZURE_TENANT_ID = 'midominio.com'   

```

Si cuando se ejecuta `pbicmd` detecta estas variables del entorno, utilizará la entidad de servicio en lugar de la autenticación interactiva.

### Organización del código y librerías

Para finalizar quiero compartir algunos detalles de la implementación, por si quieres revisar el código, aunque te adelanto que no es nada del otro mundo.

El código fuente está organizado en dos carpetas: `commands` y `utils`:

1. La carpeta `commands` contiene un fichero por cada comando y el nombre del fichero coincide con el nombre del comando,,por ejemplo, `dax.py`.
2. La carpeta `utils` contiene ficheros con funciones auxiliares que se utilizan en varios comandos. Por ejemplo, `powerbi_api.py` o `azure_api.py` o `dax_utils.py`

El módulo principal está en el fichero `pbicmd.py` y se encarga de consolidar todos los comandos y mostrar la ayuda general.  

Para la implementación de los comandos he utilizado la excelente librería **Typer** ([https://typer.tiangolo.com/](https://typer.tiangolo.com/)) creada por Sebastián Ramírez ([https://tiangolo.com/](https://tiangolo.com/)), el autor de FastAPI ([https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)).

En las dos imágenes siguientes se pueden ver el listado de ficheros y un fragmento del código de `pbicmd.py`.

![Imagen que muestra la estructura de ficheros del código fuente de pbicmd](/assets/images/posts/2024-12-30-pbicmd-cli-automatizar-tareas-power-bi/pbicmd-estructura-codigo.png)

![Imagen que muestra un fragmento del modulo principal de pbicmd donde se consolidan los comandos.](/assets/images/posts/2024-12-30-pbicmd-cli-automatizar-tareas-power-bi/pbicmd-modulo-principal-pbicmd.py_.png)

También he utilizado otras librerías:

- [**azure-identity**](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity) para manejar la autenticación en los comandos que utilizan las APIs de Power BI o Fabric
- [**Requests**](https://requests.readthedocs.io/) para enviar las solicitudes HTTP a las APIs
- [**pandas**](https://pandas.pydata.org/) para guardar el resultado de una consulta DAX
- [**pyarrow**](https://arrow.apache.org/) para generar ficheros Parquet
- [**deltalake**](https://github.com/delta-io/delta-rs) para generar tablas Delta
- [**rich**](https://github.com/Textualize/rich) para dar formato a los textos de salida

Te doy las gracias si llegaste hasta aquí y te animo a utilizarlo, o a proponer mejoras o nuevos comandos.ðŸ˜Š
