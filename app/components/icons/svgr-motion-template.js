/**
 * 
 * Usage:
 *        npx @svgr/cli ./ --template svgr-motion-template.js --out-dir ./ --ext tsx --no-svgo
 * 
 * ** Then change svg to motion.svg in the jsx.
 * ** Then add props type as SVGMotionProps<SVGSVGElement> to the generated component.
 */
module.exports = (
  { imports, interfaces, componentName, props, jsx, exports },
  { tpl }
) => {
  let jsxString = jsx;
  // Generate final component
  return tpl`
${imports}
import { motion, SVGMotionProps } from "motion/react";

${interfaces}

const ${componentName} = (${props}) => (
  ${jsxString}
);

${componentName}.displayName = "${componentName}";

${exports}
  `;
};
