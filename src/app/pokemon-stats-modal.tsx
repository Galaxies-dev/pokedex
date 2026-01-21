import { statLabels } from "@/src/constants/pokemon";
import { fetchPokemonDetails } from "@/src/lib/pokeapi";
import { colors, statColors, typeColors } from "@/src/theme/colors";
import type { PokemonDetails } from "@/src/types/pokemon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

function StatCircle({
  label,
  value,
  maxValue,
  color,
  delay,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  delay: number;
}) {
  const progress = useSharedValue(0);
  const percentage = (value / maxValue) * 100;

  useEffect(() => {
    progress.value = withDelay(delay, withSpring(percentage, { damping: 15 }));
  }, [percentage, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.statCircleContainer}>
      <View style={styles.statCircleHeader}>
        <Text style={styles.statCircleLabel}>{label}</Text>
        <Text style={[styles.statCircleValue, { color }]}>{value}</Text>
      </View>
      <View style={styles.statCircleBarBg}>
        <Animated.View
          style={[styles.statCircleBar, { backgroundColor: color }, animatedStyle]}
        />
      </View>
      <Text style={styles.statCirclePercentage}>
        {percentage.toFixed(0)}% of max
      </Text>
    </View>
  );
}

function StatComparison({
  stat1,
  stat2,
  label1,
  label2,
  color,
}: {
  stat1: number;
  stat2: number;
  label1: string;
  label2: string;
  color: string;
}) {
  const total = stat1 + stat2;
  const ratio1 = (stat1 / total) * 100;
  const ratio2 = (stat2 / total) * 100;

  return (
    <View style={styles.comparisonContainer}>
      <View style={styles.comparisonHeader}>
        <Text style={styles.comparisonLabel}>{label1}</Text>
        <Text style={styles.comparisonLabel}>{label2}</Text>
      </View>
      <View style={styles.comparisonBar}>
        <View
          style={[
            styles.comparisonSegment,
            { width: `${ratio1}%`, backgroundColor: color },
          ]}
        >
          <Text style={styles.comparisonValue}>{stat1}</Text>
        </View>
        <View
          style={[
            styles.comparisonSegment,
            { width: `${ratio2}%`, backgroundColor: `${color}99` },
          ]}
        >
          <Text style={styles.comparisonValue}>{stat2}</Text>
        </View>
      </View>
    </View>
  );
}

