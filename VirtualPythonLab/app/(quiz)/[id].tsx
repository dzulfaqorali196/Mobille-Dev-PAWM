import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, View, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { COURSES } from '../../constants/courses';

interface Question {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function QuizScreen() {
  const { id, courseCode, title } = useLocalSearchParams();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    for (const course of COURSES) {
      const section = course.sections.find(s => s.id === id);
      if (section && section.type === 'quiz') {
        const content = JSON.parse(section.content);
        setQuestions(content.questions);
        break;
      }
    }
  }, [id]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  const handleNext = async () => {
    if (!user || !currentQuestion) return;

    try {
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

      if (isCorrect) {
        const { error: progressError } = await supabase
          .from('section_progress')
          .upsert({
            user_id: user.id,
            course_code: courseCode as string,
            section_id: id as string,
            is_completed: true,
          }, {
            onConflict: 'user_id,course_code,section_id'
          });

        if (progressError) throw progressError;
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        Alert.alert(
          'Quiz Selesai',
          'Anda telah menyelesaikan quiz ini!',
          [
            {
              text: 'Kembali ke Materi',
              onPress: () => router.back(),
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Gagal menyimpan progress');
    }
  };

  if (!currentQuestion) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <IconSymbol name="exclamationmark.circle" size={40} color="#F44336" />
        <ThemedText style={styles.errorText}>Quiz tidak ditemukan</ThemedText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Kembali ke Materi</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: title as string,
          headerShown: true,
        }}
      />
      
      <ThemedView style={styles.progressContainer}>
        <ThemedView style={styles.progressBar}>
          <ThemedView 
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </ThemedView>
        
        <ThemedText style={styles.questionNumber}>
          Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.questionCard}>
            <ThemedText style={styles.questionText}>{currentQuestion.question}</ThemedText>

            <ThemedView style={styles.options}>
              {currentQuestion.options.map((option: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    isAnswered && option === currentQuestion.correctAnswer && styles.correctOption,
                    isAnswered && selectedAnswer === option && selectedAnswer !== currentQuestion.correctAnswer && styles.wrongOption,
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                >
                  <ThemedText style={[
                    styles.optionText,
                    selectedAnswer === option && styles.selectedOptionText,
                    isAnswered && option === currentQuestion.correctAnswer && styles.correctOptionText,
                    isAnswered && selectedAnswer === option && selectedAnswer !== currentQuestion.correctAnswer && styles.wrongOptionText,
                  ]}>
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>

            {isAnswered && (
              <ThemedView style={styles.explanation}>
                <ThemedText style={styles.explanationText}>
                  {currentQuestion.explanation}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          {isAnswered && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <ThemedText style={styles.nextButtonText}>
                {currentQuestionIndex < questions.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesai'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  progressContainer: {
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#66c0f4',
  },
  questionNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 26,
    color: '#000',
  },
  options: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#66c0f4',
    backgroundColor: 'rgba(102, 192, 244, 0.1)',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  wrongOption: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#66c0f4',
  },
  correctOptionText: {
    color: '#4CAF50',
  },
  wrongOptionText: {
    color: '#F44336',
  },
  explanation: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#66c0f4',
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#66c0f4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#66c0f4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 