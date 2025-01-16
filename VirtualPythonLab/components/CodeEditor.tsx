import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

interface CodeEditorProps {
  code: string;
  onChange?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({
  code: initialCode,
  onChange,
  onRun,
  readOnly = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  const handleChange = (text: string) => {
    setCode(text);
    onChange?.(text);
  };

  const handleRun = () => {
    onRun?.(code);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.toolbar}>
        <ThemedText style={styles.title}>Python Editor</ThemedText>
        <ThemedView style={styles.actions}>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={() => handleChange('')}
            disabled={readOnly}
          >
            <IconSymbol name="trash" size={20} color="#F44336" />
          </TouchableOpacity>
          {onRun && (
            <TouchableOpacity 
              style={[styles.toolbarButton, styles.runButton]}
              onPress={handleRun}
            >
              <IconSymbol name="play.fill" size={20} color="#fff" />
              <ThemedText style={styles.runButtonText}>Run Code</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>

      <TextInput
        style={styles.editor}
        value={code}
        onChangeText={handleChange}
        multiline
        numberOfLines={10}
        editable={!readOnly}
        placeholder="Write your Python code here..."
        placeholderTextColor="#666"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolbarButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
  },
  runButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  editor: {
    backgroundColor: '#282a36',
    color: '#fff',
    padding: 16,
    minHeight: 200,
    fontFamily: 'monospace',
    fontSize: 14,
    textAlignVertical: 'top',
  },
}); 