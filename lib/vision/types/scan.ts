// lib/vision/types/scan.ts

export type Gender = "men" | "women" | "unisex";

export type ConvertedSizes = {
  eu: string;
  us: string;
  uk: string;
  jp: string;
};

export type ScanPipelineState =
  | "warming-up"
  | "detecting-card"
  | "detecting-foot"
  | "measuring"
  | "converting"
  | "done";

/**
 * Standard frame object for the whole vision stack.
 * Everything downstream should use ScanFrame (not raw ImageData).
 */
export type ScanFrame = {
  kind: "imagedata";
  imageData: ImageData;
  width: number;
  height: number;
};

export type MeasurementResult = {
  /** raw measurements (no buffer) */
  lengthMM: number;
  widthMM: number;

  /** scale */
  mmPerPx: number;

  /** applied buffer (mm) */
  bufferMM: number;

  /** buffered measurements */
  lengthMMBuffered: number;
  widthMMBuffered: number;
};

export type ScanPipelineResult = {
  measurement: MeasurementResult;
  sizes: ConvertedSizes;

  /** optional debug payload */
  debug?: Record<string, unknown>;
};

export type PipelineUpdate = (
  state: ScanPipelineState,
  progress: number,
  message?: string
) => void;
