import * as React from "react";

declare const ViewGrid: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default ViewGrid;
