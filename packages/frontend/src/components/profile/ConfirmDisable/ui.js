import styled from 'styled-components';

export const Container = styled.form`
    &&& {
        border: 2px solid #FF585D;
        border-radius: 8px;
        margin: -21px;
        padding: 15px 20px;
        color: #24272a;

        div {
            :nth-child(1) {
                font-weight: 600;
                margin-bottom: 10px;
            }
        }

        .buttons {
            margin-top: 10px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
        }

        button {
            margin-top: 0;
        }

        .red {
            padding: 5px 15px;
            width: 155px;
        }
    
        .link {
            color: #999;
            margin-left: 15px;
            padding: 5px;
        }
    }
`;
