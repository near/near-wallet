import React from 'react';

import FailedToLoad from '../../images/failed_to_load.svg';

export function NFTMedia({ mediaUrl, autoPlay = false }) {
    const isVideo = !!mediaUrl && mediaUrl.match(/\.webm$/i);

    return (
        <>
            {isVideo ? (
                <video muted={true} loop controls autoPlay={autoPlay}>
                    <source
                        src={mediaUrl}
                        type="video/webm"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentElement.setAttribute(
                                'poster',
                                FailedToLoad
                            );
                        }}
                    />
                </video>
            ) : (
                <img
                    alt="NFT"
                    src={mediaUrl}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FailedToLoad;
                    }}
                />
            )}
        </>
    );
}
