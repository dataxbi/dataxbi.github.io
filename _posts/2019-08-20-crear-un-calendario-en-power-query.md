---
layout: post
title: "Crear un calendario en Power Query"
date: 2019-08-20
author: "Diana Aguilera Reyna"
categories: 
  - "sin-categoria"
tags: 
  - "powerquery"
---

En esta entrada de blog mostraremos como crear un calendario en Power Query para distintos casos de uso, donde las fechas inicial y final pueden ser valores fijos o depender de la fecha actual, o de una o varias columnas de fechas.

<!--more-->

En Power BI Desktop podemos crear calendarios en Power Query o usando funciones DAX. Podemos escoger cualquiera de las dos opciones para hacerlo y el resultado es muy similar. Cuando creamos un calendario en Power Query, podemos conectarnos a páginas web que contengan los calendarios festivos de nuestro país o región e incorporarlos a nuestro calendario, esta es la principal ventaja de crear un calendario en Power Query y no con DAX.

#### Los pasos para crear un calendario en Power Query son siempre los mismos, independientemente del caso de uso:

1. Especificar las fechas de inicio y fin del calendario
2. Crear una lista con las fechas
3. Convertir la lista en una tabla
4. Adicionar a la tabla las columnas de año, número de mes y nombre de mes.
5. Añadir las columnas trimestre, semana, día de la semana y AAMM
6. Agregar columna con Fechas fiscales: mes, año y AAMM
7. Añadir columna con festivos

Podemos añadir otras columnas dependiendo de nuestras necesidades.

Mostraremos 5 casos de uso para crear un calendario que solo difieren en como se tomen los valores de fecha inicial y final para crearlo, el resto de columnas que se creen serán las mismas en todos los casos.

#### Los valores de fecha que utilizaremos son:

- Dos valores de fechas fijos: fecha inicial y fecha final.
- Los 3 últimos años hasta la fecha actual, desde la misma fecha hace tres años hasta la fecha actual.
- Los 3 últimos años completos, desde el primer día del año de hace tres años hasta el último día del año actual.
- Los valores mínimo y máximo de una columna de fechas, donde el menor valor será la fecha inicial y el mayor valor la fecha final.
- Los valores mínimo y máximo de varias columnas de fechas. Seleccionaremos el menor valor entre todas las columnas como valor inicial y el mayor valor como valor final del calendario.

Desarrollaremos el primer caso de uso completo, es decir, crearemos un calendario con todas las columnas descritas. A continuación, convertiremos el calendario en una función con todas las transformaciones que hemos realizado en este caso de uso. Finalmente crearemos cinco consultas para crear los calendarios correspondientes a cada caso de uso y que utilizarán esta función.

### Crear un calendario a partir de dos valores de fechas fijos, fecha inicial y fecha final.

Pasos:

1. Declaramos dos parámetros, uno para la fecha inicial, que nombraremos FI y le asignamos el valor 01/01/2019,
  
![Parámetro FI](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-parametro-FI-Power-Query.png)  
  

y otro para la fecha final, que nombraremos FF y al que le asignamos el valor 31/12/2020.

![Parámetro FF](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-parametro-FF-Power-Query.png)  
  

