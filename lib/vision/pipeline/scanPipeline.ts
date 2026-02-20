// lib/vision/pipeline/scanPipeline.ts
import type {
  PipelineUpdate,
  ScanPipelineResult,
  ScanFrame,
} from "@/lib/vision/types/scan";

import {
  DEFAULT_BUFFER_MM,
  convertSizes,
  detectFoot,
  detectReferenceCard,
  measureFoot,
} from "@/lib/vision/pipeline/steps";

export class ScanPipeline {
  private onUpdate?: PipelineUpdate;

  constructor(onUpdate?: PipelineUpdate) {
    this.onUpdate = onUpdate;
  }

  async run(
    frame: ScanFrame,
    opts?: { bufferMM?: number }
  ): Promise<ScanPipelineResult> {
    const bufferMM = opts?.bufferMM ?? DEFAULT_BUFFER_MM;

    this.onUpdate?.("detecting-card", 20, "Detecting reference card…");
    const card = await detectReferenceCard(frame);

    this.onUpdate?.("detecting-foot", 45, "Detecting foot contour…");
    const foot = await detectFoot(frame);

    this.onUpdate?.("measuring", 70, "Measuring length + width…");
    const measurement = await measureFoot({ card, foot, bufferMM });

    this.onUpdate?.("converting", 90, "Converting sizes…");
    const sizes = await convertSizes({
      lengthMMBuffered: measurement.lengthMMBuffered,
    });

    return {
      measurement,
      sizes,
      debug: {
        mmPerPx: measurement.mmPerPx,
      },
    };
  }
}