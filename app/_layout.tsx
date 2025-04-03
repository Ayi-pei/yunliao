import 'react-native-get-random-values';
import React, { useEffect } from 'react';
// @ts-ignore
import { Stack } from 'expo-router';
// @ts-ignore
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AppProvider } from '../src/contexts/AppContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import AuthGuard from '../src/components/auth/AuthGuard';
import { applyNavigationPatches } from '../src/utils/navigationPatch';
import { applyErrorFilters } from '../src/utils/errorFilter';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // 应用导航补丁，消除pointerEvents警告
    applyNavigationPatches();
    // 应用错误过滤器，抑制特定类型的错误和警告
    applyErrorFilters();
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />

      <AuthProvider>
        <AppProvider>
          <ThemeProvider>
            <AuthGuard>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="admin"
                  options={{
                    headerShown: true,
                    title: '管理控制台',
                    headerTitleStyle: {
                      fontFamily: 'Inter_600SemiBold',
                    },
                  }}
                />
              </Stack>
            </AuthGuard>
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}