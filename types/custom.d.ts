declare module 'react-native-safe-area-context';
declare module '@expo-google-fonts/inter';
declare module 'lucide-react-native';
declare module 'expo-image-picker';
declare module 'expo-document-picker';
declare module 'expo-haptics';
declare module 'expo-clipboard';

// 为react-native-svg添加类型声明
declare module 'react-native-svg' {
    import React from 'react';
    import { ViewProps } from 'react-native';

    export interface SvgProps extends ViewProps {
        width?: number | string;
        height?: number | string;
        viewBox?: string;
        fill?: string;
        stroke?: string;
        color?: string;
        strokeWidth?: number;
        strokeLinecap?: 'butt' | 'round' | 'square';
        strokeLinejoin?: 'miter' | 'round' | 'bevel';
    }

    export interface PathProps extends SvgProps {
        d: string;
    }

    export class Svg extends React.Component<SvgProps> { }
    export class Path extends React.Component<PathProps> { }
    export class Circle extends React.Component<SvgProps & { cx?: number | string; cy?: number | string; r?: number | string }> { }
    export class Rect extends React.Component<SvgProps & { x?: number | string; y?: number | string; width?: number | string; height?: number | string; rx?: number | string; ry?: number | string }> { }
    export class G extends React.Component<SvgProps> { }
    export class Text extends React.Component<SvgProps & { x?: number | string; y?: number | string; textAnchor?: string }> { }
    export class TSpan extends React.Component<SvgProps & { x?: number | string; y?: number | string }> { }
    export class Line extends React.Component<SvgProps & { x1?: number | string; y1?: number | string; x2?: number | string; y2?: number | string }> { }

    export default Svg;
}

// 明确声明expo-router模块及其常用导出
declare module 'expo-router' {
    import { ComponentType } from 'react';

    export const useRouter: () => {
        push: (route: string) => void;
        replace: (route: string) => void;
        back: () => void;
        navigate: (route: string) => void;
    };

    export const Slot: ComponentType<any>;
    export const Stack: {
        Screen: ComponentType<any>;
    } & ComponentType<any>;
    export const Tabs: {
        Screen: ComponentType<any>;
    } & ComponentType<any>;
    export const Link: ComponentType<any>;
    export const router: {
        push: (route: string) => void;
        replace: (route: string) => void;
        back: () => void;
        navigate: (route: string) => void;
    };
}

// 明确声明expo-secure-store模块
declare module 'expo-secure-store' {
    export function getItemAsync(key: string, options?: any): Promise<string | null>;
    export function setItemAsync(key: string, value: string, options?: any): Promise<void>;
    export function deleteItemAsync(key: string, options?: any): Promise<void>;
    export function isAvailableAsync(): Promise<boolean>;

    export const AFTER_FIRST_UNLOCK: string;
    export const AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: string;
    export const WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: string;
    export const WHEN_UNLOCKED: string;
    export const WHEN_UNLOCKED_THIS_DEVICE_ONLY: string;

    export interface SecureStoreOptions {
        keychainService?: string;
        keychainAccessible?: string;
    }
}

declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}

declare module '*.png' {
    const value: any;
    export default value;
}

declare module '*.jpg' {
    const value: any;
    export default value;
}

declare module '*.json' {
    const value: any;
    export default value;
} 