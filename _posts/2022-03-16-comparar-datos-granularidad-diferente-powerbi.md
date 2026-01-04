---
layout: post
title: "Comparar datos con granularidad diferente en Power BI"
date: 2022-03-16
author: "Nelson L�pez Centeno"
categories: 
  - "sin-categoria"
tags: 
  - "powerbi"
  - "powerquery"
---

En esta entrada muestro c�mo comparar datos de dos tablas con granularidad diferente en el origen. La primera tabla contiene los costes de publicidad de Google Ads por d�a del a�o y producto. Mientras que en la segunda tabla est�n los costes de publicidad f�sica, en carteles, por mes y producto. Se necesita comparar los costes diarios de publicidad entre ambos medios (Google Ads y carteles), por lo que se requiere aumentar la granularidad de la segunda tabla de meses y productos a d�as y productos.

Primero planteo una soluci�n en la que ambas tablas se cargan hacia el modelo, casi sin transformar, y donde se utiliza DAX para ajustar las granularidad. Luego expongo la soluci�n que en mi opini�n es la ideal, donde se crea con Power Query una sola tabla de hechos que contiene los datos de ambas tablas con una granularidad de d�a y producto.

<!--more-->

### Requerimientos

![Diagrama con los requerimientos como se describen debajo.](/assets/images/posts/2022-03-16-comparar-datos-granularidad-diferente-powerbi/Costo-publicidad-diario-Requerimientos.png)

Tenemos una tabla con los costes de Google Ads que tiene las columnas Fecha, C�digo Producto y Costo, y otra tabla con los costes de la publicidad en carteles y que tiene las columnas A�o, Mes, C�digo Producto y Costo.

Se quiere obtener un gr�fico de columnas agrupadas donde el eje X sean los d�as de un mes y el eje Y contenga los costes de cada medio publicitario (carteles y Google Ads).

### Soluci�n 1: DAX

![Modelo de la primera soluci�n, con dos tablas de hechos con granularidades diferentes.](/assets/images/posts/2022-03-16-comparar-datos-granularidad-diferente-powerbi/Costo-publicidad-diario-Solucion-DAX.png)

El modelo tabular de esta primera soluci�n tiene dos tablas de hechos con granularidades diferentes, y que son pr�cticamnte las mismas tablas de origen, con la �nica diferencia que en la tabla de los costes de los carteles publicitarios us� Power Query para combinar las columnas A�o y D�a para obtener la columna Fecha Inicio Mes.

Tambi�n he creado una tabla de dimensi�n de fechas (Calendario) que se relaciona con ambas tablas de hechos.

Para poder realizar el gr�fico de columnas agrupadas, he tenido que crear dos medidas. Una medida para calcular los costes de Google Ads y que consiste simplemente en hacer SUM() de la columna Costo de la tabla correspondiente. La segunda medida calcula los costes de los carteles, y tiene que prorratear el coste para un d�a a partir del coste mensual.

En este caso el m�todo de prorrateo que he empleado es muy simple, dividir el coste del mes entre el n�mero de d�as del mes, pero pudi�ramos aplicar otros criterios, por ejemplo, asignarle pesos diferenciados a los d�as laborables y los no laborables.

```
Costo Carteles :=
SUMX (
    Calendario,
    VAR fecha = Calendario[Fecha]
    VAR fechaInicioMes = DATE ( YEAR ( fecha ), MONTH ( fecha ), 1 )
    VAR fechaFinMes = EOMONTH ( fecha, 0 )
    VAR diasMes = INT ( fechaFinMes - fechaInicioMes ) + 1
    RETURN
        CALCULATE (
            DIVIDE ( SUM ( 'Costos Publicidad Carteles'[Costo] ), diasMes ),
            Calendario[Fecha] = fechaInicioMes
        )
)

```

Esta medida hace lo siguiente:

- Itera por cada fila de la tabla calendario, teniendo en cuenta el contexto de filtro
- Para cada d�a, determina las fechas de inicio y de fin del mes y los d�as del mes
- Divide el coste de un mes entre la cantidad de d�as del mes, o sea prorratea el coste
- Suma el coste prorrateado de todas las filas encontradas

El iterador SUMX() hace posible segmentar el coste m�s all� de por d�a, por ejemplo, por mes o por a�o.

### Soluci�n 2: Power Query

![](/assets/images/posts/2022-03-16-comparar-datos-granularidad-diferente-powerbi/Costo-publicidad-diario-Solucion-Power-Query.png)

En esta segunda soluci�n, he prorrateado los costes de los carteles con Power Query, para obtener un modelo con una sola tabla de hechos con una granularidad definida por el medio de publicidad (carteles, Google Ads), el producto y el d�a del a�o. El nombre del medio de publicidad lo he dejado en la tabla de hechos, como una dimensi�n degenerada.

Se mantiene la tabla Calendario, con la dimensi�n de fechas.

Para construir el gr�fico de columnas agrupadas con este modelo, s�lo tuve que crear una medida que haga un SUM() de la columna Costo de la tabla de hechos.

A continuaci�n hago un resumen de c�mo he construido la tabla de hechos en Power Query.

