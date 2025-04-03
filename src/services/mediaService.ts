// @ts-ignore
import * as FileSystem from 'expo-file-system';
// @ts-ignore
import * as MediaLibrary from 'expo-media-library';
// @ts-ignore
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { generateId } from '@/src/types';

// 媒体文件类型
export type MediaType = 'image' | 'audio' | 'video' | 'document';

// 媒体文件信息
export interface MediaFile {
  id: string;
  uri: string;
  type: MediaType;
  name: string;
  size: number;
  mimeType: string;
  duration?: number; // 音频或视频的持续时间（毫秒）
  localPath?: string; // 本地存储路径
  isUploaded: boolean; // 是否已上传到服务器
}

// 语音录制状态
export interface RecordingState {
  isRecording: boolean;
  duration: number;
  recordingUri?: string;
}

// 初始录制状态
export const initialRecordingState: RecordingState = {
  isRecording: false,
  duration: 0,
};

// 音频录制对象
let recording: Audio.Recording | null = null;
// 录制定时器
let recordingTimer: NodeJS.Timeout | null = null;

/**
 * 开始录制语音消息
 * @returns Promise<RecordingState>
 */
export const startRecording = async (): Promise<RecordingState> => {
  try {
    // 检查权限
    const permission = await Audio.requestPermissionsAsync();
    
    if (permission.status !== 'granted') {
      throw new Error('需要麦克风权限才能录制语音');
    }
    
    // 配置音频会话
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    
    // 创建录制对象
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    
    recording = newRecording;
    
    return {
      isRecording: true,
      duration: 0,
    };
  } catch (error) {
    console.error('开始录制时出错:', error);
    throw error;
  }
};

/**
 * 停止录制语音消息
 * @returns Promise<MediaFile>
 */
export const stopRecording = async (): Promise<MediaFile> => {
  try {
    if (!recording) {
      throw new Error('没有进行中的录音');
    }
    
    // 停止录制
    await recording.stopAndUnloadAsync();
    
    // 获取录制状态
    const status = await recording.getStatusAsync();
    
    // 获取录制文件URI
    const uri = recording.getURI();
    
    if (!uri) {
      throw new Error('录音URI为空');
    }
    
    // 获取文件信息
    const fileInfo = await FileSystem.getInfoAsync(uri);
    
    // 创建本地存储路径
    const audioDirectory = `${FileSystem.documentDirectory}audios/`;
    const directoryInfo = await FileSystem.getInfoAsync(audioDirectory);
    
    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(audioDirectory, { intermediates: true });
    }
    
    const fileName = `voice_${Date.now()}.m4a`;
    const localPath = `${audioDirectory}${fileName}`;
    
    // 复制录音文件到本地存储
    await FileSystem.copyAsync({
      from: uri,
      to: localPath,
    });
    
    // 重置录制对象
    recording = null;
    
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
    
    // 返回媒体文件信息
    const fileSize = 'size' in fileInfo ? fileInfo.size || 0 : 0;
    
    return {
      id: generateId('MEDIA'),
      uri: localPath,
      type: 'audio',
      name: fileName,
      size: fileSize,
      mimeType: 'audio/m4a',
      duration: status?.durationMillis || 0,
      localPath,
      isUploaded: false,
    };
  } catch (error) {
    console.error('停止录制时出错:', error);
    throw error;
  }
};

/**
 * 播放音频文件
 * @param uri 音频文件URI
 * @returns Promise<void>
 */
