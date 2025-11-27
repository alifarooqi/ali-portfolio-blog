import React, { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import Tooltip, { TooltipPlacement } from '../tooltip';
import './CircleButton.scss';

interface CircleButtonProps {
  link?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
  size?: number;
  tooltip?: string;
  tooltipPlacement?: TooltipPlacement;
  children?: ReactNode;
  isAnimated?: boolean;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  link,
  target,
  onClick,
  className,
  style,
  size = 2.5,
  tooltip,
  tooltipPlacement,
  children,
  isAnimated = true,
}) => {
  const combinedClassName = clsx('circle-button', className, { 'circle-button-animated': isAnimated });
  const sizeStyle = { width: `${size}rem`, height: `${size}rem` };
  const buttonStyle = { ...sizeStyle, ...style };

  return (
    <Tooltip title={tooltip} placement={tooltipPlacement} style={sizeStyle} className="circle-button-wrapper">
      {link ? (
        <a
          href={link}
          target={target}
          onClick={onClick}
          className={combinedClassName}
          style={buttonStyle}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          aria-label={tooltip}
        >
          {children}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={combinedClassName}
          style={buttonStyle}
          aria-label={tooltip}
        >
          {children}
        </button>
      )}
    </Tooltip>
  );
};

export default CircleButton;