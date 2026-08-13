import * as React from "react";

declare const Image: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default Image;
