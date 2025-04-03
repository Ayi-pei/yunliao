import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface CheckIconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

/**
 * 自定义对勾图标组件
 * 使用SVG路径绘制对勾图标
 */
const CheckIcon: React.FC<CheckIconProps> = ({
    size = 24,
    color = '#34C759',
    strokeWidth = 2
}) => {
    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M18 6 7 17l-5-5"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </View>
    );
};

export default CheckIcon; 