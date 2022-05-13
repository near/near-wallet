import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    min-width: 100%;
    min-height: 10px;
`;

const Animation = styled.div`
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: skeletonShimmer;
    animation-timing-function: cubic-bezier(.17,.67,.83,.67);
    background: #f4f4f4;
    background: linear-gradient(to right, #f4f4f4 0%, #efeded 50%, #f4f4f4 100%);
    background-size: 200% 100%;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;

    @keyframes skeletonShimmer{
        0%{
            background-position: 100% 0
        }
        100%{
            background-position: -100% 0
        }
    }
`;

type SkeletonLoadingProps = { 
    height:string; 
    padding: string; 
    number: number; 
    show: boolean; 
    className: string; 
}

const SkeletonLoading = ({ height, padding, number, show, className }:SkeletonLoadingProps) => {
    if (show) {
        return (
            Array(number || 1).fill('').map((_: string, i: number) => 
                <div className={className} style={{padding: padding}} key={i}>
                    <Wrapper className='animation-wrapper' style={{height: height}}>
                        <Animation className='animation'/>
                    </Wrapper>
                </div>
            )
        );
    }
    return null;
};

export default SkeletonLoading;
