import styled from 'styled-components';

const PageTheme = styled.div`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 30px 14px 0 14px;
        max-width: 800px;

        @media (min-width: 768px) {
            margin: 30px auto 0 auto;
        }

        h1 {
            text-align: center;

            @media (max-width: 767px) {
                max-width: 264px;
            }
        }

        svg {
            margin: 20px 0;
        }

        p {
            max-width: 445px;

            :first-of-type {
                margin-top: 30px;
            }
        }

        button {
            margin-top: 25px;

            :first-of-type {
                width: 350px;

                @media (max-width: 500px) {
                    width: 100%;
                }
            }
        }
    }
`;

export default PageTheme;