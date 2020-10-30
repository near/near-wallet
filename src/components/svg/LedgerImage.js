import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.svg`
    .checkmark {
        opacity: 1;
    }

    &.animate {
        @keyframes pulse {
            0% {r: 0px;}
            16% {r:20.6228px;}
            20% {r: 9px; opacity: 0;}
            100% {r: 9px; opacity: 0;}
        }
    
        .circles {
            animation-name: pulse;
            animation-duration: 5s;
            animation-fill-mode: forwards;
            animation-delay: 0.5s;
            animation-iteration-count: infinite;
        }

        @keyframes show {
            0% {opacity: 0;}
            20% {opacity: 1;}
            100% {opacity: 1;}
        }

        .checkmark {
            animation-name: show;
            animation-duration: 5s;
            animation-fill-mode: forwards;
            animation-delay: 0.5s;
            animation-iteration-count: infinite;
        }
    }
`

const LedgerImage = ({ animate }) => {
    const [id, setId] = useState();

    useEffect(() => {setId(Math.floor(Math.random() * 100))}, []);

    return (
        <Container width="259" height="111" viewBox="0 0 259 111" fill="none" xmlns="http://www.w3.org/2000/svg" className={animate ? 'animate' : ''}>
            <rect x="68.9618" y="68.9619" width="120.877" height="34.8683" rx="2" fill="#3E3E3E"/>
            <rect x="83.684" y="76.7104" width="57.339" height="19.3713" rx="2" fill="#0E0E0E"/>
            <path d="M53.4647 80.26C53.4647 79.1554 54.3602 78.26 55.4647 78.26H68.9617V94.5319H55.4647C54.3602 94.5319 53.4647 93.6365 53.4647 92.5319V80.26Z" fill="#0E0E0E"/>
            <path d="M83.684 67.8624C83.684 66.7579 84.5794 65.8624 85.684 65.8624H97.181C98.2856 65.8624 99.181 66.7579 99.181 67.8624V68.9618H83.684V67.8624Z" fill="#0E0E0E"/>
            <path d="M125.526 67.8624C125.526 66.7579 126.421 65.8624 127.526 65.8624H139.023C140.127 65.8624 141.023 66.7579 141.023 67.8624V68.9618H125.526V67.8624Z" fill="#0E0E0E"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M160.324 73.145C153.516 79.9534 153.516 90.9921 160.324 97.8006C167.133 104.609 178.172 104.609 184.98 97.8006L256.711 26.0698C257.492 25.2888 257.492 24.0224 256.711 23.2414L234.884 1.41418C234.103 0.633134 232.836 0.633135 232.055 1.41418L160.324 73.145ZM180.049 91.7737C183.831 87.9912 183.831 81.8586 180.049 78.0761C176.267 74.2936 170.134 74.2936 166.351 78.0761C162.569 81.8586 162.569 87.9912 166.351 91.7737C170.134 95.5561 176.267 95.5561 180.049 91.7737Z" fill="#DDDDDD"/>
            <circle cx="173.2" cy="84.9249" r="9.73534" transform="rotate(-45 173.2 84.9249)" fill="white" stroke="#313131" strokeWidth="3"/>
            <rect y="85.2336" width="53.4647" height="2.32455" fill={`url(#gradient${id})`}/>
            <circle opacity="0.3" cx="91.4325" cy="67.4121" r='0' fill="#0072CE" className='circles'/>
            <circle opacity="0.3" cx="133.274" cy="67.4121" r='0' fill="#0072CE" className='circles'/>
            <path d="M117.333 83L110 90.3333L106.667 87" stroke="#8FD6BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='checkmark'/>
            <defs>
                <linearGradient id={`gradient${id}`} x1="53.4647" y1="86.3959" x2="0.387428" y2="86.3959" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0E0E0E"/>
                <stop offset="1" stopColor="#0E0E0E" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </Container>

    )
}

export default LedgerImage;
