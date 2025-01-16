import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DraggableFlatList, { 
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

interface DragDropCodeProps {
  codeLines: string[];
  onOrderChange: (newOrder: string[]) => void;
}

export default function DragDropCode({ codeLines, onOrderChange }: DragDropCodeProps) {
  const [data, setData] = useState(codeLines);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<string>) => {
    return (
      <ScaleDecorator>
        <View 
          style={[
            styles.dragItem,
            { backgroundColor: isActive ? '#E3E3E3' : '#F5F5F5' }
          ]}
          onLongPress={drag}
        >
          <Text>{item}</Text>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => {
          setData(data);
          onOrderChange(data);
        }}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dragItem: {
    padding: 16,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
}); 