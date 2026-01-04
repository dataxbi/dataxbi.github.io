---
layout: post
title: "Extraer datos de un fichero PDF con Python"
date: 2020-04-19
author: "Nelson López Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "azure"
  - "python"
---

En esta entrada quiero compartir cómo hemos utilizado Python para la preparación de los datos para la demo [https://www.dataxbi.com/covid-19/](https://www.dataxbi.com/covid-19/), que es un informe Power BI donde se muestra la evolución de los casos del COVID-19 en cada Comunidad Autonómica española.

<!--more-->

La fuente de los datos es el [sitio web del Ministerio de Sanidad](https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/situacionActual.htm), que actualiza la información diariamente en ficheros PDF, por ejemplo: [https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/documentos/Actualizacion\_80\_COVID-19.pdf](https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/documentos/Actualizacion_80_COVID-19.pdf)

Power BI tiene un [conector para PDF](https://docs.microsoft.com/es-es/power-bi/desktop-connect-pdf), pero en este caso decidimos no utilizarlo por dos motivos:

- El formato del PDF cambia mucho, por lo que las reglas para extraer los datos hay que actualizarlas frecuentemente
- La localización de los PDF para cada día también puede variar, por ejemplo, el nombre no sigue siempre el mismo patrón

Decidimos hacer un script python para extraer los datos hacia ficheros CSV con las columnas:

- Fecha
- Comunidad Autonómica (CCAA)
- Casos totales en la CCAA hasta la fecha
- Fallecidos totales en la CCAA hasta la fecha

Estos CSVs se almacenan diariamente en un blob de Azure, desde donde los procesa Power BI.

El código del script python está disponible en [GitHub](https://github.com/dataxbi/covid-19) y hace lo siguiente:

- Descarga la página web del Ministerio de Sanidad que contiene el enlace al PDF [https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/situacionActual.htm](https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/situacionActual.htm)
- Obtiene el URL del PDF, revisa el contenido HTML de la página (web scrapping) para encontrar el primer enlace (etiqueta A) con un atributo HREF que termine con el texto ".pdf" y que incluya el texto "Actualizacion".
- Recorre las tablas que contiene el PDF y busca las columnas con los nombres de las CCAA, el número de casos totales, el número de fallecidos.
- Extrae los datos hacia un CSV
- Crea un blob en Azure con el contenido del CSV

El formato del fichero PDF cambia mucho, por lo que las reglas para extraer los datos hay que actualizarlas frecuentemente, para identificar en que tabla y en que columna vienen los datos de interés. Para que os hagáis una idea, desde el 10 de marzo de 2020 y hasta el 10 de abril de 2020 hemos tenido que hacer 7 variantes. Para hacer las cosas un pelín más complicada, desde la semana pasada los datos hay que buscarlos en dos tablas distintas.

Hemos utilizado los siguientes módulos python:

- [Requests](https://requests.readthedocs.io/): Para descargar la página web
- [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/): Para encontrar el URL del PDF dentro del HTML (web scrapping)
- [tabula-py](https://github.com/chezou/tabula-py/): Para extraer las tablas del PDF
- [azure-storage-blob](https://docs.microsoft.com/es-es/azure/storage/blobs/storage-quickstart-blobs-python/): Para copiar los ficheros CSV hacia un blob de Azure