export const playAudio = async (uri: string): Promise<void> => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    
    // 播放完成后释放资源
    sound.setOnPlaybackStatusUpdate((playbackStatus: any) => {
      if ('didJustFinish' in playbackStatus && playbackStatus.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('播放音频时出错:', error);
    throw error;
  }
};

/**
 * 从媒体库选择图片
 * @returns Promise<MediaFile | null>
 */
export const pickImage = async (): Promise<MediaFile | null> => {
  try {
    // 实际应用中需要使用expo-image-picker或react-native-image-picker库
    // 这里仅提供实现思路
    throw new Error('此功能需要集成expo-image-picker库');
    
    /*
    // 示例代码:
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (result.cancelled) {
      return null;
    }
    
    const fileInfo = await FileSystem.getInfoAsync(result.uri);
    
    return {
      id: generateId('MEDIA'),
      uri: result.uri,
      type: 'image',
      name: result.uri.split('/').pop() || `image_${Date.now()}.jpg`,
      size: fileInfo.size || 0,
      mimeType: 'image/jpeg',
      isUploaded: false,
    };
    */
  } catch (error) {
    console.error('选择图片时出错:', error);
    throw error;
  }
};

/**
 * 上传媒体文件到服务器
 * @param file 媒体文件信息
 * @returns Promise<string> 上传后的URL
 */
export const uploadMediaFile = async (file: MediaFile): Promise<string> => {
  try {
    // 实际应用中需要实现文件上传逻辑
    // 这里仅提供实现思路
    
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 返回模拟的URL
    const timestamp = Date.now();
    const serverUrl = `https://example.com/media/${file.type}s/${timestamp}_${file.name}`;
    
    // 更新本地文件状态为已上传
    file.isUploaded = true;
    
    return serverUrl;
  } catch (error) {
    console.error('上传媒体文件时出错:', error);
    throw error;
  }
};

/**
 * 下载媒体文件到本地
 * @param url 媒体文件URL
 * @param type 媒体类型
 * @returns Promise<MediaFile>
 */
export const downloadMediaFile = async (
  url: string, 
  type: MediaType
): Promise<MediaFile> => {
  try {
    // 创建本地存储路径
    const directory = `${FileSystem.documentDirectory}${type}s/`;
    const directoryInfo = await FileSystem.getInfoAsync(directory);
    
    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
    
    // 提取文件名
    const fileName = url.split('/').pop() || `${type}_${Date.now()}`;
    const localPath = `${directory}${fileName}`;
    
    // 下载文件
    const downloadResult = await FileSystem.downloadAsync(url, localPath);
    
    // 获取MIME类型
    let mimeType = '';
    
    switch (type) {
      case 'image':
        mimeType = 'image/jpeg';
        break;
      case 'audio':
        mimeType = 'audio/m4a';
        break;
      case 'video':
        mimeType = 'video/mp4';
        break;
      case 'document':
        mimeType = 'application/pdf';
        break;
    }
    
    // 返回媒体文件信息
    return {
      id: generateId('MEDIA'),
      uri: localPath,
      type,
      name: fileName,
      size: downloadResult.headers['content-length'] 
        ? parseInt(downloadResult.headers['content-length']) 
        : 0,
      mimeType,
      localPath,
      isUploaded: true,
    };
  } catch (error) {
    console.error('下载媒体文件时出错:', error);
    throw error;
  }
};

/**
 * 保存媒体文件到设备相册
 * @param mediaFile 媒体文件信息
 * @returns Promise<boolean>
 */
export const saveMediaToLibrary = async (mediaFile: MediaFile): Promise<boolean> => {
  try {
    // 检查权限
    const permission = await MediaLibrary.requestPermissionsAsync();
    
    if (permission.status !== 'granted') {
      throw new Error('需要存储权限才能保存媒体文件');
    }
    
    // 保存到相册
    if (mediaFile.type === 'image' || mediaFile.type === 'video') {
      await MediaLibrary.saveToLibraryAsync(mediaFile.uri);
      return true;
    } else if (mediaFile.type === 'audio') {
      // 音频文件处理（不同平台可能需要不同处理）
      if (Platform.OS === 'ios') {
        await MediaLibrary.saveToLibraryAsync(mediaFile.uri);
      } else {
        // Android可能需要先创建Asset
        const asset = await MediaLibrary.createAssetAsync(mediaFile.uri);
        await MediaLibrary.createAlbumAsync('ChatApp', asset, false);
      }
      return true;
    } else {
      throw new Error(`不支持保存${mediaFile.type}类型的文件到媒体库`);
    }
  } catch (error) {
    console.error('保存媒体文件到设备相册时出错:', error);
    throw error;
  }
}; 