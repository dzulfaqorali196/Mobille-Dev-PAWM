import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import DraggableFlatList, { 
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

interface DragDropCodeProps {
  items: string[];
  onChange?: (items: string[]) => void;
  disabled?: boolean;
  onSubmit?: (code: string) => void;
  testCases?: { input: string; expected: string }[];
  initialCode?: string;
}

export function DragDropCode({
  items: initialItems,
  onChange,
  disabled,
  onSubmit,
  testCases,
  initialCode,
}: DragDropCodeProps) {
  const [items, setItems] = useState(initialItems);
  const [testResults, setTestResults] = useState<boolean[]>([]);

  const handleDragEnd = ({ data }: { data: string[] }) => {
    setItems(data);
    onChange?.(data);
  };

  const handleSubmit = () => {
    if (!onSubmit) return;

    const code = items.join('\n');
    onSubmit(code);

    // Jika ada test cases, jalankan pengujian
    if (testCases) {
      const results = testCases.map(test => {
        try {
          // Di sini seharusnya menjalankan kode Python
          // Untuk sementara hanya membandingkan string
          const output = code;
          return output.includes(test.expected);
        } catch {
          return false;
        }
      });
      setTestResults(results);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<string>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive || disabled}
          style={[
            styles.dragItem,
            isActive && styles.dragActive,
            disabled && styles.dragDisabled,
          ]}
        >
          <ThemedText style={styles.codeText}>{item}</ThemedText>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <DraggableFlatList
        data={items}
        onDragEnd={handleDragEnd}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderItem}
      />

      {testCases && testResults.length > 0 && (
        <ThemedView style={styles.testResults}>
          <ThemedText style={styles.testTitle}>Hasil Test:</ThemedText>
          {testResults.map((passed, index) => (
            <ThemedView key={index} style={styles.testCase}>
              <IconSymbol
                name={passed ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                size={20}
                color={passed ? '#4CAF50' : '#F44336'}
              />
              <ThemedText style={styles.testText}>
                Test Case {index + 1}: {passed ? 'Berhasil' : 'Gagal'}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {onSubmit && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={disabled}
        >
          <ThemedText style={styles.submitText}>Submit</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  dragItem: {
    padding: 16,
    marginVertical: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  dragActive: {
    backgroundColor: '#333',
  },
  dragDisabled: {
    opacity: 0.5,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  testResults: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  testCase: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 8,
  },
  testText: {
    fontSize: 14,
  },
  submitButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F44336',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 