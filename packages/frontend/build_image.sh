#!/usr/bin/env bash

LOCAL_IMAGE_NAME="near-wallet"
docker build . -t ${LOCAL_IMAGE_NAME}

echo -n "Publish image to hub (y/n)? "
read answer

if [ "$answer" != "${answer#[Yy]}" ] ;then
    echo -n "Enter semver:"
    read semver
    IMAGE_NAME="nearprotocol/${LOCAL_IMAGE_NAME}:${semver}"
    docker tag ${LOCAL_IMAGE_NAME} ${IMAGE_NAME}
    docker push ${IMAGE_NAME}
else
    exit 0
fi

