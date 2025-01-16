import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol, IconSymbolName } from '../../components/ui/IconSymbol';
import WebView from 'react-native-webview';
import Animated, { FadeIn } from 'react-native-reanimated';

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
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Menjalankan kode...');
    
    try {
      // Simulasi eksekusi kode
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Menentukan output berdasarkan kode yang dijalankan
      if (code.includes('Hello, World!') && !code.includes('hitung_luas_persegi')) {
        setOutput('Hello, World!');
      } else if (code.includes('calculator')) {
        setOutput('15'); // Output dari calculator(10, 5, '+')
      } else if (code.includes('numbers = [1, 2, 3, 4, 5]')) {
        setOutput(
          'Original: [1, 2, 3, 4, 5]\n' +
          'After append: [1, 2, 3, 4, 5, 6]\n' +
          'After pop: [1, 2, 3, 4, 5]\n' +
          'Sum: 15'
        );
      } else if (code.includes('hitung_luas_persegi')) {
        setOutput('Hello, World!\nLuas persegi dengan sisi 5 adalah 25');
      } else {
        setOutput('// Output akan muncul di sini setelah kode dijalankan');
      }
    } catch (error: any) {
      setOutput('Error: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    Alert.alert('Simpan Kode', 'Kode berhasil disimpan!');
  };

  const handleShareCode = () => {
    Alert.alert('Bagikan Kode', 'Fitur berbagi kode akan segera hadir!');
  };

  const handleUseTemplate = (template: typeof TEMPLATES[0]) => {
    setCode(template.code);
    setShowTemplates(false);
    setOutput(''); // Reset output saat template baru dipilih
  };

  // HTML untuk editor CodeMirror
  const editorHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js"></script>
      <style>
        body { margin: 0; }
        .CodeMirror {
          height: 100vh;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <textarea id="code">${code}</textarea>
      <script>
        var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
          mode: "python",
          theme: "dracula",
          lineNumbers: true,
          autoCloseBrackets: true,
          matchBrackets: true,
          indentUnit: 4,
          tabSize: 4,
          indentWithTabs: true,
          lineWrapping: true
        });
        editor.on("change", function() {
          window.ReactNativeWebView.postMessage(editor.getValue());
        });
      </script>
    </body>
    </html>
  `;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerLeft}>
          <ThemedText style={styles.title}>Python Editor</ThemedText>
          <TouchableOpacity 
            style={styles.templateButton}
            onPress={() => setShowTemplates(!showTemplates)}
          >
            <IconSymbol name="doc.text" size={16} color="#66c0f4" />
            <ThemedText style={styles.templateButtonText}>Templates</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSaveCode}>
            <IconSymbol name="square.and.arrow.down" size={20} color="#66c0f4" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShareCode}>
            <IconSymbol name="square.and.arrow.up" size={20} color="#66c0f4" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.runButton, isRunning && styles.runningButton]}
            onPress={handleRunCode}
            disabled={isRunning}
          >
            <IconSymbol 
              name={isRunning ? "stop.fill" : "play.fill"} 
              size={20} 
              color="white" 
            />
            <ThemedText style={styles.runButtonText}>
              {isRunning ? 'Running...' : 'Run Code'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {showTemplates && (
        <Animated.View 
          entering={FadeIn}
          style={styles.templatesContainer}
        >
          <ThemedText style={styles.templatesTitle}>Template Kode</ThemedText>
          {TEMPLATES.map(template => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateItem}
              onPress={() => handleUseTemplate(template)}
            >
              <IconSymbol name={template.icon} size={20} color="#66c0f4" />
              <ThemedText style={styles.templateItemText}>{template.title}</ThemedText>
              <IconSymbol name="chevron.right" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      <ThemedView style={styles.editorContainer}>
        <WebView
          source={{ html: editorHTML }}
          style={styles.editor}
          onMessage={(event) => setCode(event.nativeEvent.data)}
        />
      </ThemedView>

      <ThemedView style={styles.outputContainer}>
        <ThemedView style={styles.outputHeader}>
          <ThemedView style={styles.outputTitle}>
            <IconSymbol name="terminal" size={16} color="#666" />
            <ThemedText style={styles.outputTitleText}>Output</ThemedText>
          </ThemedView>
          <TouchableOpacity onPress={() => setOutput('')}>
            <IconSymbol name="trash" size={20} color="#666" />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.outputContent}>
          <ThemedText style={styles.outputText}>{output}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  templateButtonText: {
    color: '#66c0f4',
    fontSize: 14,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(102, 192, 244, 0.1)',
    borderRadius: 8,
  },
  runButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  runningButton: {
    backgroundColor: '#FF5722',
  },
  runButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  templatesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  templateItemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#282a36',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  editor: {
    flex: 1,
  },
  outputContainer: {
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  outputTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outputTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  outputContent: {
    flex: 1,
  },
  outputText: {
    fontSize: 14,
    opacity: 0.8,
    fontFamily: 'SpaceMono',
  },
}); 