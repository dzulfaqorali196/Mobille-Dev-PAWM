import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol, IconSymbolName } from '../../components/ui/IconSymbol';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../lib/ThemeContext';

const { width } = Dimensions.get('window');

const DEFAULT_CODE = `# Tulis kode Python Anda di sini
print("Hello, World!")

# Contoh fungsi sederhana
def hitung_luas_persegi(sisi):
    return sisi * sisi

# Mencoba fungsi
sisi = 5
luas = hitung_luas_persegi(sisi)
print(f"Luas persegi dengan sisi {sisi} adalah {luas}")`;

interface Template {
  id: number;
  title: string;
  code: string;
  icon: IconSymbolName;
}

const TEMPLATES: Template[] = [
  {
    id: 1,
    title: 'Hello World',
    code: 'print("Hello, World!")',
    icon: 'play.circle.fill',
  },
  {
    id: 2,
    title: 'Kalkulator',
    code: `def calculator(a, b, op):
    if op == '+':
        return a + b
    elif op == '-':
        return a - b
    elif op == '*':
        return a * b
    elif op == '/':
        return a / b if b != 0 else "Error: Dibagi dengan 0"
    
print(calculator(10, 5, '+'))  # Output: 15`,
    icon: 'hammer.circle.fill',
  },
  {
    id: 3,
    title: 'List Operations',
    code: `numbers = [1, 2, 3, 4, 5]
print("Original:", numbers)
numbers.append(6)
print("After append:", numbers)
numbers.pop()
print("After pop:", numbers)
print("Sum:", sum(numbers))`,
    icon: 'book.closed',
  },
];

