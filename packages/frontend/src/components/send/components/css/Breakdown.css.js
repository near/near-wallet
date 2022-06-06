import styled from 'styled-components';

const Breakdown = styled.div`
    background-color: #FAFAFA;
    border-radius: 8px;

    > div {
        :first-of-type {
            color: #272729;
        }
    }

    .breakdown {
        background-color: #F0F0F1;

        > div {
            > div {
                border-bottom: 1px solid #E5E5E6;

                :last-of-type {
                    border-bottom: 0;
                }
            }
        }
    }
`;

export default Breakdown;
