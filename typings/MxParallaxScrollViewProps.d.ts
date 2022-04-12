/**
 * This file was generated from MxParallaxScrollView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue } from "mendix";
import { Big } from "big.js";

export interface MxParallaxScrollViewProps<Style> {
    name: string;
    style: Style[];
    fixedHeader?: ReactNode;
    parallaxHeader?: ReactNode;
    content?: ReactNode;
    fixedHeaderHeight: number;
    parallaxHeaderHeight: DynamicValue<Big>;
    contentHeaderHeight: number;
}

export interface MxParallaxScrollViewPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    fixedHeader: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    parallaxHeader: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    content: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    fixedHeaderHeight: number | null;
    parallaxHeaderHeight: string;
    contentHeaderHeight: number | null;
}
