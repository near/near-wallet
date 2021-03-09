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
            case 'md': return '550';
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
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s, visibility 0.3s;
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
        margin: 14px;
    }

    &.full-screen {
        .modal {
            height: 100%;
            border-radius: 0;
            overflow-y: auto;
            overflow-x: hidden;

            ::-webkit-scrollbar {
                display: none;
            }
        }
    }

    &.tooltip {
        .modal {
            padding: 20px 25px 20px 20px;

            button {
                &.modal-close-btn {
                    top: 10px;
                    right: 10px;
                    min-width: 25px;
                    max-width: 25px;
                    min-height: 25px;
                    max-height: 25px;
        
                    svg {
                        width: 25px;
                        height: 25px;
                    }
                }
            }
        }
    }
`;

export default Style;