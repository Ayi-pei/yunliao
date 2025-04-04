// 声明expo/tsconfig.base模块
declare module 'expo/tsconfig.base' {
  const config: {
    compilerOptions: {
      target: string;
      module: string;
      moduleResolution: string;
      esModuleInterop: boolean;
      skipLibCheck: boolean;
      jsx: string;
      strict: boolean;
      forceConsistentCasingInFileNames: boolean;
      noImplicitReturns: boolean;
      noFallthroughCasesInSwitch: boolean;
      allowJs: boolean;
      allowSyntheticDefaultImports: boolean;
      noEmit: boolean;
      incremental: boolean;
    };
  };
  export default config;
} 