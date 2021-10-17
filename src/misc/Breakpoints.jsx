import React from 'react';
import ReactBreakpoints, { withBreakpoints } from 'react-breakpoints';

const breakpoints = {
    mobile: 320,
    mobileLandscape: 480,
    tablet: 768,
    tabletLandscape: 1024,
    desktop: 1200,
    desktopLarge: 1500,
    desktopWide: 1920,
};

function Breakpoints({ children }) {
    return (
        <ReactBreakpoints breakpoints={breakpoints}>
            {children}
        </ReactBreakpoints>
    );
}

export default withBreakpoints(Breakpoints);