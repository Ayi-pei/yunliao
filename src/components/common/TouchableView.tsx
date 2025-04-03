import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

interface TouchableViewProps extends ViewProps {
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
}

/**
 * 包装View组件，正确处理pointerEvents
 * 将弃用的props.pointerEvents转换为style.pointerEvents
 */
export const TouchableView: React.FC<TouchableViewProps> = ({
    children,
    style,
    pointerEvents,
    ...props
}) => {
    // 将pointerEvents添加到style对象中，而不是作为props传递
    const combinedStyle = pointerEvents
        ? StyleSheet.compose(style, { pointerEvents })
        : style;

    // 不再将pointerEvents作为props传递给View
    return (
        <View style={combinedStyle} {...props}>
            {children}
        </View>
    );
};

export default TouchableView; 