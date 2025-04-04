import { View, Text, StyleSheet, FlatList, Image, Platform } from 'react-native';
import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  activeChats: number;
  totalResolved: number;
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: '张明',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    status: 'online',
    activeChats: 3,
    totalResolved: 145,
  },
  {
    id: '2',
    name: '王丽',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    status: 'busy',
    activeChats: 5,
    totalResolved: 289,
  },
  {
    id: '3',
    name: '李强',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    status: 'offline',
    activeChats: 0,
    totalResolved: 167,
  },
];

const getStatusColor = (status: Agent['status']) => {
  switch (status) {
    case 'online':
      return '#34C759';
    case 'busy':
      return '#FF9500';
    case 'offline':
      return '#8E8E93';
  }
};

const getStatusText = (status: Agent['status']) => {
  switch (status) {
    case 'online':
      return '在线';
    case 'busy':
      return '忙碌';
    case 'offline':
      return '离线';
  }
};

export default function AgentsScreen() {
  const [agents] = useState<Agent[]>(mockAgents);

  const renderAgentItem = ({ item }: { item: Agent }) => (
    <View style={styles.agentItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
      </View>
      <View style={styles.agentInfo}>
        <Text style={styles.agentName}>{item.name}</Text>
        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.activeChats}</Text>
            <Text style={styles.statLabel}>进行中</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.totalResolved}</Text>
            <Text style={styles.statLabel}>已完成</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={agents}
        renderItem={renderAgentItem}
        keyExtractor={(item: Agent) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    padding: 16,
  },
  agentItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }),
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  statusText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#007AFF',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }),
    elevation: 2,
  },
});