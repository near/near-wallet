import React from 'react';
import styled from 'styled-components';

import Banner from './Banner';

const StyledBanner = styled.div`
    .banner-container {
        background-color: #FEF2F2;
        .title, .desc, a {
            color: #DC1F25;
        }
    }

    a {
        font-weight: 700;
        text-decoration: underline;
    }
`;

export default function RemoveLinkRecoveryBanner() {
    return (
        <StyledBanner>
            <Banner
                linkTo='/profile'
                title='removeLinkRecovery.title'
                desc='removeLinkRecovery.desc'
                buttonTitle='removeLinkRecovery.button'
                buttonColor='red'
            />
        </StyledBanner>
    );
};
