import {
    default as maplibregl,
    RasterSourceSpecification
} from 'maplibre-gl';

type MapLibrary = typeof maplibregl;

export interface RasterCustomProtocolSourceSpecificationType extends Omit<RasterSourceSpecification, "tiles" | "url" | "type" | "scheme"> {
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
};

export interface GeoServerGetMapBase {
    service: 'WMS',
    version: '1.0.0' | '1.1.0' | '1.1.1' | '1.3.0',
    request: 'GetMap',
    layers: string,
    styles: string,
    crs?: string,
    srs?: string,
    bbox: string, // [minx, miny, maxx, maxy]
    width: number,
    height: number,
    format: 'image/png' | 'image/png8' | 'image/jpeg' | 'image/vnd.jpeg-png' | 'image/vnd.jpeg-png8',
    transparent?: boolean,
    bgcolor?: string,
    exceptions?: string | 'application/vnd.ogc.se_xml',
    time?: string,
    sld?: string,
    sld_body?: string
};

export default function WMSRasterSourceType(mapLibrary: MapLibrary) {
    return class RasterCustomProtocolSourceSpecification extends mapLibrary.Style.getSourceType('raster') {

        constructor(layerName: string, params: RasterCustomProtocolSourceSpecificationType) {
            const superParams: RasterSourceSpecification = {
                type: "raster",
                bounds: params.bounds,
                minzoom: params.minzoom,
                maxzoom: params.maxzoom,
                tileSize: params.tileSize || 256,
                attribution: params.attribution,
                volatile: params.volatile
            };

            const WMSRasterParams: GeoServerGetMapBase = {
                service: 'WMS',
                version: params.version || '1.1.1',
                request: 'GetMap',
                layers: params.layers.join(','),
                styles: params.styles ? params.styles.join(',') : '',
                bbox: '{bbox-epsg-3857}',
                width: params.tileSize || 256,
                height: params.tileSize || 256,
                format: params.format || 'image/png',
                transparent: params.transparent,
                bgcolor: params.bgcolor,
                exceptions: params.exceptions,
                time: params.time,
                sld: params.sld,
                sld_body: params.sld_body
            };

            if (params.version === '1.3.0') {
                WMSRasterParams.crs = 'EPSG:3857';
            } else {
                WMSRasterParams.srs = 'EPSG:3857'
            }
            
            // Don't encode the bbox
            const encode = (v: string) =>  v === WMSRasterParams.bbox ? v : encodeURIComponent(v);

            superParams.tiles = [params.url + '?' + Object.keys(WMSRasterParams)
                .map(key => (WMSRasterParams as any)[key] !== undefined && [encodeURIComponent(key), encode((WMSRasterParams as any)[key])].join('='))
                .filter(v => v !== false)
                .join('&')
            ];

            // Remove the undefineds
            const cleanSuperParams = Object.keys(superParams)
              .map(key => (superParams as any)[key] && [key, (superParams as any)[key]])
              .filter( v => v !== undefined)
              .reduce((a,c) => ({...a, ...{[c[0]]: c[1]}}),{});

            // Swap out the 2nd argument with the cleanSuperParams, so we can leave as much of the original as possible
            let args = [...arguments];
            args[1] = cleanSuperParams;

            super(...args);
        }

        //TODO identify function
    }
};