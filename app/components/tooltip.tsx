"use client";

import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'


export default function Tooltip({style = {}, ...props}: React.ComponentProps<typeof ReactTooltip>) {
  return (
    <ReactTooltip style={{ zIndex: 300, ...style }} {...props} />
  );
}
