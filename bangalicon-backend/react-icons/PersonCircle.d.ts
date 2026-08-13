import * as React from "react";

declare const PersonCircle: React.FC<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export default PersonCircle;