Si quieres conocer más acerca de los parámetros puedes visitar [una entrada anterior](https://www.dataxbi.com/blog/2019/07/11/parametros-de-consulta/) donde hablamos de su uso y cómo crearlos.

12. Crearemos una consulta en blanco y la nombramos fCalendario.
13. Abrimos el Editor avanzado y sustituimos el paso Origen por la fórmula:

```
Duracion = Duration.TotalDays (FF-FI) + 1
```

La expresión calcula la diferencia en días entre las dos fechas.

4. Añadimos un nuevo paso usando la transformación:

```
ListaFechas = List.Dates(FI,Duracion,#duration(1,0,0,0))
```

Este paso genera una lista de fechas desde la fecha inicial hasta la fecha final.

5. A continuación, transformamos la lista en una tabla mediante la fórmula:

```
TablaFechas = Table.FromList(ListaFechas, Splitter.SplitByNothing(), type table [Fecha = date], null, ExtraValues.Error)
```

La función [Table.FromList](https://docs.microsoft.com/en-us/powerquery-m/table-fromlist) convierte una lista en una tabla.

```
Table.FromList(list as list, optional splitter as nullable function, optional columns as any, optional default as any, optional extraValues as nullable number)
```

##### parámetros de la función:

list: la lista que queremos convertir en tabla.

splitter: Es opcional, aplica una función de división a cada elemento de la lista. En este caso no se requiere dividir los elementos de la lista y usamos la función _Splitter.SplitByNothing()._

_columns:_ Es opcional, puede contener el número de columnas, una lista de las columnas o un tipo table. En este caso hemos pasado una declaración del tipo table donde el nombre de la columna es **Fecha** y el tipo de dato que contiene es **date**.

_defaut:_ Es opcional, valor predeterminado. En este caso no se ha pasado valor por defecto.

extraValues: Es opcional, valores adicionales en caso de error. Si la función de división devuelve más columnas de las que la tabla espera, se puede:

- generar un error (_Error)_
- ignorar el error (_Ignore_)
- recopilar en una lista (_List_)

En el ejemplo se generará un error.

6. Agregamos una columna de año a la tabla usando la fórmula:

```
ColumnaAño = Table.AddColumn(TablaFechas,"Año", each Date.Year([Fecha]), Int64.Type)
```

10. Añadimos una columna con el número del mes a la tabla usando la fórmula:

```
ColumnaNroMes = Table.AddColumn(ColumnaAño,"Nro. Mes", each Date.Month([Fecha]), Int64.Type)
```

14. Adicionamos una columna con el nombre del mes usando la fórmula:

```
ColumnaMes = Table.AddColumn(ColumnaNroMes,"Mes", each Date.MonthName([Fecha]), type text)
```

18. Añadimos la columna trimestre mediante la expresión:

```
ColumnaTrimestre = Table.AddColumn(ColumnaMes,"Trimestre", each Text.From(Date.QuarterOfYear([Fecha])) & "T", type text)
```

22. Agregamos columna con el numero de la semana del año utilizando la fórmula:

```
ColumnaSemana = Table.AddColumn(ColumnaTrimestre,"Semana", each Date.WeekOfYear([Fecha],Day.Monday), Int64.Type)
```

26. Adicionamos columna con el día de la semana usando la expresión:

```
ColumnaDiaSemana = Table.AddColumn(ColumnaSemana,"Día Semana", each Date.DayOfWeek([Fecha],Day.Monday),Int64.Type)
```

30. Añadimos columna con YYMM según la fórmula:

```
ColumnaYYMM = Table.AddColumn(ColumnaDiaSemana, "YYMM", each [Año]*100 + [Nro. Mes], Int64.Type)
```

34. Creamos un parámetro para almacenar el número del mes fiscal.
  

![Prámetro NroMesFiscal](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-parametro-NroMesFiscal-Power-Query.png)  

40. Agregamos una columna con el número de mes fiscal:

```
ColumnaNroMesFiscal = Table.AddColumn(ColumnaYYMM, "Nro. Mes Fiscal", each if [Nro. Mes] > NroMesFiscal then [Nro. Mes] - NroMesFiscal else [Nro. Mes] + NroMesFiscal, Int64.Type)
```

44. Añadimos una columna con el año fiscal

```
ColumnaAñoFiscal = Table.AddColumn(ColumnaNroMesFiscal,"Año Fiscal", each if [Nro. Mes Fiscal] <= NroMesFiscal then [Año] + 1 else [Año], Int64.Type)
```

48. Adicionamos la columna FYYMM con el año y mes fiscal.

```
ColumnaFYYMM = Table.AddColumn(ColumnaAñoFiscal,"FYYMM", each [Año Fiscal]*100 + [Nro. Mes Fiscal], Int64.Type)
```

### Crear calendario de días festivos

Para los días festivos usaremos la URL de una página que contiene los festivos de España para los años 2018, 2019 y 2020. Tendremos que realizar algunas transformaciones hasta obtener una tabla con el formato requerido.

1. Creamos una nueva consulta usando el conector Web. La URL del origen es [https://www.diafestivo.es/](https://www.diafestivo.es/). Extraemos la tabla que contiene los festivos de España.
2. Renombramos la consulta como Festivos España.
3. Utilizar la primera fila como encabezado será nuestra primera transformación.
4. Eliminamos el paso Tipo cambiado.
5. A continuación, seleccionamos la columna España y la transformación Anular la dinamización de otras columnas.
6. Filtramos las filas que contengan â€œ-â€œ en la columna Valor.
7. Seleccionamos la columna Valor y luego la columna Atributo, en la pestaña Transformar, dentro del grupo Columnas de texto, seleccionamos la opción Combinar columnas. Como separador escogemos Espacio y como nombre de columna escribimos Fecha.
8. Cambiamos el tipo de datos de la columna Fecha al tipo Fecha.
9. Seleccionamos la columna fecha y eliminamos duplicados.
10. Cambiamos el nombre a la columna España por Fiesta.
11. Y ya está el calendario de festivos de España.  
       
     ![Crear Calendario de festivos en Power Query](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Calendario-festivos-España-Power-Query-5.png)

### Añadir festivos a la consulta fCalendario

17. Seleccionamos la consulta fCalendario.
18. En el Editor avanzado, añadimos un nuevo paso donde combinamos las dos consultas utilizando la fórmula:

```
Consultascombinadas = Table.NestedJoin(ColumnaFYYMM, {"Fecha"}, #"Festivos España", {"Fecha"}, "Días festivos", JoinKind.LeftOuter)
```

22. Añadimos un nuevo paso donde expandimos la columna Días festivos:

```
Diasfestivos = Table.ExpandTableColumn(Consultascombinadas, "Días festivos", {"Fiesta"}, {"Fiesta"})
```

26. Añadimos una columna que devuelva para cada día si es festivo o no teniendo en cuenta si es fin de semana o día de fiesta nacional.

```
ColumnaLaborable = Table.AddColumn(Diasfestivos, "Festivo", each if [Fiesta] <> null orÂ  [Día Semana] = 6 or [Día Semana]=7 then 1 else 0, Int64.Type)
```

30. Ya está listo nuestro calendario.

### Crear función a partir de la consulta anterior.

1. Seleccionamos la consulta fCalendario y a continuación abrimos el Editor avanzado.
2. En la primera línea del editor, después de la expresión let realizamos un cambio de línea.
3. En la línea 2 del editor declaramos la función mediante la siguiente expresión:

```
Origen = (FI as date, FF as date)=>
```

4. Realizamos otro cambio de línea y en la línea 3 del editor escribimos la expresión let para indicar el comienzo del cuerpo de la función.
5. Después del último paso añadimos otra línea donde escribimos la expresión in y a continuación un nuevo cambio de línea.
6. Escribimos Origen y a continuación oprimimos el botón Listo.
7. Habremos convertido la consulta en una función.

![Crear funcion fCalendario en Power Query](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-funcion-fCalendario-Power-Query.png)  
  

### Crear las cinco consultas correspondientes a cada caso de uso.

#### Calendario 1: crear un calendario a partir de dos valores de fechas fijos, fecha inicial y fecha final.

- Crear consulta en blanco.
- En la primera línea de la consulta escribir la expresión

```
= fCalendario(FI,FF)
```

Hemos llamado a la función que acabamos de crear pasándole como valores los parámetros definidos previamente.

![Crear un calendario en Power Query](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-1.png)  
  

Como resultado se ha obtenido un calendario que va desde el valor de una fecha fija hasta el valor de otra fecha fija.

![Crear un calendario en Power Query 1](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Calendario1-Power-Query.png)  
  

#### Calendario 2: crear un calendario con los X últimos años hasta la fecha actual.

- Crear consulta en blanco.
- Asignar el valor de la fecha actual a la variable fecha\_final usando la función DateTime.LocalNow()

```
fecha_final = Date.From(DateTime.LocalNow())
```

- Crear parámetro con el número de años del calendario.

![Parámetro Años](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-parametro-Años-Power-Query.png)

- Restar a la fecha actual el número de años deseados para encontrar el valor inicial:

```
fecha_inicial = Date.AddYears(fecha_final,-1*Años),
```

- Llamar la función fCalendario pasando las dos variables como parámetros.

```
calendario = fCalendario(fecha_inicial, fecha_final)
```

- Devolver el calendario

![Crear un Calendario en Power Query 2](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-2.png)  
  

#### Calendario 3: crear un calendario con los X últimos años desde el primer día del primer año hasta el último día del año actual.

- Crear consulta en blanco.
- Asignar el valor de la fecha actual a la variable fecha\_final usando la función DateTime.LocalNow()

```
fecha_final = Date.From(DateTime.LocalNow())
```

- Año de la fecha final en la variable año\_final.

```
año_final = Date.Year(fecha_final)
```

- Ãšltimo día del año final:

```
ff = Date.From("31/12/" & Text.From(año_final))
```

- Restar a la fecha actual el número de años deseados para encontrar el valor de fecha\_inicial:

```
fecha_inicial = Date.AddYears(fecha_final,-1*Años),
```

- Año de la fecha inicial en la variable año\_inicial.

```
año_inicial = Date.Year(fecha_inicial)
```

- Primer día del año inicial:

```
fi = Date.From("01/01/" & Text.From(año_inicial))
```

- Llamar la función fCalendario pasando las dos variables como parámetros.

```
calendario = fCalendario(fi,ff)
```

- Devolver el calendario

![Crear un Calendario en Power Query 3](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-3.png)  
  

#### Calendario 4: crear un calendario dinámico a partir de una columna de fechas, donde el menor valor será la fecha inicial y el mayor valor la fecha final.

- Crear consulta en blanco.
- Asignar el menor valor de una columna de fechas a la variable fecha\_inicial usando la expresión:

```
fecha_inicial = List.Min(Ventas[OrderDate])
```

- Asignar el mayor valor de una columna de fechas a la variable fecha\_final usando la expresión:

```
fecha_final = List.Max(Ventas[OrderDate])
```

- Llamar la función fCalendario pasando las dos variables como parámetros.

```
calendario = fCalendario(fecha_inicial, fecha_final)
```

- Devolver el calendario

![Crear un Calendario en Power Query 4](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-4.png)  
  

#### Calendario 5: crear un calendario dinámico a partir de varias columnas de fechas. Seleccionaremos el menor valor entre todas las columnas como valor inicial y el mayor como valor final del calendario.

Primero crearemos una función que devuelva una lista de valores con el mayor y el menor valor de una columna de fechas y luego crearemos el calendario usando la función.

##### Pasos para crear la función:

- Crear una consulta en blanco.
- En el paso Origen asignar la siguiente expresión para la declaración de la función:

```
Origen = (tabla as table, columna as text) =>
```

La función contiene dos parámetros una para la tabla y otro para la columna de tipo fecha.

- A continuación, en la línea 3 del editor escribir la expresión let para indicar que comienza el cuerpo de la función.
- En la línea 4 escribir la siguiente expresión:

```
FI = Record.Field (Table.Min(tabla,columna),columna),
```

Esta expresión devuelve la primera fecha de la columna especificada.

- En la línea 5 escribir la siguiente expresión:

```
FF = Record.Field(Table.Max(tabla,columna),columna),
```

Esta expresión devuelve la última fecha de la columna especificada.

- Combinamos los valores FI y FF en una lista en la línea 6 mediante la expresión:

```
{% raw %}
Lista = List.Combine({{FI},{FF}})
{% endraw %}
```

Esta expresión devuelve una lista que contiene el primer y el ultimo valor de la columna fecha pasada como parámetro a la función.

- Escribimos la instrucción in en la línea 7 para indicar el resultado de la función.
- Devolvemos la variable del último paso de la función en la línea 8, en este caso la variable Lista.
- Oprimir el botón Listo y a continuación cambiar el nombre de la función por MinMaxDate.
- Ya está lista la función.

![Función MinMaxDate](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-funcion-MinMaxDate-Power-Query.png)

  
  

##### Pasos para crear el calendario.

Para la tabla que contiene varias columnas de fechas usaremos la tabla FactInternetSales de AdventureWorksDW2017 a la que hemos llamado Ventas. Esta tabla tiene tres columnas de fecha: OrderDate, DueDate y ShipDate. Usaremos la función anterior para buscar el menor y el mayor valor de cada una de estas columnas, combinarlos en una lista y luego seleccionar el menor y el mayor entre estos valores para crear nuestro calendario siguiendo los pasos que se detallan a continuación:

- Creamos una consulta en blanco y abrimos el Editor avanzado.
- Sustituimos el paso Origen por la expresión:

```
DatesOrder = MinMaxDate(Ventas,"OrderDate"),
```

- Añadimos dos nuevos pasos en la consulta usando las expresiones:

```
DatesDue = MinMaxDate(Ventas,"DueDate"),
```

y

```
DatesShip = MinMaxDate(Ventas,"ShipDate"),
```

- A continuación, combinamos las listas resultantes en una nueva lista que nombramos ALLDates.

```
AllDates = List.Combine({DatesOrder,DatesDue,DatesShip}),
```

- Asignamos el menor valor de la lista ALLDates a la variable fecha\_inicial usando la expresión:

```
fecha_inicial = List.Min(AllDates)
```

- Asignamos el mayor valor de la lista ALLDates a la variable fecha\_final usando la expresión:

```
fecha_final = List.Max(AllDates),
```

- Llamamos la función fCalendario pasando las dos variables como parámetros.

```
calendario = fCalendario(fecha_inicial, fecha_final)
```

- Devolvemos el calendario

![Crear un Calendario en Power Query 5](/assets/images/posts/2019-08-20-crear-un-calendario-en-power-query/dataXbi-Crear-Calendario-Power-Query-5.png)  
  

### Conclusiones:

- Podemos crear calendarios utilizando Power Query o funciones DAX. Las dos son muy similares a la hora de crear un calendario.
- En muchos escenarios, los días festivos juegan un papel importante en el análisis de datos. Con Power Query podemos obtener datos de las web en vivo. Esta funcionalidad permite buscar los días festivos en páginas web públicas en vivo y añadirlos a nuestro calendario. Esta funcionalidad no la tiene DAX y es la ventaja fundamental de crear el calendario con M.

El archivo PIBX de este ejemplo está disponible en [GitHub](https://github.com/dataxbi/power-query).
