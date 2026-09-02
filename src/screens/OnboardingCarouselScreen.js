import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Discover Elite Talent',
    description: 'Leverage advanced AI algorithms to identify top-tier athletes globally with unprecedented precision.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXOkt8jI9ucJttZH3eB9vhKE2bG2JeTaFP9bqahxaxgo3YLk0fkydafg6FHOegH6aoeHbekvnqVuBd-t2GgIZQ09Z02tC1b1YEJu84SVja_d5dQ9v4SnW_fza9ZB6JEJIDuV1J40kI8RtvQHFYPuXi1o9Ivo8UrCxfdU2QDBlCNgSMJLlNP-ru-4kDfuY1FS8n5rOPkapnvJaqZti2dPrEGUzFHZH1hl00Cjxk4_Kf_qqzT3OKt863',
  },
  {
    id: '2',
    title: 'AI-Powered Assessment',
    description: 'Analyze biometric data and performance metrics instantly to generate comprehensive scout reports.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOFvHQgadhmTAwxzjaRHe3inNABtT4ZtYyzTVX6e3GIIC6V1iC1R9yLoCejuVEcALbPTwMOD-MUx3-gTG26seJw1vFIwMyQxrHAF2Tr2dgjmlKSR7MDcHRT5nrXsKhvZ181nGCySmd_6Ii-Rr5RZwwAKfuy5ccmLErXOtaeXOnLRwt7YLkBA6KWh6VZO5pj4V5jFbrtNesiW3XcAb-LTvSU6qztvIZ0EHgGXNMS-_43nmOmULjzX64',
  },
  {
    id: '3',
    title: 'Build Your Dream Team',
    description: 'Make data-driven decisions and streamline your recruitment process from discovery to signing.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPBKvgBAd-l2yPqTdfIui9qm3gL7c_RHgSJ9lxiNf1ciNhH1IH_ZDjUvMnfJx0c0jS0Shhl36J10WCg8GV2PnTgHta4AyJGjSapDGTamK3-90h5wMWoAXerrWYwslokGvpASXtDkYDxwvrHaRbB0Jzc2ZgTSfYCYhnBjWcIEmJ4-w8ppNpl9UoFeHcNIPfWmNgVgfKqInN4zZlczZQtFLde7Cv6ZHuNVzCCrXqTGX_22NVXjGzVgNJ',
  }
];

export default function OnboardingCarouselScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      navigation.navigate('BasicDetails');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Actions */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Sadhaka</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BasicDetails')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.carousel}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: slide.image }} style={styles.image} />
              <View style={styles.imageOverlay} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Controls */}
      <View style={styles.footer}>
        {/* Indicators */}
        <View style={styles.indicators}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : styles.dotInactive
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next Step'}
          </Text>
          <MaterialIcons 
            name={currentIndex === slides.length - 1 ? "rocket-launch" : "arrow-forward"} 
            size={20} 
            color={colors.onPrimary} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.marginMobile,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  logoText: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  skipText: {
    ...typography.labelBold,
    color: colors.onSurfaceVariant,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width: width,
    paddingTop: 80,
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.md,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLow,
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 32,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.surfaceVariant,
  },
  nextButton: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    ...typography.labelBold,
    color: colors.onPrimary,
    marginRight: 8,
    fontSize: 16,
  },
});
