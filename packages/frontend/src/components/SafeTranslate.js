import escapeHtml from 'escape-html';
import isArray from 'lodash.isarray';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import mapValues from 'lodash.mapvalues';
import React from 'react';
import { Translate } from 'react-localize-redux';

function processDataValue(value) {
    // 99% of the time we'll just have a single `data` string
    if (isString(value)) {
        console.log('processing string', value);
        return escapeHtml(value);
    }

    // Sometimes we may have a hashmap containing multiple variables to interpolate
    if (isPlainObject(value)) {
        console.log('processing object', value);
        return mapValues(value, (v) => processDataValue(v));
    }

    // Otherwise we're gonna leave it well enough alone
    if (isArray(value)) {
        return processDataValue(value);
    }

    return value;
}

export default function SafeTranslate({ children, ...origProps }) {
    const props = {
        ...origProps,
        data: processDataValue(origProps.data)
    };

    return (
        <Translate {...props}>
            {children}
        </Translate>
    );
}