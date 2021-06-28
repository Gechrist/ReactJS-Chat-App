import React from 'react';
import ReactAnimatedEllipsis  from 'react-animated-ellipsis';
import {join} from 'lodash';

const TypingIndicator = (props) => {

  const typists = props.typists;

    return (
      <div>
        <p style={{ fontWeight:'bold', textAlign:'center'}}>
          {typists.length === 1? typists[0] + ' replying': join(typists,', ') + ' replying'}
         <ReactAnimatedEllipsis/>
        </p>
      </div>
    )
};



export default TypingIndicator;
