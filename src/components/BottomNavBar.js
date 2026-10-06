import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';

const NAV_ITEMS = [
  { name: 'Dashboard', route: 'Main', icon: 'dashboard' },
  { name: 'Assessments', route: 'ChooseSport', icon: 'fitness-center' },
  { name: 'Insights', route: 'OverallProgress', icon: 'psychology' },
  { name: 'Profile', route: 'Profile', icon: 'person' },
];

export default function BottomNavBar({ activeTab, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding, height: 64 + bottomPadding }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.route;
        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => {
              if (!isActive && navigation) {
                navigation.navigate(item.route);
              }
            }}
          >
            <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
              <MaterialIcons
                name={item.icon}
                size={22}
                color={isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant}
              />
            </View>
            <Text
              style={[
                styles.navText,
                isActive ? styles.navTextActive : styles.navTextInactive,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 6,
    zIndex: 999,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.primaryContainer,
  },
  navText: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '700',
    fontFamily: 'Inter_600SemiBold',
  },
  navTextInactive: {
    color: colors.onSurfaceVariant,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});
