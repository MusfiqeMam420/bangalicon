import * as React from "react";

declare const FormatSize: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default FormatSize;
