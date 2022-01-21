# maplibregl-wms-raster-source
Supports a WMS Raster Source when using [Maplibre GL](https://maplibre.org/projects/#js) version v2.0.2.

## Objective ✨
There is already an existing [WMS source tutorial for mapbox-gl-js](https://docs.mapbox.com/mapbox-gl-js/example/wms/), this source aims to make it easier to add WMS sources. I would also like to extend it to allow for querying on click, but that is still pending right now.


## Usage 🛠️

```javascript
<script src="https://jimmyrocks.github.io/maplibregl-wms-raster-source/dist/maplibregl-wms-raster-source.min.js"></script>

        map.addSourceType('wms', WMSRasterSourceType(maplibregl), (e) => e && console.error('There was an error', e));

        map.on('load', () => {
            map.addSource('NOAA', {
                'type': 'wms',
                'tileSize': 256,
                'layers': [1],
                'transparent': true,
                'url': 'https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Observations/radar_base_reflectivity/MapServer/WMSServer'
            });

            map.addLayer({
                "id": "NOAA",
                "type": "raster",
                "source": "NOAA",
                'paint': {}
            });

        });
```

## Specification 🗎

This is the full TypeScript specification for the source object:
```
    minzoom?: number | undefined;
    maxzoom?: number | undefined;
    tileSize?: number | undefined;
    attribution?: string | undefined;
    volatile?: boolean | undefined;
    url: string,

    version?: '1.0.0' | '1.1.0' | '1.1.1' | '1.3.0',
    layers: Array<string>,
    styles?: Array<string>,
    format?: 'image/png' | 'image/png8' | 'image/jpeg' | 'image/vnd.jpeg-png' | 'image/vnd.jpeg-png8',
    transparent?: boolean,
    bgcolor?: string,
    exceptions?: string,
    time?: string,
    sld?: string,
    sld_body?: string
```

GeoServer also has a [great document](https://docs.geoserver.org/latest/en/user/services/wms/reference.html) that describes the values that can be used.
Layers and Styles are arrays of strings, so they are defined as `[0,1,2]` instead of `0,1,2` as they would be in the REST API.

## Example ⚙️
* [NOAA Weather](https://jimmyrocks.github.io/maplibregl-wms-raster-source/examples/index.html)