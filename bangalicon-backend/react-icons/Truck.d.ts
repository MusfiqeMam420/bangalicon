import * as React from "react";

declare const Truck: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default Truck;
