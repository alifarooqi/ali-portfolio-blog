import React from 'react';
import CircleButton from '../CircleButton/CircleButton';
import CommonConfig from '../../config/CommonConfig';
import { getIcon, IconKey } from '../icons/Icons';
import './Footer.scss';


const Footer: React.FC = () => (
  <footer className="footer">
    <p>
      Copyright &copy; {new Date().getFullYear()} All rights reserved
    </p>
    <div>
      {CommonConfig.social.map((socialDetails, index) => (
        <CircleButton
          key={`footer-social-${index}`}
          tooltip={socialDetails.name}
          link={socialDetails.link}
          target="_blank"
        >
          {socialDetails.iconKey
            ? getIcon(socialDetails.iconKey)
            : getIcon(socialDetails.name.toLowerCase() as IconKey)}
        </CircleButton>
      ))}
    </div>
  </footer>
);

export default Footer;