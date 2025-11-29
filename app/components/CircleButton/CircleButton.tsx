import React, { CSSProperties, ReactNode, use, useMemo } from 'react';
import clsx from 'clsx';
import Tooltip from '../tooltip';
import './CircleButton.scss';

interface CircleButtonProps {
  link?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
  size?: number;
  tooltip?: string;
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
  children,
  isAnimated = true,
}) => {
  const combinedClassName = clsx('circle-button', className, { 'circle-button-animated': isAnimated });
  const sizeStyle = { width: `${size}rem`, height: `${size}rem` };
  const buttonStyle = { ...sizeStyle, ...style };

  const id = useMemo(() => {
    return `tooltip-${Math.random().toString(36).substring(2, 9)}-${tooltip}`;
  }, [tooltip]);

  return (
    <>
      {link ? (
        <a
          href={link}
          target={target}
          onClick={onClick}
          className={combinedClassName}
          style={buttonStyle}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          aria-label={tooltip}
          data-tooltip-id={id}
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
          data-tooltip-id={id}
        >
          {children}
        </button>
      )}
      {tooltip && (
        <Tooltip
          id={id}
          place="top"
        >
          {tooltip}
        </Tooltip>
      )}
    </>
  );
};

export default CircleButton;