import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/src/constants';

interface SettingItemProps {
    icon: ReactNode;
    label: string;
    value?: string;
    customRight?: ReactNode;
    onPress?: () => void;
    showArrow?: boolean;
    textStyle?: object;
    type?: 'navigate' | 'toggle' | 'default';
}

export const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    label,
    value,
    customRight,
    onPress,
    showArrow = true,
    textStyle,
    type = 'default',
}) => {
    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.settingLeft}>
                {icon}
                <Text style={[styles.settingLabel, textStyle]}>{label}</Text>
            </View>

            <View style={styles.settingRight}>
                {value && <Text style={styles.settingValue}>{value}</Text>}
                {customRight || (showArrow && <ChevronRight size={20} color={COLORS.gray} />)}
            </View>
        </TouchableOpacity>
    );
};

interface SettingGroupProps {
    title: string;
    children: ReactNode;
}

export const SettingGroup: React.FC<SettingGroupProps> = ({ title, children }) => {
    return (
        <View style={styles.settingGroup}>
            <Text style={styles.groupTitle}>{title}</Text>
            <View style={styles.groupContent}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    settingGroup: {
        marginBottom: 24,
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray,
        marginBottom: 8,
        paddingHorizontal: 12,
    },
    groupContent: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 10,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 12,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 16,
        color: COLORS.gray,
        marginRight: 8,
    },
}); 