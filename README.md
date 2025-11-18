# 🎮 3D Bubble Shooter Game with Leaderboard

A modern, browser-based 3D bubble shooter game featuring multiple difficulty levels, progressive gameplay, and a persistent leaderboard system. Built with vanilla JavaScript, HTML5 Canvas, and CSS3.

## ✨ Features

### Core Gameplay
- **3D Visual Effects**: Realistic bubble rendering with gradient shading and depth perception
- **Multiple Difficulty Levels**: Easy, Medium, and Hard modes with different challenges
- **Progressive Levels**: Advance through levels by clearing all bubbles
- **Smart Bubble Matching**: Match 3 or more bubbles of the same color to pop them
- **Floating Bubble Detection**: Disconnected bubbles automatically fall and award bonus points
- **Aim Assist**: Visual aiming line to help plan your shots

### Difficulty Settings

**Easy Mode**
- 5 rows of bubbles
- 4 different colors
- Slower bubble speed
- 1x score multiplier

**Medium Mode**
- 7 rows of bubbles
- 5 different colors
- Normal bubble speed
- 1.5x score multiplier

**Hard Mode**
- 9 rows of bubbles
- 6 different colors
- Faster bubble speed
- 2x score multiplier

### Leaderboard System
- **Persistent Storage**: Scores saved in browser localStorage
- **Difficulty-Specific Rankings**: Separate leaderboards for each difficulty level
- **Top 10 Tracking**: Maintains the top 10 scores for each difficulty
- **Player Information**: Displays player name, score, level reached, and date
- **Medal System**: Gold, silver, and bronze medals for top 3 players
- **Beautiful UI**: Animated entries with special styling for top performers

### User Interface
- **Responsive Design**: Adapts to different screen sizes and devices
- **Modern Aesthetics**: Gradient backgrounds, glassmorphism effects, and smooth animations
- **Real-Time Stats**: Live score and level tracking
- **Next Bubble Preview**: See what color is coming next
- **Clear Instructions**: On-screen controls and gameplay tips
- **Smooth Transitions**: Polished modal dialogs and button interactions

## 🎯 How to Play

### Controls
- **Mouse Movement**: Aim your bubble shooter
- **Left Click**: Shoot the bubble
- **Leaderboard Button**: View high scores

### Objective
1. Match 3 or more bubbles of the same color to pop them
2. Clear all bubbles from the screen to advance to the next level
3. Earn bonus points for causing bubbles to fall
4. Avoid letting bubbles reach the bottom of the screen
5. Achieve the highest score possible and claim your spot on the leaderboard

### Scoring System
- **Matched Bubbles**: 10 points per bubble × difficulty multiplier
- **Floating Bubbles**: 20 points per bubble × difficulty multiplier
- **Level Completion**: 100 points × current level number

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bubble-shooter-3d.git
   cd bubble-shooter-3d
   ```

2. **Open the game**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. **Start playing!**
   - Select your difficulty level
   - Aim and shoot bubbles
   - Try to beat the high scores

## 📁 Project Structure

```
bubble-shooter-3d/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── game.js            # Game logic and leaderboard system
├── README.md          # This file
└── LICENSE            # MIT License
```

## 🎨 Technical Details

### Technologies Used
- **HTML5 Canvas**: For rendering game graphics
- **Vanilla JavaScript**: No frameworks or libraries required
- **CSS3**: Modern styling with gradients, animations, and transitions
- **LocalStorage API**: For persistent leaderboard data

### Key Features Implementation

**Bubble Physics**
- Collision detection using distance calculations
- Wall bouncing with velocity reversal
- Grid-based positioning system
- Hexagonal offset pattern for realistic bubble stacking

**Matching Algorithm**
- Recursive neighbor checking
- Color-based grouping
- Connected component analysis for floating bubble detection
- Efficient set-based duplicate prevention

**Leaderboard System**
- JSON-based data structure
- Automatic sorting by score
- Date formatting and display
- Difficulty-specific storage keys

## 🎮 Game Mechanics

### Bubble Grid System
The game uses a hexagonal grid pattern where bubbles are arranged in alternating rows. Even rows are aligned, while odd rows are offset by half a bubble width, creating the classic bubble shooter layout.

### Collision Detection
When a bubble is shot, the game continuously checks for collisions with existing bubbles using distance calculations. When the distance between centers is less than the sum of their radii, a collision is detected.

### Match Detection
After a bubble attaches to the grid, the game performs a breadth-first search to find all connected bubbles of the same color. If 3 or more are found, they are removed and points are awarded.

### Floating Bubble Removal
After matches are removed, the game checks if any bubbles are no longer connected to the top of the screen. These "floating" bubbles are removed and award bonus points.

## 🌟 Future Enhancements

Potential features for future versions:
- Power-ups (bomb bubbles, color changers, etc.)
- Online multiplayer mode
- Cloud-based global leaderboard
- Sound effects and background music
- Mobile touch controls optimization
- Achievement system
- Daily challenges
- Custom color themes
- Replay system
- Statistics tracking

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by classic bubble shooter games
- Built with modern web technologies
- Designed for maximum accessibility and fun

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Enjoy the game and happy bubble shooting! 🎯**
