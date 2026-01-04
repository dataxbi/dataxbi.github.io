# Corrección de Caracteres UTF-8 Mal Codificados

## Problema

Algunos posts contienen caracteres UTF-8 mal codificados que aparecen como secuencias extrañas:
- `â€"` → debería ser `-` (guión)
- `â€œ` → debería ser `"` (comillas izquierda)  
- `â€` → debería ser `"` (comillas derecha)
- `â€¢` → debería ser `•` (bullet point)
- `â€¦` → debería ser `...` (puntos suspensivos)
- `AntigÃ¼edad` → debería ser `Antigüedad`

## Archivos Corregidos

Ya se han corregido los siguientes archivos:
- ✅ 2024-05-08-poc-etl-low-cost-fabric-costes.md (título con guión)
- ✅ 2018-10-23-conectarse-origenes-datos-power-bi-desktop-excel-2016.md
- ✅ 2018-11-06-transformar-datos-power-query.md
- ✅ 2018-11-19-combinar-consultas-coincidencias-aproximadas.md
- ✅ 2020-07-27-dax-treatas.md

## Archivos Pendientes

Quedan aproximadamente 16 archivos con caracteres problemáticos. La mayoría son casos menores (comillas, puntos suspensivos) que no afectan la legibilidad principal del contenido.

## Cómo Corregir Nuevos Casos

### Opción 1: Manualmente con Replace String

Para cada archivo:

1. Identificar el texto con caracteres problemáticos
2. Usar el editor para reemplazarlo con el carácter correcto

### Opción 2: Script Automático (en desarrollo)

El script `corregir-encoding.ps1` está disponible pero necesita ajustes para funcionar correctamente con todos los casos.

## Prevención

Para evitar estos problemas en el futuro:

1. **Asegurar UTF-8 sin BOM**: Todos los archivos .md deben guardarse en UTF-8 sin BOM
2. **Usar editor con encoding correcto**: VS Code, por ejemplo, con:
   ```json
   "files.encoding": "utf8",
   "files.autoGuessEncoding": false
   ```
3. **Verificar antes de commit**: Buscar estos patrones antes de hacer push:
   ```powershell
   Get-Content archivo.md | Select-String "â€"
   ```

## Comando para Encontrar Archivos Afectados

```powershell
cd _posts
Get-ChildItem -Filter "*.md" | Select-String -Pattern "â€" -SimpleMatch | Group-Object Filename | Select-Object Name, Count | Sort-Object Count -Descending
```

## Estado Actual

- **Corregidos**: 5 archivos principales
- **Pendientes**: ~16 archivos con casos menores
- **Prioridad**: Alta para títulos y guiones, baja para comillas y puntos suspensivos internos

Los casos más importantes (títulos de posts y guiones en nombres) ya están corregidos. Los casos restantes son principalmente comillas decorativas y puntos suspensivos que no afectan la comprensión del contenido.
