---
layout: post
title: "Carga de datos hacia Azure Synapse Analytics (SQL Data Warehouse) con Azure Data Factory"
date: 2020-02-22
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "synapse"
---

[**Azure Data Factory**](https://docs.microsoft.com/en-us/azure/data-factory/introduction) es un servicio gestionado para orquestar la extracción, transformación y limpieza (ETL) de datos, con conectores para múltiples orígenes y destinos. En esta entrada cargaremos un archivo CSV con unas 2.5 millones de filas hacia una tabla en un almacén de datos en Azure Synapse Analytics (SQL Data Warehouse).

<!--more-->

El origen y el destino de los datos son los mismos que he utilizado en entradas anteriores.

El [archivo CSV](https://www.dataxbi.com/blog/2020/02/09/carga-datos-azure-synapse-analytics-bcp/) contiene datos de los vuelos comerciales dentro de los Estados Unidos entre julio y octubre de 2019, que se almacena en [Azure Data Lake Gen2](https://www.dataxbi.com/blog/2020/02/12/carga-datos-azure-synapse-analytics-polybase/), en el contenedor `flights` y la carpeta `2019`. Los datos serán cargados hacia la tabla [StgFlights](https://www.dataxbi.com/blog/2020/02/17/carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-copy/), que tiene una estructura igual a la del archivo CSV.

Hay varias formas de trabajar con Data Factory, aquí vamos a hacerlo desde el portal de Azure, por lo que el proceso será muy visual, donde iremos siguiendo los distintos pasos y completando la información que nos piden.

He comenzado creando en el portal de Azure un nuevo recurso Data Factory y dentro de ella he creado una nueva **actividad de copia** (copy data).  
![Azure Data Factory - Copy data](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-1.jpg)

En las propiedades de la tarea le he puesto el nombre `CopyPipelineToDW` y he indicado que se ejecutará una sola vez.

A continuación, he llenado los detalles de la **fuente de datos**, para lo que primero hay hay que crear una conexión al Data Lake Gen2. 
![Azure Data Factory - Data source connection](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-2.jpg)

A la conexión le he puesto el nombre `AcmeDataLake` y he indicado el nombre de la cuenta de almacenamiento donde está el archivo CSV.  
![Azure Data Factory - Conexión a Data Lake Gen2](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-3.jpg)

Una vez creada la conexión, la he seleccionado y he indicado el camino de la carpeta donde está el archivo CSV (`flights/2019/`).  
![Azure Data Factory - Conexión a Data Lake Gen2](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-4.jpg)

En el paso siguiente he configurado el formato del archivo CSV, donde he dejado todo tal y como lo detecta Data Factory. En la imagen se puede ver cómo la vista previa de los datos es correcta.  
![Azure Data Factory - Formato del archivo fuente](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-5.jpg)

Ahora comienzo con la configuración del **destino de los datos**, y lo primero es crear la conexión a Synapse Analytics.  
![Azure Data Factory - Conexión a Azure Synapse Analytics](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-6.jpg)

A esta conexión le he puesto el nombre `AcmeDW` y he indicado cuál es el servidor Azure SQL, cuál es el almacén de datos, y las credenciales para autenticación.  
![Azure Data Factory - Conexión a Azure Synapse Analytics](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-7.jpg)

Después de crear la conexión, la he seleccionado y he continuado con el siguiente paso, que consiste en seleccionar la tabla del almacén de datos donde se va a cargar el contenido del archivo CSV.  
![Azure Data Factory - Mapeo de archivo CSV con tabla en el almacén de datos](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-8.jpg)

A continuación he confirmado el mapeo entre las columnas del archivo CSV y la tabla del almacén de datos, que como los nombres son idénticos, se ha hecho de forma autómatica.  
![Azure Data Factory - Mapeo de columnas entre archivo CSV y tabla en el almacén de datos](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-9.jpg)

He configurado varios parámetros para indicar cómo se hará la copia.

- `PolyBase` como método de copia. También están disponibles el comando `COPY` y `bulk insert`
- `Staging`: Es recomendable para mejorar el rendimiento de la copia, y en el caso de PolyBase es un requerimiento si el formato de los datos no cumple con [ciertas condiciones](https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-sql-data-warehouse#use-polybase-to-load-data-into-azure-sql-data-warehouse). He utilizado la misma cuenta de almacenamiento del Data Lake donde está el archivo CSV. He tenido que crear una nueva conexión a la que le he puesto el nombre `AcmeStaging`. Data Factory crea una carpeta temporal hacia donde copia los datos y los formatea antes de cargarlos hacia el almacén de datos con PolyBase.
- `Use type default`: Lo he desmarcado, lo cual quiere decir que si los datos tienen valores en NULL, se insertará un NULL en la tabla del almacén de datos.
- `Data migration unit`: Nos permite controlar cuantos recursos se utilizarán para la copia. Al dejarlo en Auto, Data Factory decidirá el valor óptimo, según [determinados criterios](https://docs.microsoft.com/en-us/azure/data-factory/copy-activity-performance#data-integration-units).

![Azure Data Factory - Configuración de la copia](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-10.jpg)

He revisado el resúmen de la configuración.  
![Azure Data Factory - Resúmen de la actividad de copia](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-11.jpg)

Y finalmente se ha creado la actividad de copia (pipeline) y se ha empezado a ejecutar.  
![Azure Data Factory - Publicación de la actividad de copia](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-12.jpg)

Podemos monitorear la ejecución de la actividad.  
![Azure Data Factory - Monitoreo de la actividad de copia](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-13.jpg)

Aquí se ve la actividad ya terminada, que tuvo una duración de 1 minuto 7 segundos. El almacén de datos estaba configurado con 100 DWU.  
También otra ejecución exitosa de la misma actividad, y dos ejecuciones que no fueran exitosas por problemas qur tuve en la configuración y el formato de los datos.  
![Azure Data Factory - Monitoreo de la actividad de copia](/assets/images/posts/2020-02-22-carga-de-datos-hacia-azure-synapse-analytics-sql-data-warehouse-con-azure-data-factory/dataxbi-cargando-datos-azure-synapse-analytics-data-factory-14.jpg)

Esta es la definición JSON de la actividad de copia que hemos creado, que podríamos modificar directamente, o podemos crear una nueva actividad a partir de esta utilizando este archivo como base.  

```
{
    "name": "CopyPipelineToDW",
    "properties": {
        "activities": [
            {
                "name": "Copy_tr2",
                "type": "Copy",
                "dependsOn": [],
                "policy": {
                    "timeout": "7.00:00:00",
                    "retry": 0,
                    "retryIntervalInSeconds": 30,
                    "secureOutput": false,
                    "secureInput": false
                },
                "userProperties": [
                    {
                        "name": "Source",
                        "value": "flights/2019/"
                    },
                    {
                        "name": "Destination",
                        "value": "dbo.StgFlights"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "DelimitedTextSource",
                        "storeSettings": {
                            "type": "AzureBlobFSReadSettings",
                            "recursive": true,
                            "wildcardFileName": "*"
                        },
                        "formatSettings": {
                            "type": "DelimitedTextReadSettings",
                            "skipLineCount": 0
                        }
                    },
                    "sink": {
                        "type": "SqlDWSink",
                        "allowPolyBase": true,
                        "polyBaseSettings": {
                            "rejectValue": 0,
                            "rejectType": "value",
                            "useTypeDefault": false
                        }
                    },
                    "enableStaging": true,
                    "stagingSettings": {
                        "linkedServiceName": {
                            "referenceName": "AcmeStaging",
                            "type": "LinkedServiceReference"
                        }
                    },
                    "translator": {
                        "type": "TabularTranslator",
                        "mappings": [
                            {
                                "source": {
                                    "name": "FL_DATE",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "FL_DATE",
                                    "type": "Date"
                                }
                            },
                            {
                                "source": {
                                    "name": "OP_UNIQUE_CARRIER",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "OP_UNIQUE_CARRIER",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "OP_CARRIER_FL_NUM",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "OP_CARRIER_FL_NUM",
                                    "type": "Int32"
                                }
                            },
                            {
                                "source": {
                                    "name": "ORIGIN_AIRPORT_ID",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "ORIGIN_AIRPORT_ID",
                                    "type": "Int32"
                                }
                            },
                            {
                                "source": {
                                    "name": "ORIGIN",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "ORIGIN",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "ORIGIN_CITY_NAME",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "ORIGIN_CITY_NAME",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "ORIGIN_STATE_ABR",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "ORIGIN_STATE_ABR",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "DEST_AIRPORT_ID",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "DEST_AIRPORT_ID",
                                    "type": "Int32"
                                }
                            },
                            {
                                "source": {
                                    "name": "DEST",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "DEST",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "DEST_CITY_NAME",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "DEST_CITY_NAME",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "DEST_STATE_ABR",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "DEST_STATE_ABR",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "CRS_DEP_TIME",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "CRS_DEP_TIME",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "DEP_TIME",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "DEP_TIME",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "DEP_DELAY",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "DEP_DELAY",
                                    "type": "Decimal"
                                }
                            },
                            {
                                "source": {
                                    "name": "CRS_ARR_TIME",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "CRS_ARR_TIME",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "ARR_TIME",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "ARR_TIME",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "ARR_DELAY",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "ARR_DELAY",
                                    "type": "Decimal"
                                }
                            },
                            {
                                "source": {
                                    "name": "CANCELLED",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "CANCELLED",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "CANCELLATION_CODE",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "CANCELLATION_CODE",
                                    "type": "String"
                                }
                            },
                            {
                                "source": {
                                    "name": "DIVERTED",
                                    "type": "String"
                                },
                                "sink": {
                                    "name": "DIVERTED",
                                    "type": "String"
                                }
                            }
                        ]
                    }
                },
                "inputs": [
                    {
                        "referenceName": "SourceDataset_tr2",
                        "type": "DatasetReference"
                    }
                ],
                "outputs": [
                    {
                        "referenceName": "DestinationDataset_tr2",
                        "type": "DatasetReference"
                    }
                ]
            }
        ],
        "annotations": []
    },
    "type": "Microsoft.DataFactory/factories/pipelines"
}

```
