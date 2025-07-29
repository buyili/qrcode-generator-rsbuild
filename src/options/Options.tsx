import React from 'react';
import './Options.css';
import SwitchSkipBookmarkearthExternalLink from './views/SwitchSkipBookmarkearthExternalLink';

const Options: React.FC = () => {
  return <div className="OptionsContainer">
    <div>
      <label htmlFor="">跳过<a href='https://bookmarkearth.cn/' target='_blank'>书签地球</a>外链提示：</label>
      <SwitchSkipBookmarkearthExternalLink />
    </div>
  </div>;
};

export default Options;
