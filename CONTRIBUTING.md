# Contributing to 3D Bubble Shooter

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project follows a simple code of conduct: be respectful, be constructive, and have fun!

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/bubble-shooter-3d.git
   cd bubble-shooter-3d
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Test your changes thoroughly
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Guidelines

### Code Style

**JavaScript**
- Use ES6+ features
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small
- Use const/let instead of var

**CSS**
- Use meaningful class names
- Group related properties
- Use CSS variables for colors
- Mobile-first responsive design

**HTML**
- Use semantic HTML5 elements
- Keep structure clean and organized
- Add appropriate ARIA labels

### Testing

Before submitting a PR, test your changes:
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Test all difficulty levels
- Test leaderboard functionality
- Check for console errors

### File Organization

```
bubble-shooter-3d/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── game.js            # Game logic
├── README.md          # Documentation
├── CONTRIBUTING.md    # This file
├── DEPLOYMENT.md      # Deployment guide
└── LICENSE            # MIT License
```

## Feature Ideas

Here are some ideas for contributions:

### High Priority
- [ ] Sound effects and background music
- [ ] Mobile touch controls optimization
- [ ] Power-ups system
- [ ] Achievement system
- [ ] Settings menu (sound, effects, etc.)

### Medium Priority
- [ ] Color blind mode
- [ ] Pause functionality
- [ ] Tutorial mode
- [ ] Statistics tracking
- [ ] Daily challenges

### Low Priority
- [ ] Custom themes
- [ ] Multiplayer mode
- [ ] Replay system
- [ ] Social sharing
- [ ] Cloud leaderboard

## Adding New Features

### Example: Adding Sound Effects

1. **Create audio files**
   ```
   sounds/
   ├── shoot.mp3
   ├── pop.mp3
   └── levelup.mp3
   ```

2. **Load sounds in game.js**
   ```javascript
   const sounds = {
       shoot: new Audio('sounds/shoot.mp3'),
       pop: new Audio('sounds/pop.mp3'),
       levelup: new Audio('sounds/levelup.mp3')
   };
   ```

3. **Play sounds at appropriate times**
   ```javascript
   function handleClick() {
       if (!gameActive || projectile) return;
       sounds.shoot.play();
       // ... rest of code
   }
   ```

4. **Add settings toggle**
   ```javascript
   let soundEnabled = true;
   
   function playSound(sound) {
       if (soundEnabled) {
           sounds[sound].play();
       }
   }
   ```

### Example: Adding Power-ups

1. **Define power-up types**
   ```javascript
   const powerUps = {
       bomb: { color: '#000000', effect: 'clearRadius' },
       rainbow: { color: 'rainbow', effect: 'matchAny' },
       laser: { color: '#FF0000', effect: 'clearRow' }
   };
   ```

2. **Add power-up spawn logic**
   ```javascript
   function spawnPowerUp() {
       if (Math.random() < 0.1) { // 10% chance
           shooter.color = powerUps.bomb.color;
           shooter.isPowerUp = true;
       }
   }
   ```

3. **Implement power-up effects**
   ```javascript
   function applyPowerUp(bubble, type) {
       switch(type) {
           case 'bomb':
               clearRadius(bubble, 3);
               break;
           case 'rainbow':
               matchAnyColor(bubble);
               break;
           case 'laser':
               clearRow(bubble.row);
               break;
       }
   }
   ```

## Documentation

When adding features, please update:
- README.md with feature description
- Code comments for complex logic
- This CONTRIBUTING.md if adding new patterns

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

## Recognition

Contributors will be recognized in the README.md file.

Thank you for contributing! 🎮
