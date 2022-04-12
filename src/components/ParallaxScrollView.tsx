import React, {
    createElement
} from "react";
import { Animated, View, StyleSheet } from "react-native";

export interface ParallaxScrollViewProps {
    style?: any;
    parallaxHeaderHeight?: any;
    stickyHeaderHeight?: any;
    onScroll?: any;
    onSticky?: any;
    fixedHeader?: any;
    stickyHeader?: any;
    isSectionList?: any;
    parallaxHeader?: any;
    scaleParallaxHeader?: any;
    onRef?: any;
    styleProps?: any;
}

export class ParallaxScrollView extends React.Component<ParallaxScrollViewProps> {
    static defaultProps = {
        scaleParallaxHeader: true,
    };


    _animatedValue = new Animated.Value(0);
    opacity: any;

    constructor(props: any) {
        super(props);

        this._animatedValue.addListener(this.onScroll);
    }

    get stickyMarginTop() {
        const { parallaxHeaderHeight = 0, stickyHeaderHeight = 0 } = this.props;
        return Math.abs(parallaxHeaderHeight - stickyHeaderHeight);
    }


    onScroll = ({ value }: any) => {
        const { onScroll, onSticky, stickyHeaderHeight } = this.props;

        if (typeof onScroll === 'function') {
            onScroll(value);
        }
        if (typeof onSticky === 'function') {
            onSticky(value >= stickyHeaderHeight);
        }
    };

    renderFixedHeader() {
        console.log('ParallaxScrollView renderFixedHeader');
        const { fixedHeader } = this.props;

        if (typeof fixedHeader !== 'function') {
            return null;
        }

        return (
            <View style={Styles(this.props).fixedHeader}>
                {fixedHeader(this._animatedValue, this.props.styleProps)}
            </View>
        );
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
        const {
            parallaxHeader,
            scaleParallaxHeader,
            parallaxHeaderHeight,
        } = this.props;

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

        return (
            <View>
                <Animated.View
                    style={[
                        Styles(this.props).parallaxHeader,
                        animationStyle,
                        { height: parallaxHeaderHeight },
                        { opacity: this.opacity }
                    ]}>
                    <View style={{ zIndex: 2 }}>
                        {parallaxHeader(this._animatedValue, this.props.styleProps)}
                    </View>
                </Animated.View>
            </View>

        );
    }

    render() {
        const { children, onRef, ...props } = this.props;

        const event = Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            y: this._animatedValue,
                        },
                    },
                },
            ],
            { useNativeDriver: true },
        );

        return (
            <View style={{ flex: 1 }}>
                <Animated.ScrollView
                    ref={onRef}
                    {...props}
                    onScroll={event}
                    stickyHeaderIndices={[2]}>
                    {this.renderParallaxHeader()}
                    <View style={{ marginTop: this.stickyMarginTop, height: 1, zIndex: 1 }} />
                    {this.renderStickyHeader()}
                    {children}
                </Animated.ScrollView>
                {this.renderFixedHeader()}
            </View>
        );
    }
}

const Styles = (prop: any) => StyleSheet.create({
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

export default ParallaxScrollView;