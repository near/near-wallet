<<<<<<< HEAD
import React from 'react'
import styled from 'styled-components'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
=======
import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import styled from 'styled-components';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

const StyledLoader = styled.div`
    top:44px;
    right:10px;
    position: absolute;
<<<<<<< HEAD
`
=======
`;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

function Loader({ onRefreshMultiplier }) {
  return (
    <StyledLoader>
         <CountdownCircleTimer
            size={20}
            strokeWidth={2}
            isPlaying
            duration={30}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
            onComplete={() => {
<<<<<<< HEAD
                onRefreshMultiplier()
                return { shouldRepeat: true, delay: 2 } 
              }}
        />
    </StyledLoader>
  )
}

export default Loader
=======
                onRefreshMultiplier();
                return { shouldRepeat: true, delay: 2 }; 
              }}
        />
    </StyledLoader>
  );
}

export default Loader;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
