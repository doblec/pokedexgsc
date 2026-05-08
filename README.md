# 📱 Pokédex GSC (Gold, Silver, Crystal)

A wannabe pixel-perfect, web-based Pokédex replicating the authentic Game Boy Color experience for Generation II Pokémon. Built with React and CSS, this project acts as a love letter to the retro era, combining modern web performance optimizations with nostalgic 8-bit aesthetics.

## ✨ Features

- **Authentic Retro UI:** Replica of the Gen II Pokédex, including custom fonts, dual-border shadows, and a Game Boy Color overlay.
- **Complete Gen 1 & 2 Roster:** Browse the first 251 Pokémon, complete with their Gold, Silver, and Crystal Pokédex texts and sprites.
- **Animated & Shiny Sprites:** View both normal and shiny variants, including accurate animated sprites for the Crystal version.
- **Audio Effects:** Listen to the 8-bit cries of every Pokémon, alongside retro UI click sounds.
- **Keyboard & Mouse Support:** Fully navigable using traditional emulator keybinds or modern mouse interactions.
- **Responsive Design:** Scales perfectly to any screen size (desktop or mobile) using dynamic CSS scaling without losing its pixel-art crispness.
- **PWA Ready:** Includes manifest and icons to be installed as a standalone app on mobile devices.
- **Auto-Deployment:** CI/CD pipeline configured with GitHub Actions for automatic deployment to GitHub Pages.

## 🎮 Controls

### Keyboard
- **Arrow Keys (`⬆`, `⬇`, `⬅`, `➡`):** Navigate through the list or menus. (Left/Right jumps by 10 in the list).
- **`Z`:** Confirm / Select / Play Cry / Toggle Shiny.
- **`X`:** Go back to the main list.

### Mouse
- **Hover / Scroll:** Navigate the list.
- **Left Click:** Select an item or menu option.

## 🛠️ Tech Stack & Development Highlights

This project is built using **React (Vite)** and pure **CSS3** (no external UI libraries), leveraging the PokeAPI for all data fetching.

### Engineering Highlights

- **Zero Cumulative Layout Shift (CLS):** The application viewport is strictly bound to `100vh`/`100vw` with absolute positioning and hardware acceleration to ensure the Game Boy overlay and the React UI never push each other during network loads.
- **Sub-pixel Anti-jittering:** Mathematical rounding (`Math.round`) on the scroll positioning guarantees that the 8-bit borders and texts never decouple or "shake" during fast scrolling.
- **Render Optimization (Layout Thrashing Prevention):** The list uses `React.memo` and `useCallback` to isolate renders. Scrolling at high speeds only re-renders the items losing/gaining focus, leaving the main thread completely free.
- **On-the-fly GIF to PNG Extraction:** To fix native PokeAPI cropping issues, the app uses an invisible HTML5 `<canvas>` to extract the first perfectly-cropped frame of animated GIFs, generating a base64 PNG instantly for the list view.
- **CSS Aspect Ratio & Pixelation:** Extensive use of `image-rendering: pixelated` and dynamic `--app-scale` viewport calculations to maintain sharp, hard edges across all displays.

## 🚀 Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/PokedexGSC.git
   cd PokedexGSC
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Folder Structure

- `/src/components/` - React UI components (`PokemonList`, `PokemonEntry`, `Background`).
- `/src/hooks/` - Custom data fetching hooks (`usePokemon.js`) handling PokeAPI requests and data mapping.
- `/src/assets/` - Local sprites, fonts, and the Game Boy background overlay.
- `/public/` - Favicons and PWA `site.webmanifest`.
- `/.github/workflows/` - GitHub Actions CI/CD deployment configuration.

## 📜 Credits

- Data and Sprites provided by PokeAPI.
- Developed as a tribute to the original Pokémon Gold, Silver, and Crystal games by Game Freak / Nintendo.