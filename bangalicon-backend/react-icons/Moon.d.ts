import * as React from "react";

declare const Moon: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default Moon;
