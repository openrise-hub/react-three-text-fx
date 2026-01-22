declare module 'three/examples/jsm/loaders/FontLoader.js' {
  import type { Loader } from 'three';
  import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
  export class FontLoader extends Loader {
    load(
      url: string,
      onLoad: (font: Font) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(json: unknown): Font;
  }
  export type Font = {
    data: unknown;
  };
}

declare module 'three/examples/jsm/geometries/TextGeometry.js' {
  import type { ExtrudeGeometry, Font, TextGeometryParameters } from 'three';
  export class TextGeometry extends ExtrudeGeometry {
    constructor(text: string, parameters: TextGeometryParameters & { font: Font });
  }
}
