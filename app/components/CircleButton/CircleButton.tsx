import React, { CSSProperties, ReactNode, use, useMemo } from 'react';
import clsx from 'clsx';
import { PlacesType } from 'react-tooltip';
import { TooltipId } from '../tooltip';
import './CircleButton.scss';

interface CircleButtonProps {
  link?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
  size?: number;
  tooltip?: string;
  tooltipPlacement?: PlacesType;
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
  tooltipPlacement = 'top',
  children,
  isAnimated = true,
}) => {
  const combinedClassName = clsx('circle-button', className, { 'circle-button-animated': isAnimated });
  const sizeStyle = { width: `${size}rem`, height: `${size}rem` };
  const buttonStyle = { ...sizeStyle, ...style };

  return link ? (
    <a
      href={link}
      target={target}
      onClick={onClick}
      className={combinedClassName}
      style={buttonStyle}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      aria-label={tooltip}
      data-tooltip-id={TooltipId}
      data-tooltip-content={tooltip}
      data-tooltip-place={tooltipPlacement}
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
      data-tooltip-id={TooltipId}
      data-tooltip-content={tooltip}
      data-tooltip-place={tooltipPlacement}
    >
      {children}
    </button>
  )
};

export default CircleButton;