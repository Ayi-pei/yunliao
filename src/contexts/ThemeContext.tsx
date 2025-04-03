import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from '@/src/adapters/SecureStoreBridge';
import { APP_CONSTANTS } from '@/src/constants';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const colorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeType>(colorScheme as ThemeType || 'light');
    const [notificationsEnabled, setNotificationsEnabledState] = useState(true);

    // 加载保存的主题和通知设置
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedTheme = await SecureStore.getItemAsync(APP_CONSTANTS.STORAGE_KEYS.THEME);
                if (savedTheme) {
                    setThemeState(savedTheme as ThemeType);
                }

                const notificationsValue = await SecureStore.getItemAsync(APP_CONSTANTS.STORAGE_KEYS.NOTIFICATIONS);
                if (notificationsValue !== null) {
                    setNotificationsEnabledState(notificationsValue === 'true');
                }
            } catch (error) {
                console.error('加载设置失败:', error);
            }
        };

        loadSettings();
    }, []);

    // 保存主题设置
    const setTheme = async (newTheme: ThemeType) => {
        try {
            await SecureStore.setItemAsync(APP_CONSTANTS.STORAGE_KEYS.THEME, newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('保存主题设置失败:', error);
        }
    };

    // 保存通知设置
    const setNotificationsEnabled = async (enabled: boolean) => {
        try {
            await SecureStore.setItemAsync(APP_CONSTANTS.STORAGE_KEYS.NOTIFICATIONS, String(enabled));
            setNotificationsEnabledState(enabled);
        } catch (error) {
            console.error('保存通知设置失败:', error);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                notificationsEnabled,
                setNotificationsEnabled,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme必须在ThemeProvider中使用');
    }
    return context;
}; 