// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'play.circle.fill': 'play-circle',
  'questionmark.circle.fill': 'help',
  'hammer.circle.fill': 'build-circle',
  'circle.fill': 'circle',
  'book.closed': 'book',
  'book.closed.fill': 'menu-book',
  'clock': 'access-time',
  'clock.fill': 'access-time-filled',
  'star.fill': 'star',
  'line.3.horizontal.decrease.circle.fill': 'filter-list',
  'terminal': 'terminal',
  'trash': 'delete',
  'doc.text': 'description',
  'square.and.arrow.down': 'file-download',
  'square.and.arrow.up': 'file-upload',
  'stop.fill': 'stop',
  'play.fill': 'play-arrow',
  'hand.wave': 'waving-hand',
  'person.circle.fill': 'account-circle',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
