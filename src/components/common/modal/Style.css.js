import styled from 'styled-components';

const Style = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: 0.3s;
    z-index: 2000;
    max-width: ${props => {
        switch (props.modalSize) {
            case 'lg': return '800'; 
            case 'sm': return '400'; 
            case 'xs': return '300'; 
            default: return '650';
        }
    }}px;
    margin: 40px auto;

    &.fade-in {
        opacity: 1;
        transition: 0.3s;

        .modal {
            transform: translateY(-16px);
        }
    }

    &.fade-out {
        opacity: 0;
        transition: 0.3s;
    }

    .background {
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        z-index: 1040;
        display: block;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        outline: 0;
    }

    .modal {
        z-index: 1050;
        width: 100%;
        background-color: white;
        border-radius: 6px;
        transition: 0.3s;
        padding: 25px;
        position: relative;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }
`;

export default Style;