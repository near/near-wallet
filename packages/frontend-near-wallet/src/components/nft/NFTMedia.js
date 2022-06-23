import React, { useMemo } from 'react';

import FailedToLoad from '../../images/failed_to_load.svg';

export function NFTMedia({ mediaUrl, autoPlay = false }) {
    const [isVideo, mimeType] = useMemo(() => {
        let mimeType;
        // check mediaUrl string for .webm or .mp4 endings (case-insensitive)
        if (mediaUrl.match(/\.webm$/i)) mimeType = 'webm';
        else if (mediaUrl.match(/\.mp4$/i)) mimeType = 'mp4';
        // if there is a mediaUrl and a truthy mimeType (webm or mp4), we have a video
        const isVideo = !!mediaUrl && mimeType;
        return [isVideo, mimeType];
    }, [mediaUrl]);

    return (
        <>
            {isVideo ? (
                <video muted={true} loop controls autoPlay={autoPlay}>
                    <source
                        src={mediaUrl}
                        type={`video/${mimeType}`}
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
