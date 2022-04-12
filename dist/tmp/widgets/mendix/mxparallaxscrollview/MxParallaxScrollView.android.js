import React, { createElement } from 'react';
import { Animated, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

class ParallaxScrollView extends React.Component {
    constructor(props) {
        super(props);
        this._animatedValue = new Animated.Value(0);
        this.onScroll = ({ value }) => {
            const { onScroll, onSticky, stickyHeaderHeight } = this.props;
            if (typeof onScroll === 'function') {
                onScroll(value);
            }
            if (typeof onSticky === 'function') {
                onSticky(value >= stickyHeaderHeight);
            }
        };
        this._animatedValue.addListener(this.onScroll);
    }
    get stickyMarginTop() {
        const { parallaxHeaderHeight = 0, stickyHeaderHeight = 0 } = this.props;
        return Math.abs(parallaxHeaderHeight - stickyHeaderHeight);
    }
    renderFixedHeader() {
        console.log('ParallaxScrollView renderFixedHeader');
        const { fixedHeader } = this.props;
        if (typeof fixedHeader !== 'function') {
            return null;
        }
        return (createElement(View, { style: Styles$1(this.props).fixedHeader }, fixedHeader(this._animatedValue, this.props.styleProps)));
    }
    renderStickyHeader() {
        console.log('ParallaxScrollView renderStickyHeader');
        const { stickyHeader } = this.props;
        if (typeof stickyHeader !== 'function') {
            return null;
        }
        return stickyHeader(this._animatedValue, this.props.styleProps);
    }
    renderParallaxHeader() {
        const { parallaxHeader, scaleParallaxHeader, parallaxHeaderHeight, } = this.props;
        if (typeof parallaxHeader !== 'function') {
            return null;
        }
        let animationStyle = null;
        if (scaleParallaxHeader) {
            const scaleValue = 5;
            const scale = this._animatedValue.interpolate({
                inputRange: [-parallaxHeaderHeight, 0],
                outputRange: [scaleValue * 1.5, 1],
                extrapolate: 'clamp',
            });
            this.opacity = this._animatedValue.interpolate({
                inputRange: [0, 0.85 * parallaxHeaderHeight],
                outputRange: [1, 0],
                extrapolate: 'clamp'
            });
            animationStyle = {
                transform: [{ scale }, {
                        translateY: this._animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.5]
                        })
                    }],
            };
        }
        return (createElement(View, null,
            createElement(Animated.View, { style: [
                    Styles$1(this.props).parallaxHeader,
                    animationStyle,
                    { height: parallaxHeaderHeight },
                    { opacity: this.opacity }
                ] },
                createElement(View, { style: { zIndex: 2 } }, parallaxHeader(this._animatedValue, this.props.styleProps)))));
    }
    render() {
        const { children, onRef, ...props } = this.props;
        const event = Animated.event([
            {
                nativeEvent: {
                    contentOffset: {
                        y: this._animatedValue,
                    },
                },
            },
        ], { useNativeDriver: true });
        return (createElement(View, { style: { flex: 1 } },
            createElement(Animated.ScrollView, { ref: onRef, ...props, onScroll: event, stickyHeaderIndices: [2] },
                this.renderParallaxHeader(),
                createElement(View, { style: { marginTop: this.stickyMarginTop, height: 1, zIndex: 1 } }),
                this.renderStickyHeader(),
                children),
            this.renderFixedHeader()));
    }
}
ParallaxScrollView.defaultProps = {
    scaleParallaxHeader: true,
};
const Styles$1 = (prop) => StyleSheet.create({
    fixedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: prop.fixedHeaderHeight
    },
    parallaxHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 0
    },
});

class MxParallaxScrollView extends React.Component {
    constructor() {
        super(...arguments);
        this.renderParallaxHeader = (_value, _styleProps) => {
            return (createElement(View, null,
                createElement(ScrollView, { nestedScrollEnabled: true, decelerationRate: 0.5 }, this.props.parallaxHeader)));
        };
        this.renderFixedHeader = (_value, styleProps) => {
            return (createElement(View, { style: Styles(styleProps).fixedHeader }, this.props.fixedHeader));
        };
        this.renderStickyHeader = (value, styleProps) => {
            const opacity = value.interpolate({
                inputRange: [0, 150, 200],
                outputRange: [0, 0, 1],
                extrapolate: 'clamp',
            });
            return (createElement(View, { style: Styles(styleProps).stickyHeader },
                createElement(Animated.View, { style: [Styles(styleProps).stickyHeaderBackground, { opacity }] })));
        };
    }
    render() {
        var _a;
        if (((_a = this.props.parallaxHeaderHeight) === null || _a === void 0 ? void 0 : _a.value) === undefined) {
            return null;
        }
        const styleProps = {
            fixedHeaderHeight: this.props.fixedHeaderHeight,
            parallaxHeaderHeight: this.props.parallaxHeaderHeight.value.toNumber(),
            contentHeaderHeight: this.props.contentHeaderHeight
        };
        return (createElement(SafeAreaView, { style: { flex: 1 } },
            createElement(ParallaxScrollView, { style: { flex: 1 }, parallaxHeaderHeight: this.props.parallaxHeaderHeight.value.toNumber(), stickyHeaderHeight: this.props.fixedHeaderHeight, parallaxHeader: this.renderParallaxHeader, fixedHeader: this.renderFixedHeader, stickyHeader: this.renderStickyHeader, styleProps: styleProps },
                createElement(View, { style: Styles(styleProps).content }, this.props.content))));
    }
}
const Styles = (props) => StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    },
    fixedHeader: {
        height: props.fixedHeaderHeight,
        width: '100%',
        justifyContent: 'center',
    },
    stickyHeader: {
        height: props.fixedHeaderHeight,
        width: '100%',
        zIndex: 2
    },
    stickyHeaderBackground: {
        backgroundColor: 'purple',
    },
    content: {
        width: '100%',
        height: 'auto',
        flex: 1
    },
});

export { MxParallaxScrollView };
