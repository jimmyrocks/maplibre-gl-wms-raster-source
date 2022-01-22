(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WMSRasterSourceType = factory());
})(this, (function () { 'use strict';

    function WMSRasterSourceType(mapLibrary) {
        return class RasterCustomProtocolSourceSpecification extends mapLibrary.Style.getSourceType('raster') {
            constructor(layerName, params) {
                const superParams = {
                    type: "raster",
                    bounds: params.bounds,
                    minzoom: params.minzoom,
                    maxzoom: params.maxzoom,
                    tileSize: params.tileSize || 256,
                    attribution: params.attribution,
                    volatile: params.volatile
                };
                const WMSRasterParams = {
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
                }
                else {
                    WMSRasterParams.srs = 'EPSG:3857';
                }
                // Don't encode the bbox
                const encode = (v) => v === WMSRasterParams.bbox ? v : encodeURIComponent(v);
                superParams.tiles = [params.url + '?' + Object.keys(WMSRasterParams)
                        .map(key => WMSRasterParams[key] !== undefined && [encodeURIComponent(key), encode(WMSRasterParams[key])].join('='))
                        .filter(v => v !== false)
                        .join('&')
                ];
                // Remove the undefineds
                const cleanSuperParams = Object.keys(superParams)
                    .map(key => superParams[key] && [key, superParams[key]])
                    .filter(v => v !== undefined)
                    .reduce((a, c) => ({ ...a, ...{ [c[0]]: c[1] } }), {});
                // Swap out the 2nd argument with the cleanSuperParams, so we can leave as much of the original as possible
                let args = [...arguments];
                args[1] = cleanSuperParams;
                super(...args);
            }
        };
    }

    return WMSRasterSourceType;

}));
