import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import styled from 'styled-components';

const StyledLoader = styled.div`
    top: 44px;
    right: 10px;
    position: absolute;
`;

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
                    onRefreshMultiplier();
                    return { shouldRepeat: true, delay: 2 };
                }}
            />
        </StyledLoader>
    );
}

export default Loader;