export default function PokemonStatsModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchPokemonDetails(id)
      .then(setPokemon)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load Pokemon stats</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const themeColor = typeColors[primaryType] || typeColors.normal;

  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const avgStat = totalStats / pokemon.stats.length;

  const attack = pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0;
  const defense = pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || 0;
  const spAttack = pokemon.stats.find((s) => s.stat.name === "special-attack")?.base_stat || 0;
  const spDefense = pokemon.stats.find((s) => s.stat.name === "special-defense")?.base_stat || 0;
  const hp = pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0;
  const speed = pokemon.stats.find((s) => s.stat.name === "speed")?.base_stat || 0;

  const physicalTotal = attack + defense;
  const specialTotal = spAttack + spDefense;
  const offensiveTotal = attack + spAttack;
  const defensiveTotal = defense + spDefense + hp;

  const getStatTier = (total: number) => {
    if (total >= 600) return { label: "Legendary", color: "#FFD700" };
    if (total >= 500) return { label: "Excellent", color: "#4CAF50" };
    if (total >= 400) return { label: "Good", color: "#2196F3" };
    if (total >= 300) return { label: "Average", color: "#FF9800" };
    return { label: "Below Average", color: "#F44336" };
  };

  const tier = getStatTier(totalStats);

  return (
    <View style={styles.container}>
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>
          <Text style={styles.subtitle}>Detailed Stats Analysis</Text>
        </View>

        <View style={[styles.totalStatsCard, { borderColor: themeColor }]}>
          <Text style={styles.cardTitle}>Base Stat Total</Text>
          <Text style={[styles.totalValue, { color: themeColor }]}>{totalStats}</Text>
          <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
            <Text style={styles.tierText}>{tier.label}</Text>
          </View>
          <Text style={styles.avgText}>Average: {avgStat.toFixed(1)} per stat</Text>
        </View>

        <Text style={styles.sectionTitle}>Individual Stats</Text>
        <View style={styles.statsGrid}>
          {pokemon.stats.map((stat, index) => (
            <StatCircle
              key={stat.stat.name}
              label={statLabels[stat.stat.name] || stat.stat.name}
              value={stat.base_stat}
              maxValue={255}
              color={statColors[stat.stat.name] || themeColor}
              delay={index * 100}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Stat Comparisons</Text>

        <StatComparison
          stat1={physicalTotal}
          stat2={specialTotal}
          label1="Physical"
          label2="Special"
          color={themeColor}
        />

        <StatComparison
          stat1={offensiveTotal}
          stat2={defensiveTotal}
          label1="Offensive"
          label2="Defensive"
          color={themeColor}
        />

        <StatComparison
          stat1={hp + speed}
          stat2={attack + defense + spAttack + spDefense}
          label1="Utility"
          label2="Combat"
          color={themeColor}
        />

        <Text style={styles.sectionTitle}>Battle Insights</Text>
        <View style={styles.insightsContainer}>
          {speed >= 100 && (
            <View style={[styles.insightBadge, { backgroundColor: statColors.speed }]}>
              <Text style={styles.insightText}>Speed Demon</Text>
            </View>
          )}
          {hp >= 100 && (
            <View style={[styles.insightBadge, { backgroundColor: statColors.hp }]}>
              <Text style={styles.insightText}>Tank</Text>
            </View>
          )}
          {attack >= 100 && (
            <View style={[styles.insightBadge, { backgroundColor: statColors.attack }]}>
              <Text style={styles.insightText}>Physical Sweeper</Text>
            </View>
          )}
          {spAttack >= 100 && (
            <View style={[styles.insightBadge, { backgroundColor: statColors["special-attack"] }]}>
              <Text style={styles.insightText}>Special Sweeper</Text>
            </View>
          )}
          {defense >= 100 && (
            <View style={[styles.insightBadge, { backgroundColor: statColors.defense }]}>
              <Text style={styles.insightText}>Physical Wall</Text>
            </View>
          )}
          {spDefense >= 100 && (
            <View style={[styles.insightBadge, { backgroundColor: statColors["special-defense"] }]}>
              <Text style={styles.insightText}>Special Wall</Text>
            </View>
          )}
          {pokemon.stats.every((s) => s.base_stat >= 80) && (
            <View style={[styles.insightBadge, { backgroundColor: "#9C27B0" }]}>
              <Text style={styles.insightText}>Well Rounded</Text>
            </View>
          )}
        </View>

        <Pressable
          style={[styles.closeButton, { backgroundColor: themeColor }]}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.text.error,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.surface.border,
    borderRadius: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  totalStatsCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 56,
    fontWeight: "bold",
    marginVertical: 8,
  },
  tierBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tierText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  avgText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  statCircleContainer: {
    backgroundColor: colors.surface.primary,
    borderRadius: 16,
    padding: 16,
  },
  statCircleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statCircleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  statCircleValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statCircleBarBg: {
    height: 8,
    backgroundColor: colors.surface.secondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  statCircleBar: {
    height: "100%",
    borderRadius: 4,
  },
  statCirclePercentage: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 6,
    textAlign: "right",
  },
  comparisonContainer: {
    backgroundColor: colors.surface.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  comparisonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  comparisonBar: {
    flexDirection: "row",
    height: 40,
    borderRadius: 8,
    overflow: "hidden",
  },
  comparisonSegment: {
    justifyContent: "center",
    alignItems: "center",
  },
  comparisonValue: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  insightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },
  insightBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  insightText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 13,
  },
  closeButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
