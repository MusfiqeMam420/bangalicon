import * as React from "react";

declare const WarningCircle: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default WarningCircle;
