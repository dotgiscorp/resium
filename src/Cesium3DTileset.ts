import Cesium from "cesium";
import createCesiumComponent, { EventkeyMap } from "./core/CesiumComponent";

export interface Cesium3DTilesetCesiumProps {
  url: Cesium.Resource | string | Promise<Cesium.Resource> | Promise<string>;
  show?: boolean;
  modelMatrix?: Cesium.Matrix4;
  shadows?: Cesium.ShadowMode;
  maximumScreenSpaceError?: number;
  maximumMemoryUsage?: number;
  cullWithChildrenBounds?: boolean;
  dynamicScreenSpaceError?: boolean;
  dynamicScreenSpaceErrorDensity?: number;
  dynamicScreenSpaceErrorFactor?: number;
  dynamicScreenSpaceErrorHeightFalloff?: number;
  skipLevelOfDetail?: boolean;
  baseScreenSpaceError?: number;
  skipScreenSpaceErrorFactor?: number;
  skipLevels?: number;
  immediatelyLoadDesiredLevelOfDetail?: boolean;
  loadSiblings?: boolean;
  clippingPlanes?: any; // Cesium.ClippingPlaneCollection;
  classificationType?: any; // Cesium.ClassificationType
  ellipsoid?: Cesium.Ellipsoid;
  imageBasedLightingFactor?: Cesium.Cartesian2;
  lightColor?: Cesium.Cartesian3;
  debugFreezeFrame?: boolean;
  debugColorizeTiles?: boolean;
  debugWireframe?: boolean;
  debugShowBoundingVolume?: boolean;
  debugShowContentBoundingVolume?: boolean;
  debugShowViewerRequestVolume?: boolean;
  debugShowGeometricError?: boolean;
  debugShowRenderingStatistics?: boolean;
  debugShowMemoryUsage?: boolean;
  debugShowUrl?: boolean;
  colorBlendAmount?: number;
  colorBlendMode?: any; // Cesium3DTileColorBlendMode
}

export interface Cesium3DTilesetProps extends Cesium3DTilesetCesiumProps {
  onAllTilesLoad?: () => void;
  onInitialTilesLoad?: () => void;
  onLoadProgress?: (numberOfPendingRequests: number, numberOfTilesProcessing: number) => void;
  onTileFailed?: () => void;
  onTileLoad?: () => void;
  onTileUnload?: () => void;
  onTileVisible?: () => void;
  pointCloudShading?:
    | any // Cesium.PointCloudShading
    | {
        attenuation?: boolean;
        geometricErrorScale?: number;
        maximumAttenuation?: number;
        baseResolution?: number;
        eyeDomeLighting?: boolean;
        eyeDomeLightingStrength?: number;
        eyeDomeLightingRadius?: number;
      };
}

export interface Cesium3DTilesetContext {
  primitiveCollection: Cesium.PrimitiveCollection;
}

const cesiumProps: Array<keyof Cesium3DTilesetCesiumProps> = [
  "url",
  "show",
  "modelMatrix",
  "shadows",
  "maximumScreenSpaceError",
  "maximumMemoryUsage",
  "cullWithChildrenBounds",
  "dynamicScreenSpaceError",
  "dynamicScreenSpaceErrorDensity",
  "dynamicScreenSpaceErrorFactor",
  "dynamicScreenSpaceErrorHeightFalloff",
  "skipLevelOfDetail",
  "baseScreenSpaceError",
  "skipScreenSpaceErrorFactor",
  "skipLevels",
  "immediatelyLoadDesiredLevelOfDetail",
  "loadSiblings",
  "clippingPlanes",
  "classificationType",
  "ellipsoid",
  "imageBasedLightingFactor",
  "lightColor",
  "debugFreezeFrame",
  "debugColorizeTiles",
  "debugWireframe",
  "debugShowBoundingVolume",
  "debugShowContentBoundingVolume",
  "debugShowViewerRequestVolume",
  "debugShowGeometricError",
  "debugShowRenderingStatistics",
  "debugShowMemoryUsage",
  "debugShowUrl",
  "colorBlendAmount",
  "colorBlendMode",
];

const cesiumEventProps: EventkeyMap<any, keyof Cesium3DTilesetProps> = {
  allTilesLoaded: "onAllTilesLoad",
  initialTilesLoaded: "onInitialTilesLoad",
  loadProgress: "onLoadProgress",
  tileFailed: "onTileFailed",
  tileLoad: "onTileLoad",
  tileUnload: "onTileUnload",
  tileVisible: "onTileVisible",
};

// workaround: any => Cesium.3DTileset
const Cesium3DTileset = createCesiumComponent<any, Cesium3DTilesetProps, Cesium3DTilesetContext>({
  name: "Cesium3DTileset",
  create(cprops, props) {
    const pointCloudShading =
      props.pointCloudShading instanceof (Cesium as any).PointCloudShading
        ? {
            attenuation: props.pointCloudShading.attenuation,
            geometricErrorScale: props.pointCloudShading.geometricErrorScale,
            maximumAttenuation: props.pointCloudShading.maximumAttenuation,
            baseResolution: props.pointCloudShading.baseResolution,
            eyeDomeLighting: props.pointCloudShading.eyeDomeLighting,
            eyeDomeLightingStrength: props.pointCloudShading.eyeDomeLightingStrength,
            eyeDomeLightingRadius: props.pointCloudShading.eyeDomeLightingRadius,
          }
        : props.pointCloudShading;

    const c3ts = new (Cesium as any).Cesium3DTileset({ ...cprops, pointCloudShading });
    c3ts.colorBlendAmount = cprops.colorBlendAmount;
    c3ts.colorBlendMode = cprops.colorBlendMode;
    return c3ts;
  },
  mount(element, context) {
    console.log("mounted", element);
    context.primitiveCollection.add(element);
  },
  unmount(element, context) {
    context.primitiveCollection.remove(element);
    if (!element.isDestroyed()) {
      element.destroy();
    }
  },
  update(element, props, prevProps) {
    if (prevProps.pointCloudShading !== props.pointCloudShading) {
      if (!props.pointCloudShading) {
        element.pointCloudShading = new (Cesium as any).PointCloudShading();
      } else if (!(props.pointCloudShading instanceof (Cesium as any).PointCloudShading)) {
        element.pointCloudShading = new (Cesium as any).PointCloudShading(props.pointCloudShading);
      } else {
        element.pointCloudShading = props.pointCloudShading;
      }
    }
  },
  cesiumProps,
  cesiumEventProps,
});

export default Cesium3DTileset;