- Crear una consulta a partir de la tabla con los costes de Googe Ads
- Crear otra consulta a partir de la tabla con los costes de los carteles
- Agregar transformaciones a la consulta de los carteles para aumentar su granularidad de meses a d�as y prorratear el coste
- A cada consulta le he agregado la columna Medio con el nombre correspondiente, "Google Ads" y "Carteles"
- Crear una nueva consulta anexando las dos consultas anteriores
- Deshabilitar la carga a dichas dos consultas

Para aumentar la granularidad a la consulta de los carteles he hecho las transformaciones siguientes.

![Agregar una columna personalizada con los d�as del mes](/assets/images/posts/2022-03-16-comparar-datos-granularidad-diferente-powerbi/Costo-publicidad-diario-Power-Query-Dias-del-mes.png)  
Agregar una columna personalizada con los d�as del mes, usando esta expresi�n:

```
Date.DaysInMonth([Fecha Inicio Mes])

```

  
  

![](/assets/images/posts/2022-03-16-comparar-datos-granularidad-diferente-powerbi/Costo-publicidad-diario-Power-Query-Lista-fechas.png)  
Agregar otra columna personalizada con una lista con todos los d�as del mes, usando esta expresi�n:

```
List.Dates([Fecha Inicio Mes],[D�as del mes],#duration(1,0,0,0))

```

  
  

Y dos transformaciones adicionales:

- Expandir la columna con la lista de los d�as del mes, con lo que se aumenta la granularidad
- Dividir la columna Costo entre la columna D�as del mes, para prorratear el coste

Este es el c�digo Power Query M completo de la consulta:

```
let
    Origen = Table.FromRows(Json.Document(Binary.Decompress(Binary.FromText("jdTBCsIwDIDhd9l5hSRN0nqcgkwEkU1P4vu/htVbm0A8dFD4yVco3es1ERBO8/Rdl33dEhCDsOa2F4DpPXfJ7bRcU1GFlnHbs03GKSxdQm3dt+WRWAULSbEQxRDFUPam1DhBkxgodwnHkJugSQJI/kuO531NUpCyqtizSHwWjSGNIY2hEkMlhkoM1RiqMVQ9qJ9ycCAFk4yQoEkMVPqnBu3zXE7HxJAPStmRfs04Z6B+TfCUEB1Lqm2CW0D3/0B94z3t0SLvrtA25jxf6/0B", BinaryEncoding.Base64), Compression.Deflate)), let _t = ((type nullable text) meta [Serialized.Text = true]) in type table [A�o = _t, Mes = _t, #"Codigo Producto" = _t, Costo = _t]),
    #"Columnas combinadas A�o Mes" = Table.CombineColumns(Table.TransformColumnTypes(Origen, {{"A�o", type text}, {"Mes", type text}}, "es-ES"),{"A�o", "Mes"},Combiner.CombineTextByDelimiter("-", QuoteStyle.None),"Fecha Inicio Mes"),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Columnas combinadas A�o Mes",{{"Fecha Inicio Mes", type date}, {"Codigo Producto", type text}, {"Costo", Currency.Type}}),
    #"Columna D�as del mes" = Table.AddColumn(#"Tipo cambiado", "D�as del mes", each Date.DaysInMonth([Fecha Inicio Mes]), Int64.Type),
    #"Columna Fecha con lista dias del mes" = Table.AddColumn(#"Columna D�as del mes", "Fecha", each List.Dates([Fecha Inicio Mes],[D�as del mes],#duration(1,0,0,0))),
    #"Se expandi� Fecha" = Table.ExpandListColumn(#"Columna Fecha con lista dias del mes", "Fecha"),
    #"Tipo cambiado Fecha" = Table.TransformColumnTypes(#"Se expandi� Fecha",{{"Fecha", type date}}),
    #"Costo prorrateado" = Table.AddColumn(#"Tipo cambiado Fecha", "Costo Prorrateado", each [Costo] / [D�as del mes], Currency.Type),
    #"Columnas quitadas" = Table.RemoveColumns(#"Costo prorrateado",{"Costo", "D�as del mes", "Fecha Inicio Mes"}),
    #"Columnas con nombre cambiado" = Table.RenameColumns(#"Columnas quitadas",{{"Costo Prorrateado", "Costo"}}),
    #"Columna Medio" = Table.AddColumn(#"Columnas con nombre cambiado", "Medio", each "Carteles", type text)
in
    #"Columna Medio"

```

### Conclusi�n

La segunda soluci�n es la ideal por ser m�s robusta, ya que para incluir nuevos medios de publicidad no hay que hacer ning�n cambio en el modelo.

Por ejemplo, si queremos incorporar los costes de la publicidad en una red social, hacemos una nueva consulta en Power Query para obtener una tabla con las mismas columnas, donde la columna Medio tendr�a un nombre diferente, y la anexamos en la consulta de la tabla de hechos. Cuando guardemos estos cambios en el modelo, el gr�fico se actualizar� sin tener que hacer ning�n cambio en el modelo, ni tener que crear una nueva medida.

Adem�s, el modelo es extensible, por ejemplo, si queremos segmentar o filtrar por otros atributos de las campa�as publicitarias, podemos crear una nueva tabla de dimensi�n y mover la dimensi�n degenerada Medio hacia dicha tabla.
