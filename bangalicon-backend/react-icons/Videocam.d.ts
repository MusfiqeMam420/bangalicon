import * as React from "react";

declare const Videocam: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default Videocam;
