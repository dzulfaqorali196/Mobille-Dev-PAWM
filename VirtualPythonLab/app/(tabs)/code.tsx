import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol, IconSymbolName } from '../../components/ui/IconSymbol';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../lib/ThemeContext';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const JUDGE0_API = Constants.expoConfig?.extra?.judge0Api || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = Constants.expoConfig?.extra?.judge0Key;

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
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Set pesan awal
    setOutput('Siap menjalankan kode Python');
  }, []);

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput('Menjalankan kode...');

      // Submit code ke Judge0
      const submitResponse = await fetch(`${JUDGE0_API}/submissions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 71, // Python
          stdin: ''
        })
      });

      const submitData = await submitResponse.json();
      const token = submitData.token;

      // Poll untuk hasil
      let attempts = 0;
      const maxAttempts = 10;
      while (attempts < maxAttempts) {
        const resultResponse = await fetch(`${JUDGE0_API}/submissions/${token}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': JUDGE0_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });

        const resultData = await resultResponse.json();
        
        if (resultData.status?.id >= 3) { // Selesai diproses
          let finalOutput = '';
          
          if (resultData.stdout) {
            finalOutput += resultData.stdout;
          }
          
          if (resultData.stderr) {
            finalOutput += '\n\nError:\n' + resultData.stderr;
          }
          
          if (resultData.compile_output) {
            finalOutput += '\n\nCompile Output:\n' + resultData.compile_output;
          }
          
          setOutput(finalOutput.trim() || 'Tidak ada output');
          break;
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (attempts >= maxAttempts) {
        setOutput('Error: Timeout - Kode terlalu lama diproses');
      }
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error: ' + (error as Error).message);
      setIsConnected(false);
    } finally {
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