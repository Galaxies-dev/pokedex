import {
  fetchPokemonList,
  getPokemonId,
  getPokemonSpriteUrl,
} from "@/src/lib/pokeapi";
import type { Pokemon } from "@/src/types/pokemon";
import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LIMIT = 30;

export default function Pokedex() {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchPokemonList(LIMIT, 0).then((results) => {
      setPokemon(results);
      setOffset(LIMIT);
      setLoading(false);
    });
  }, []);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const newPokemon = await fetchPokemonList(LIMIT, offset);
    setPokemon((prev) => [...prev, ...newPokemon]);
    setOffset((prev) => prev + LIMIT);
    setLoadingMore(false);
  };

  const renderItem = ({ item }: { item: Pokemon }) => {
    const id = getPokemonId(item.url);
    const spriteUrl = getPokemonSpriteUrl(id);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push(`/pokedex/${id}` as Href)}
      >
        <Image source={{ uri: spriteUrl }} style={styles.sprite} />
        <Text style={styles.name}>
          #{id} {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={pokemon}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator style={styles.footer} /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  sprite: {
    width: 50,
    height: 50,
  },
  name: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
  },
  footer: {
    paddingVertical: 20,
  },
});
