import * as React from "react";

declare const LightBulb: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default LightBulb;
