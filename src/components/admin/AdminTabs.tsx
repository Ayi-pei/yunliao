import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../constants';

// 选项卡定义
export interface TabItem {
    key: string;
    title: string;
    icon: any; // 简化为任意React组件
}

// 选项卡组件属性
interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChangeTab: (tabKey: string) => void;
}

// 选项卡组件
export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChangeTab }) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {tabs.map(tab => {
                    const isActive = tab.key === activeTab;
                    const Icon = tab.icon;

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, isActive && styles.activeTab]}
                            onPress={() => onChangeTab(tab.key)}
                            activeOpacity={0.7}
                        >
                            <Icon
                                size={20}
                                color={isActive ? COLORS.primary : COLORS.text}
                                style={styles.icon}
                            />
                            <Text style={[styles.title, isActive && styles.activeTitle]}>
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: 'white',
    },
    scrollContent: {
        paddingHorizontal: 8,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#F0F7FF',
    },
    icon: {
        marginRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    activeTitle: {
        color: '#007AFF',
        fontWeight: '600',
    },
}); 