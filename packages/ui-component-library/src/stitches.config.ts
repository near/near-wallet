import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react'

export const {
    config,
    createTheme,
    css,
    getCssText,
    globalCss,
    keyframes,
    styled,
    theme,
} = createStitches({})

export type CSS = Stitches.CSS<typeof config>;