export default function CodeScreen() {
  const { colors, isDark } = useTheme();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Inisialisasi WebSocket saat komponen dimount
    connectWebSocket();
    
    return () => {
      // Cleanup WebSocket saat komponen unmount
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    ws.current = new WebSocket('ws://10.43.123.58:8000/ws');
    
    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setOutput('Terhubung ke server Python');
    };
    
    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      let finalOutput = '';
      
      if (response.output) {
        finalOutput += response.output;
      }
      
      if (response.error) {
        finalOutput += '\n\nError:\n' + response.error;
      }
      
      setOutput(finalOutput.trim());
      setIsRunning(false);
    };
    
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setOutput('Error: Tidak dapat terhubung ke server Python (10.43.123.58:8000)');
      setIsRunning(false);
    };
    
    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setOutput('Terputus dari server Python. Mencoba menghubungkan kembali...');
      // Mencoba menghubungkan kembali setelah 3 detik
      setTimeout(connectWebSocket, 3000);
    };
  };

  const handleRunCode = async () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setOutput('Error: Tidak dapat terhubung ke server Python. Mencoba menghubungkan kembali...');
      connectWebSocket();
      return;
    }

    setIsRunning(true);
    setOutput('Menjalankan kode...');
    
    try {
      ws.current.send(code);
    } catch (error: any) {
      setOutput('Error: ' + error.message);
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    Alert.alert('Simpan Kode', 'Kode berhasil disimpan!');
  };

  const handleUseTemplate = (template: typeof TEMPLATES[0]) => {
    setCode(template.code);
    setShowTemplates(false);
    setOutput('');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: isDark ? '#0d1117' : colors.background }]}>
      <ThemedView style={[styles.content, { backgroundColor: isDark ? '#0d1117' : colors.background }]}>
        <ThemedView style={[styles.toolbar, { backgroundColor: isDark ? '#161b22' : colors.card }]}>
          <ThemedView style={[styles.toolbarLeft, { backgroundColor: isDark ? '#161b22' : colors.card }]}>
            <ThemedText style={[styles.title, { color: isDark ? '#58a6ff' : colors.text }]}>Python Editor</ThemedText>
            <ThemedView style={[styles.toolbarActions, { backgroundColor: isDark ? '#161b22' : colors.card }]}>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: isDark ? '#21262d' : colors.background },
                  showTemplates && [styles.actionButtonActive, { borderColor: isDark ? '#58a6ff' : colors.primary }]
                ]} 
                onPress={() => setShowTemplates(!showTemplates)}
              >
                <IconSymbol name="doc.text" size={20} color={isDark ? '#58a6ff' : colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: isDark ? '#21262d' : colors.background }]}
                onPress={handleSaveCode}
              >
                <IconSymbol name="square.and.arrow.down" size={20} color={isDark ? '#58a6ff' : colors.primary} />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity 
            style={[
              styles.runButton, 
              { backgroundColor: isRunning ? '#FF5722' : '#4CAF50' },
              isRunning && styles.runningButton
            ]}
            onPress={handleRunCode}
            disabled={isRunning}
          >
            <IconSymbol 
              name={isRunning ? "stop.fill" : "play.fill"} 
              size={20} 
              color="#0d1117"
            />
            <ThemedText style={[styles.runButtonText, { color: '#0d1117' }]}>
              {isRunning ? 'Running...' : 'Run Code'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={[styles.mainSection, { backgroundColor: isDark ? '#0d1117' : colors.background }]}>
          {showTemplates && (
            <Animated.View 
              entering={FadeIn}
              style={[styles.sidebar, { backgroundColor: isDark ? '#161b22' : colors.card }]}
            >
              <ThemedText style={[styles.sidebarTitle, { color: isDark ? '#8b949e' : `${colors.text}80` }]}>TEMPLATE KODE</ThemedText>
              {TEMPLATES.map(template => (
                <TouchableOpacity
                  key={template.id}
                  style={[styles.templateItem, { backgroundColor: isDark ? '#21262d' : colors.card }]}
                  onPress={() => handleUseTemplate(template)}
                >
                  <IconSymbol name={template.icon} size={20} color={isDark ? '#58a6ff' : colors.primary} />
                  <ThemedText style={[styles.templateItemText, { color: isDark ? '#c9d1d9' : colors.text }]}>{template.title}</ThemedText>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          <ThemedView style={[styles.editorSection, { backgroundColor: isDark ? '#0d1117' : colors.background }]}>
            <ThemedView style={[styles.editorContainer, { 
              backgroundColor: isDark ? '#161b22' : colors.background,
              borderColor: isDark ? '#30363d' : colors.border 
            }]}>
              <TextInput
                style={[styles.editor, { 
                  color: isDark ? '#c9d1d9' : colors.text,
                  backgroundColor: isDark ? '#161b22' : colors.background 
                }]}
                value={code}
                onChangeText={setCode}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                keyboardType="default"
                textAlignVertical="top"
                placeholderTextColor={isDark ? '#8b949e' : `${colors.text}80`}
              />
            </ThemedView>

            <ThemedView style={[styles.outputContainer, { backgroundColor: isDark ? '#161b22' : colors.card }]}>
              <ThemedView style={[styles.outputHeader, { 
                backgroundColor: isDark ? '#161b22' : colors.card,
                borderBottomColor: isDark ? '#30363d' : colors.border
              }]}>
                <ThemedView style={[styles.outputTitle, { backgroundColor: isDark ? '#161b22' : colors.card }]}>
                  <IconSymbol name="terminal" size={16} color={isDark ? '#58a6ff' : colors.primary} />
                  <ThemedText style={[styles.outputTitleText, { color: isDark ? '#58a6ff' : colors.primary }]}>Output</ThemedText>
                </ThemedView>
                <TouchableOpacity onPress={() => setOutput('')}>
                  <IconSymbol name="trash" size={20} color={isDark ? '#8b949e' : `${colors.text}80`} />
                </TouchableOpacity>
              </ThemedView>
              <ThemedView style={[styles.outputContent, { backgroundColor: isDark ? '#161b22' : colors.card }]}>
                <ThemedText style={[styles.outputText, { color: isDark ? '#c9d1d9' : colors.text }]}>{output}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  toolbarLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  toolbarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  actionButtonActive: {
    borderWidth: 1,
  },
  runButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  runningButton: {
    backgroundColor: '#FF5722',
  },
  runButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  mainSection: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  sidebar: {
    width: 200,
    borderRadius: 12,
    padding: 12,
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    borderRadius: 8,
  },
  templateItemText: {
    flex: 1,
    fontSize: 14,
  },
  editorSection: {
    flex: 1,
    gap: 16,
  },
  editorContainer: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
  },
  editor: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'SpaceMono',
  },
  outputContainer: {
    height: 160,
    borderRadius: 12,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  outputTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outputTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  outputContent: {
    flex: 1,
    padding: 12,
  },
  outputText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'SpaceMono',
  },
}); 