# Pokedex

A React Native mobile app built with Expo that lets you browse, search, and favorite Generation 1 Pokemon. Powered by the [PokeAPI](https://pokeapi.co/).

> **Sponsored by:** [CodeRabbit](https://coderabbit.link/sg) - AI-powered code reviews

## Features

- **Browse** all 150 original Pokemon in a scrollable list
- **Search** by name or Pokedex number with debounced input
- **View details** including types, stats, abilities, height, and weight with smooth parallax animations
- **Analyze stats** with a dedicated modal showing stat comparisons, battle insights, and rarity tiers
- **Save favorites** with persistent local storage via AsyncStorage
- **Tab navigation** between Pokedex and Favorites screens

## Tech Stack

- [Expo](https://expo.dev) 54 & React Native 0.81
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for animations
- TypeScript
- AsyncStorage for persistence

## Video Tutorial

Watch and build this Pokedex step by step:

<p align="center">
  <a href="https://youtu.be/7Ttljtghm18" target="_blank">
    <img src="https://img.youtube.com/vi/7Ttljtghm18/maxresdefault.jpg" alt="How I’d Learn React Native Today (2026 Edition)" width="100%" />
  </a>
</p>

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Open on a device or simulator using the options shown in the terminal.

## Project Structure

```
src/
  app/              # Screens & routing (tabs, modals, detail pages)
  components/       # Reusable UI components (list items, detail view)
  lib/              # API helpers & custom hooks (pokeapi, favorites)
  types/            # TypeScript interfaces
  constants/        # Stat label mappings
  theme/            # Colors & type color palettes
```

[![Youtube](https://img.shields.io/static/v1?label=SimonGrimm&message=Subscribe&logo=YouTube&color=FF0000&style=for-the-badge)](https://www.youtube.com/@devsimon?sub_confirmation=1)

[![Twitter Follow](https://img.shields.io/twitter/follow/schlimmson?color=1DA1F2&label=Followers&logo=twitter&style=for-the-badge)](https://twitter.com/intent/follow?&screen_name=schlimmson)

## 🚀 More

**Take a shortcut from web developer to mobile development fluency with guided learning**

Enjoyed this project? Learn to use React Native to build production-ready, native mobile apps for both iOS and Android based on your existing web development skills.

<a href="https://galaxies.dev"><img src="banner.png" height="auto" width="100%"></a>
