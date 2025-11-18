# Daily Challenges & Rewards System - Development Tasks

## Sprint Planning Overview

**Total Duration**: 8 weeks (4 sprints × 2 weeks)  
**Team Size**: Assumed 2-3 developers  
**Velocity**: ~20-25 story points per sprint

---

## Sprint 1: Foundation (Weeks 1-2)

**Goal**: Establish core challenge system, Gem economy, and basic UI  
**Story Points**: 21

### Task 1.1: Set Up Project Structure
**Assignee**: Lead Developer  
**Estimated Hours**: 4  
**Priority**: Critical

**Subtasks**:
1. Create `src/systems/` directory for game systems
2. Create `src/systems/challenges/` for challenge-related code
3. Create `src/systems/economy/` for Gem economy code
4. Create `src/ui/components/challenges/` for UI components
5. Set up module imports and exports
6. Create configuration files for challenges and rewards

**Acceptance Criteria**:
- Directory structure matches project conventions
- All modules can be imported without errors
- Configuration files are properly formatted JSON or JavaScript

**Files to Create**:
```
src/
├── systems/
│   ├── challenges/
│   │   ├── ChallengeGenerator.js
│   │   ├── ChallengeProgressTracker.js
│   │   ├── ChallengeTypes.js
│   │   └── challengeConfig.json
│   └── economy/
│       ├── GemEconomy.js
│       ├── TransactionLog.js
│       └── economyConfig.json
└── ui/
    └── components/
        └── challenges/
            ├── ChallengeCard.js
            ├── ChallengeModal.js
            ├── ProgressBar.js
            └── GemCounter.js
```

---

### Task 1.2: Implement Challenge Generator
**Assignee**: Backend Developer  
**Estimated Hours**: 8  
**Priority**: Critical  
**Depends On**: Task 1.1

**Subtasks**:
1. Create `ChallengeGenerator` class with date-based seeding
2. Implement challenge type definitions (score, level, accuracy, color-matching)
3. Create difficulty scaling logic (Easy/Medium/Hard)
4. Implement random selection algorithm ensuring variety
5. Add validation to ensure challenges are achievable
6. Create unit tests for generator logic
7. Implement daily reset mechanism at midnight

**Acceptance Criteria**:
- Generator produces three challenges (Easy, Medium, Hard) for any given date
- Same date always produces same challenges (deterministic)
- Challenges use different types (no duplicates)
- All challenges are achievable within reasonable time
- Unit tests achieve 90%+ code coverage

**Technical Implementation**:
```javascript
class ChallengeGenerator {
  constructor(config) {
    this.config = config;
    this.challengeTypes = this.loadChallengeTypes();
  }
  
  generateDailyChallenges(date = new Date()) {
    const seed = this.dateToSeed(date);
    const rng = this.createSeededRNG(seed);
    
    const challenges = [
      this.generateChallenge('easy', rng, 0),
      this.generateChallenge('medium', rng, 1),
      this.generateChallenge('hard', rng, 2)
    ];
    
    return this.ensureVariety(challenges);
  }
  
  generateChallenge(difficulty, rng, index) {
    const availableTypes = this.getAvailableTypes(difficulty);
    const typeIndex = Math.floor(rng() * availableTypes.length);
    const type = availableTypes[typeIndex];
    
    return {
      id: this.generateChallengeId(date, index),
      difficulty,
      type: type.name,
      title: type.title,
      description: this.formatDescription(type, difficulty),
      target: type.targets[difficulty],
      reward: this.config.rewards[difficulty],
      icon: type.icon
    };
  }
  
  dateToSeed(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year * 10000 + month * 100 + day;
  }
  
  createSeededRNG(seed) {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
}
```

**Challenge Type Examples**:
```javascript
const challengeTypes = {
  score: {
    name: 'score',
    title: 'Score Master',
    description: 'Score {target} points in a single game',
    targets: { easy: 500, medium: 1500, hard: 3000 },
    icon: '🎯'
  },
  levels: {
    name: 'levels',
    title: 'Level Conqueror',
    description: 'Complete {target} levels',
    targets: { easy: 3, medium: 5, hard: 10 },
    icon: '🏆'
  },
  accuracy: {
    name: 'accuracy',
    title: 'Precision Player',
    description: 'Achieve {target}% accuracy in a game',
    targets: { easy: 60, medium: 75, hard: 90 },
    icon: '🎪'
  },
  colorMatch: {
    name: 'colorMatch',
    title: 'Color Matcher',
    description: 'Match {target} bubbles of the same color',
    targets: { easy: 50, medium: 100, hard: 200 },
    icon: '🌈'
  },
  combo: {
    name: 'combo',
    title: 'Combo King',
    description: 'Achieve a {target}-bubble combo',
    targets: { easy: 5, medium: 10, hard: 15 },
    icon: '⚡'
  }
};
```

---

### Task 1.3: Implement Gem Economy System
**Assignee**: Backend Developer  
**Estimated Hours**: 6  
**Priority**: Critical  
**Depends On**: Task 1.1

**Subtasks**:
1. Create `GemEconomy` class with balance management
2. Implement `earnGems()` method with validation
3. Implement `spendGems()` method with insufficient funds handling
4. Create transaction logging system
5. Implement localStorage persistence
6. Add event emitters for balance changes
7. Create unit tests for all economic operations

**Acceptance Criteria**:
- New players start with 50 Gems
- Earning Gems increases balance correctly
- Spending Gems only succeeds if sufficient balance exists
- All transactions are logged with timestamp and source
- Balance persists across page refreshes
- Events fire when balance changes

**Technical Implementation**:
```javascript
class GemEconomy {
  constructor() {
    this.balance = this.loadBalance() || 50; // Starting balance
    this.transactions = this.loadTransactions() || [];
    this.listeners = [];
  }
  
  earnGems(amount, source) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    this.balance += amount;
    this.logTransaction({
      type: 'earn',
      amount,
      source,
      timestamp: Date.now(),
      balanceAfter: this.balance
    });
    
    this.saveBalance();
    this.notifyListeners('earn', amount);
    
    return this.balance;
  }
  
  spendGems(amount, item) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    if (this.balance < amount) {
      return { success: false, reason: 'insufficient_funds' };
    }
    
    this.balance -= amount;
    this.logTransaction({
      type: 'spend',
      amount,
      item,
      timestamp: Date.now(),
      balanceAfter: this.balance
    });
    
    this.saveBalance();
    this.notifyListeners('spend', amount);
    
    return { success: true, newBalance: this.balance };
  }
  
  getBalance() {
    return this.balance;
  }
  
  logTransaction(transaction) {
    this.transactions.push(transaction);
    // Keep only last 100 transactions
    if (this.transactions.length > 100) {
      this.transactions = this.transactions.slice(-100);
    }
    this.saveTransactions();
  }
  
  loadBalance() {
    return parseInt(localStorage.getItem('gemBalance')) || null;
  }
  
  saveBalance() {
    localStorage.setItem('gemBalance', this.balance.toString());
  }
  
  loadTransactions() {
    const data = localStorage.getItem('gemTransactions');
    return data ? JSON.parse(data) : null;
  }
  
  saveTransactions() {
    localStorage.setItem('gemTransactions', JSON.stringify(this.transactions));
  }
  
  onBalanceChange(callback) {
    this.listeners.push(callback);
  }
  
  notifyListeners(type, amount) {
    this.listeners.forEach(callback => callback(type, amount, this.balance));
  }
}

// Singleton instance
export const gemEconomy = new GemEconomy();
```

---

### Task 1.4: Implement Challenge Progress Tracker
**Assignee**: Backend Developer  
**Estimated Hours**: 8  
**Priority**: Critical  
**Depends On**: Task 1.2

**Subtasks**:
1. Create `ChallengeProgressTracker` class
2. Implement event listeners for game actions (score, level complete, etc.)
3. Create progress update logic for each challenge type
4. Implement completion detection and event firing
5. Add localStorage persistence for progress
6. Create daily reset mechanism
7. Write unit tests for progress tracking

**Acceptance Criteria**:
- Progress updates immediately when relevant game actions occur
- Multiple challenges can track progress simultaneously
- Completion triggers event when target is reached
- Progress persists across game sessions
- Progress resets at midnight for new challenges

**Technical Implementation**:
```javascript
class ChallengeProgressTracker {
  constructor(challenges, gameEvents) {
    this.challenges = challenges;
    this.gameEvents = gameEvents;
    this.progress = this.loadProgress();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.gameEvents.on('scoreChange', (score) => {
      this.updateProgress('score', score);
    });
    
    this.gameEvents.on('levelComplete', (level) => {
      this.incrementProgress('levels', 1);
    });
    
    this.gameEvents.on('bubbleMatch', (data) => {
      if (data.accuracy) {
        this.updateProgress('accuracy', data.accuracy);
      }
      if (data.color) {
        this.incrementProgress('colorMatch', data.count);
      }
      if (data.comboSize) {
        this.updateProgress('combo', data.comboSize);
      }
    });
  }
  
  updateProgress(type, value) {
    this.challenges.forEach(challenge => {
      if (challenge.type === type && !this.isCompleted(challenge.id)) {
        this.progress[challenge.id].current = value;
        
        if (value >= challenge.target) {
          this.completeChallenge(challenge.id);
        } else {
          this.notifyProgressUpdate(challenge.id);
        }
      }
    });
    
    this.saveProgress();
  }
  
  incrementProgress(type, amount) {
    this.challenges.forEach(challenge => {
      if (challenge.type === type && !this.isCompleted(challenge.id)) {
        this.progress[challenge.id].current += amount;
        
        if (this.progress[challenge.id].current >= challenge.target) {
          this.completeChallenge(challenge.id);
        } else {
          this.notifyProgressUpdate(challenge.id);
        }
      }
    });
    
    this.saveProgress();
  }
  
  completeChallenge(challengeId) {
    const challenge = this.challenges.find(c => c.id === challengeId);
    this.progress[challengeId].completed = true;
    this.progress[challengeId].completedAt = Date.now();
    this.saveProgress();
    
    this.gameEvents.emit('challengeComplete', {
      challengeId,
      challenge,
      progress: this.progress[challengeId]
    });
  }
  
  isCompleted(challengeId) {
    return this.progress[challengeId]?.completed || false;
  }
  
  getProgress(challengeId) {
    return this.progress[challengeId] || { current: 0, completed: false };
  }
  
  loadProgress() {
    const data = localStorage.getItem('challengeProgress');
    if (!data) return this.initializeProgress();
    
    const saved = JSON.parse(data);
    // Check if saved progress is for today's challenges
    if (saved.date !== this.getCurrentDate()) {
      return this.initializeProgress();
    }
    
    return saved.progress;
  }
  
  initializeProgress() {
    const progress = {};
    this.challenges.forEach(challenge => {
      progress[challenge.id] = {
        current: 0,
        target: challenge.target,
        completed: false
      };
    });
    return progress;
  }
  
  saveProgress() {
    localStorage.setItem('challengeProgress', JSON.stringify({
      date: this.getCurrentDate(),
      progress: this.progress
    }));
  }
  
  getCurrentDate() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }
  
  notifyProgressUpdate(challengeId) {
    this.gameEvents.emit('challengeProgressUpdate', {
      challengeId,
      progress: this.progress[challengeId]
    });
  }
}
```

---

### Task 1.5: Create Challenge Card Component
**Assignee**: Frontend Developer  
**Estimated Hours**: 6  
**Priority**: High  
**Depends On**: Task 1.1

**Subtasks**:
1. Create `ChallengeCard.js` component
2. Implement difficulty-based styling (colors, stars)
3. Add progress bar visualization
4. Implement reward display with gem icon
5. Add hover and active states
6. Ensure responsive design for mobile
7. Write component tests

**Acceptance Criteria**:
- Card matches mockup design pixel-perfectly
- Difficulty colors apply correctly (green/blue/purple)
- Progress bar fills proportionally to completion
- Stars display correctly (1-3 based on difficulty)
- Responsive on all screen sizes
- Accessible with proper ARIA labels

**Technical Implementation**:
```javascript
import React from 'react';
import './ChallengeCard.css';
import ProgressBar from './ProgressBar';

function ChallengeCard({ challenge, progress, onStart }) {
  const difficultyConfig = {
    easy: { color: '#66BB6A', stars: 1 },
    medium: { color: '#42A5F5', stars: 2 },
    hard: { color: '#AB47BC', stars: 3 }
  };
  
  const config = difficultyConfig[challenge.difficulty];
  const progressPercent = (progress.current / challenge.target) * 100;
  
  return (
    <div 
      className="challenge-card"
      style={{ borderColor: config.color }}
      role="article"
      aria-label={`${challenge.difficulty} challenge: ${challenge.title}`}
    >
      <div className="challenge-header">
        <div className="difficulty-stars">
          {Array(config.stars).fill().map((_, i) => (
            <span key={i} className="star">⭐</span>
          ))}
        </div>
        <span className="challenge-icon">{challenge.icon}</span>
      </div>
      
      <h3 className="challenge-title">{challenge.title}</h3>
      <p className="challenge-description">{challenge.description}</p>
      
      <ProgressBar 
        current={progress.current}
        target={challenge.target}
        color={config.color}
        percent={progressPercent}
      />
      
      <div className="challenge-footer">
        <div className="reward">
          <span className="gem-icon">💎</span>
          <span className="gem-amount">{challenge.reward} Gems</span>
        </div>
        <div className="progress-text">
          {progress.current}/{challenge.target}
        </div>
      </div>
      
      {progress.completed && (
        <div className="completed-badge">
          <span className="checkmark">✓</span>
          <span>Completed</span>
        </div>
      )}
    </div>
  );
}

export default ChallengeCard;
```

**CSS Styling**:
```css
.challenge-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid;
  border-radius: 16px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 300ms ease-out, box-shadow 300ms ease-out;
}

.challenge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.difficulty-stars {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 20px;
}

.challenge-icon {
  font-size: 32px;
}

.challenge-title {
  font-size: 24px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 8px 0;
}

.challenge-description {
  font-size: 16px;
  color: #B0B0B0;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.challenge-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.reward {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gem-icon {
  font-size: 24px;
}

.gem-amount {
  font-size: 18px;
  font-weight: 600;
  color: #4A9EFF;
}

.progress-text {
  font-size: 16px;
  color: #B0B0B0;
}

.completed-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .challenge-card {
    padding: 12px;
  }
  
  .challenge-title {
    font-size: 20px;
  }
  
  .challenge-description {
    font-size: 14px;
  }
}
```

---

### Task 1.6: Create Progress Bar Component
**Assignee**: Frontend Developer  
**Estimated Hours**: 3  
**Priority**: High  
**Depends On**: Task 1.5

**Subtasks**:
1. Create `ProgressBar.js` component
2. Implement fill animation
3. Add color customization
4. Implement percentage display
5. Add completion animation
6. Write component tests

**Acceptance Criteria**:
- Bar fills smoothly from 0% to current progress
- Color matches challenge difficulty
- Animation uses specified timing (800ms ease-out)
- Completion triggers flash effect
- Accessible with proper ARIA attributes

**Technical Implementation**:
```javascript
import React, { useEffect, useState } from 'react';
import './ProgressBar.css';

function ProgressBar({ current, target, color, percent }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  
  useEffect(() => {
    // Animate progress bar fill
    const timer = setTimeout(() => {
      setAnimatedPercent(percent);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [percent]);
  
  const isComplete = percent >= 100;
  
  return (
    <div 
      className="progress-bar-container"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin="0"
      aria-valuemax={target}
      aria-label={`Progress: ${current} of ${target}`}
    >
      <div className="progress-bar-track">
        <div 
          className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
          style={{ 
            width: `${Math.min(animatedPercent, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
```

**CSS Styling**:
```css
.progress-bar-container {
  width: 100%;
  margin: 12px 0;
}

.progress-bar-track {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 800ms ease-out;
  position: relative;
}

.progress-bar-fill.complete {
  animation: flash 500ms ease-in-out;
}

@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

### Task 1.7: Create Gem Counter Component
**Assignee**: Frontend Developer  
**Estimated Hours**: 4  
**Priority**: High  
**Depends On**: Task 1.3

**Subtasks**:
1. Create `GemCounter.js` component
2. Implement count-up animation
3. Add glow effect
4. Subscribe to Gem economy events
5. Implement responsive positioning
6. Write component tests

**Acceptance Criteria**:
- Counter displays current Gem balance
- Updates animate smoothly when balance changes
- Blue glow effect matches design
- Positioned correctly in top-right corner
- Visible on all screens

**Technical Implementation**:
```javascript
import React, { useState, useEffect } from 'react';
import { gemEconomy } from '../../systems/economy/GemEconomy';
import './GemCounter.css';

function GemCounter() {
  const [balance, setBalance] = useState(gemEconomy.getBalance());
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const handleBalanceChange = (type, amount, newBalance) => {
      setIsAnimating(true);
      setBalance(newBalance);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    };
    
    gemEconomy.onBalanceChange(handleBalanceChange);
    
    return () => {
      // Cleanup listener if needed
    };
  }, []);
  
  return (
    <div className={`gem-counter ${isAnimating ? 'animating' : ''}`}>
      <span className="gem-icon">💎</span>
      <span className="gem-balance">{balance}</span>
      <span className="gem-label">Gems</span>
    </div>
  );
}

export default GemCounter;
```

**CSS Styling**:
```css
.gem-counter {
  position: fixed;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 0 20px rgba(74, 158, 255, 0.5);
  z-index: 1000;
}

.gem-icon {
  font-size: 24px;
}

.gem-balance {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}

.gem-label {
  font-size: 14px;
  color: #B0B0B0;
}

.gem-counter.animating .gem-balance {
  animation: countUp 500ms ease-out;
}

@keyframes countUp {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); color: #FFD700; }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .gem-counter {
    top: 12px;
    right: 12px;
    padding: 6px 12px;
  }
  
  .gem-icon {
    font-size: 20px;
  }
  
  .gem-balance {
    font-size: 16px;
  }
}
```

---

### Task 1.8: Create Daily Challenges Modal
**Assignee**: Frontend Developer  
**Estimated Hours**: 6  
**Priority**: High  
**Depends On**: Task 1.5, Task 1.7

**Subtasks**:
1. Create `ChallengeModal.js` component
2. Implement modal open/close animations
3. Add backdrop blur effect
4. Integrate ChallengeCard components
5. Add close button functionality
6. Implement keyboard navigation (ESC to close)
7. Write component tests

**Acceptance Criteria**:
- Modal matches mockup design
- Opens with scale and fade animation
- Backdrop blurs background
- Displays all three daily challenges
- Closes on backdrop click or ESC key
- Accessible with proper focus management

**Technical Implementation**:
```javascript
import React, { useEffect } from 'react';
import ChallengeCard from './ChallengeCard';
import './ChallengeModal.css';

function ChallengeModal({ challenges, progress, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);
  
  return (
    <div 
      className="challenge-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-modal-title"
    >
      <div 
        className="challenge-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="challenge-modal-header">
          <h2 id="challenge-modal-title">🎯 Daily Challenges</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        <div className="challenge-modal-content">
          {challenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              progress={progress[challenge.id]}
            />
          ))}
        </div>
        
        <div className="challenge-modal-footer">
          <button className="primary-button" onClick={onClose}>
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChallengeModal;
```

---

## Sprint 2: Completion & Streaks (Weeks 3-4)

**Goal**: Implement completion celebrations, streak tracking, and polish UI  
**Story Points**: 18

### Task 2.1: Implement Streak Tracking System
**Assignee**: Backend Developer  
**Estimated Hours**: 8  
**Priority**: High

**Subtasks**:
1. Create `StreakTracker` class
2. Implement daily login detection
3. Add streak calculation logic with grace period
4. Implement milestone detection (3, 7, 30 days)
5. Create bonus calculation method
6. Add localStorage persistence
7. Write unit tests

**Acceptance Criteria**:
- Streak increments on consecutive days
- Streak resets after missing a day
- 26-hour grace period prevents false resets
- Milestones trigger at correct days
- Bonuses calculate correctly

**Technical Implementation**:
```javascript
class StreakTracker {
  constructor() {
    this.data = this.loadStreakData();
    this.milestones = [3, 7, 30];
    this.bonuses = { 3: 20, 7: 50, 30: 150 };
  }
  
  updateStreak() {
    const now = new Date();
    const lastLogin = new Date(this.data.lastLoginDate);
    const hoursSince = (now - lastLogin) / (1000 * 60 * 60);
    
    if (hoursSince <= 26) {
      // Same day, no change
      return this.data.currentStreak;
    } else if (hoursSince <= 50) {
      // Next day, increment
      this.data.currentStreak++;
      if (this.data.currentStreak > this.data.longestStreak) {
        this.data.longestStreak = this.data.currentStreak;
      }
    } else {
      // Missed day(s), reset
      this.data.currentStreak = 1;
    }
    
    this.data.lastLoginDate = now.toISOString();
    this.saveStreakData();
    
    return this.data.currentStreak;
  }
  
  getStreakBonus() {
    const streak = this.data.currentStreak;
    if (streak >= 30) return this.bonuses[30];
    if (streak >= 7) return this.bonuses[7];
    if (streak >= 3) return this.bonuses[3];
    return 0;
  }
  
  getNextMilestone() {
    const streak = this.data.currentStreak;
    return this.milestones.find(m => m > streak) || null;
  }
  
  getDaysUntilNextMilestone() {
    const next = this.getNextMilestone();
    return next ? next - this.data.currentStreak : 0;
  }
  
  loadStreakData() {
    const data = localStorage.getItem('streakData');
    return data ? JSON.parse(data) : {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null
    };
  }
  
  saveStreakData() {
    localStorage.setItem('streakData', JSON.stringify(this.data));
  }
}

export const streakTracker = new StreakTracker();
```

---

### Task 2.2: Create Challenge Completion Screen
**Assignee**: Frontend Developer  
**Estimated Hours**: 8  
**Priority**: High

**Subtasks**:
1. Create `CompletionScreen.js` component
2. Implement confetti animation
3. Add burst effect from center
4. Create reward display with count-up animation
5. Add streak bonus section
6. Implement "Claim Reward" button
7. Write component tests

**Acceptance Criteria**:
- Screen matches mockup design
- Confetti falls from top
- Burst effect radiates from center
- Gems count up from 0 to reward value
- Streak bonus displays if applicable
- Claiming adds Gems to balance

**Technical Implementation**:
```javascript
import React, { useState, useEffect } from 'react';
import { gemEconomy } from '../../systems/economy/GemEconomy';
import { streakTracker } from '../../systems/challenges/StreakTracker';
import './CompletionScreen.css';

function CompletionScreen({ challenge, onClaim }) {
  const [gemsEarned, setGemsEarned] = useState(0);
  const streakBonus = streakTracker.getStreakBonus();
  const totalGems = challenge.reward + streakBonus;
  
  useEffect(() => {
    // Animate gem count-up
    let current = 0;
    const increment = totalGems / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalGems) {
        setGemsEarned(totalGems);
        clearInterval(timer);
      } else {
        setGemsEarned(Math.floor(current));
      }
    }, 20);
    
    return () => clearInterval(timer);
  }, [totalGems]);
  
  const handleClaim = () => {
    gemEconomy.earnGems(totalGems, `challenge_${challenge.id}`);
    onClaim();
  };
  
  return (
    <div className="completion-screen">
      <div className="confetti-container">
        {Array(50).fill().map((_, i) => (
          <div key={i} className="confetti" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: ['#FF6B35', '#FFD700', '#4A9EFF', '#66BB6A'][Math.floor(Math.random() * 4)]
          }} />
        ))}
      </div>
      
      <div className="burst-effect" />
      
      <div className="completion-card">
        <div className="completion-icon">🎉</div>
        <h2 className="completion-title">Challenge Complete!</h2>
        
        <div className="challenge-details">
          <div className="checkmark-circle">✓</div>
          <h3>{challenge.title}</h3>
          <p>{challenge.description}</p>
        </div>
        
        <div className="reward-display">
          <div className="gem-icon-large">💎</div>
          <div className="gem-amount-large">+{gemsEarned} Gems</div>
        </div>
        
        {streakBonus > 0 && (
          <div className="streak-bonus">
            <span className="flame-icon">🔥</span>
            <span>Streak Bonus! +{streakBonus} Gems for {streakTracker.data.currentStreak}-day streak</span>
          </div>
        )}
        
        <div className="total-summary">
          <strong>Total Earned: {totalGems} Gems</strong>
        </div>
        
        <button className="claim-button" onClick={handleClaim}>
          Claim Reward
        </button>
        
        <button className="secondary-button" onClick={onClaim}>
          View All Challenges
        </button>
      </div>
    </div>
  );
}

export default CompletionScreen;
```

**CSS with Animations**:
```css
.completion-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #FFD700 0%, #FF6B35 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 300ms ease-out;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: fall 3s linear infinite;
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.burst-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  animation: burst 500ms ease-out;
}

@keyframes burst {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(3);
    opacity: 0;
  }
}

.completion-card {
  background: #FFF8E1;
  border-radius: 24px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  animation: scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: center;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.completion-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.completion-title {
  font-size: 32px;
  font-weight: 700;
  color: #FFD700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0 0 24px 0;
}

.gem-amount-large {
  font-size: 32px;
  font-weight: 700;
  color: #1E1E2E;
}

.claim-button {
  width: 100%;
  height: 56px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 24px;
  transition: all 200ms ease-out;
}

.claim-button:hover {
  background: #45A049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}
```

---

### Task 2.3: Create Streak Tracker Screen
**Assignee**: Frontend Developer  
**Estimated Hours**: 6  
**Priority**: Medium

**Subtasks**:
1. Create `StreakTracker.js` component
2. Implement calendar view with last 7 days
3. Add milestone progress bar
4. Display current bonus
5. Add motivational messaging
6. Write component tests

**Acceptance Criteria**:
- Screen matches mockup design
- Calendar shows last 7 days with checkmarks
- Today is highlighted
- Milestones show correct status (completed/current/locked)
- Current bonus displays correctly

---

## Sprint 3: Monetization (Weeks 5-6)

**Goal**: Implement Gem Store, payment integration, and item purchases  
**Story Points**: 21

### Task 3.1: Create Gem Store Main Screen
**Assignee**: Frontend Developer  
**Estimated Hours**: 8  
**Priority**: High

**Subtasks**:
1. Create `GemStore.js` component
2. Implement package cards (Starter, Popular, Mega)
3. Add "BEST VALUE" ribbon to Popular Pack
4. Implement purchase button handlers
5. Add "What can you buy?" information section
6. Write component tests

---

### Task 3.2: Implement Payment Integration
**Assignee**: Backend Developer  
**Estimated Hours**: 16  
**Priority**: Critical

**Subtasks**:
1. Set up Apple StoreKit integration (iOS)
2. Set up Google Play Billing integration (Android)
3. Implement receipt validation
4. Create purchase confirmation modal
5. Handle payment success/failure
6. Implement purchase restoration
7. Add fraud prevention
8. Write integration tests

---

### Task 3.3: Create Gem Store Items Catalog
**Assignee**: Frontend Developer  
**Estimated Hours**: 6  
**Priority**: High

**Subtasks**:
1. Create `ItemCatalog.js` component
2. Implement item cards for power-ups, skins, themes
3. Add purchase validation (sufficient Gems)
4. Implement purchase confirmation
5. Add "PERMANENT" labels for one-time purchases
6. Write component tests

---

### Task 3.4: Implement Item Inventory System
**Assignee**: Backend Developer  
**Estimated Hours**: 6  
**Priority**: High

**Subtasks**:
1. Create `Inventory` class
2. Implement item addition/removal
3. Add quantity tracking for consumables
4. Implement ownership tracking for permanent items
5. Add localStorage persistence
6. Write unit tests

---

## Sprint 4: Polish & Additional Features (Weeks 7-8)

**Goal**: Add history tracking, polish UI, fix bugs, optimize performance  
**Story Points**: 14

### Task 4.1: Implement Challenge History
**Assignee**: Backend Developer  
**Estimated Hours**: 6  
**Priority**: Low

---

### Task 4.2: Add Challenge Skip Feature
**Assignee**: Full Stack Developer  
**Estimated Hours**: 4  
**Priority**: Low

---

### Task 4.3: Performance Optimization
**Assignee**: Lead Developer  
**Estimated Hours**: 8  
**Priority**: Medium

**Subtasks**:
1. Optimize localStorage operations
2. Implement debouncing for progress updates
3. Reduce animation jank
4. Optimize image loading
5. Minimize bundle size
6. Add performance monitoring

---

### Task 4.4: Bug Fixes & Polish
**Assignee**: All Developers  
**Estimated Hours**: 12  
**Priority**: High

**Subtasks**:
1. Fix reported bugs from testing
2. Polish animations and transitions
3. Improve error messages
4. Add loading states
5. Enhance accessibility
6. Cross-browser testing

---

### Task 4.5: Documentation
**Assignee**: Lead Developer  
**Estimated Hours**: 6  
**Priority**: Medium

**Subtasks**:
1. Write API documentation
2. Create developer guide
3. Document configuration options
4. Add inline code comments
5. Create troubleshooting guide

---

## Testing Strategy

### Unit Testing
- **Target Coverage**: 80%+
- **Tools**: Jest, React Testing Library
- **Focus**: Business logic, calculations, state management

### Integration Testing
- **Target Coverage**: 60%+
- **Tools**: Jest, Cypress
- **Focus**: Component interactions, data flow, API calls

### End-to-End Testing
- **Target Coverage**: Critical user flows
- **Tools**: Cypress, Playwright
- **Focus**: Complete user journeys from challenge view to reward claim

### Performance Testing
- **Metrics**: Load time < 3s, FPS > 55, Memory < 100MB
- **Tools**: Lighthouse, Chrome DevTools
- **Focus**: Animation performance, localStorage efficiency

---

## Definition of Done

A task is considered complete when:

1. **Code Complete**: All subtasks implemented and committed
2. **Tests Pass**: Unit tests achieve target coverage and all pass
3. **Code Review**: At least one peer review approval
4. **Design Match**: UI matches mockups pixel-perfectly
5. **Accessibility**: Meets WCAG AA standards
6. **Performance**: Meets performance benchmarks
7. **Documentation**: Code is documented with comments
8. **QA Approved**: QA team verifies functionality
9. **Deployed**: Code is merged to main branch

---

## Risk Management

### Technical Risks

**Risk**: Payment integration complexity  
**Mitigation**: Start early, allocate extra time, use platform SDKs  
**Contingency**: Implement mock payments for testing

**Risk**: LocalStorage limitations (5-10MB)  
**Mitigation**: Implement data cleanup, limit history to 30 days  
**Contingency**: Add IndexedDB fallback for larger storage

**Risk**: Animation performance on low-end devices  
**Mitigation**: Use CSS transforms, test on target devices  
**Contingency**: Implement reduced motion mode

### Schedule Risks

**Risk**: Payment integration takes longer than estimated  
**Mitigation**: Parallel development of other features  
**Contingency**: Move non-critical features to Sprint 4

**Risk**: Designer feedback requires UI changes  
**Mitigation**: Early design reviews, frequent check-ins  
**Contingency**: Allocate buffer time in Sprint 4

---

## Dependencies

### External Dependencies
- Apple StoreKit SDK (iOS payments)
- Google Play Billing Library (Android payments)
- Platform receipt validation APIs

### Internal Dependencies
- Existing game event system for progress tracking
- Current UI framework and styling system
- LocalStorage availability in target browsers

### Team Dependencies
- Design team for final mockup approval
- QA team for testing and bug reporting
- Product team for feature prioritization

---

## Success Metrics

### Development Metrics
- **Velocity**: 20-25 story points per sprint
- **Code Coverage**: 80%+ unit tests, 60%+ integration tests
- **Bug Rate**: < 5 bugs per sprint
- **Code Review Time**: < 24 hours average

### Quality Metrics
- **Performance**: Load time < 3s, FPS > 55
- **Accessibility**: WCAG AA compliance
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Support**: iOS 14+, Android 10+

### User Metrics (Post-Launch)
- **Engagement**: 40%+ players complete daily challenges
- **Retention**: 30%+ 30-day retention
- **Monetization**: 5%+ conversion rate on Gem purchases
- **Satisfaction**: 4+ star rating, positive feedback

---

## Deployment Plan

### Phase 1: Internal Testing (Week 7)
- Deploy to staging environment
- Internal QA testing
- Bug fixes and polish

### Phase 2: Beta Testing (Week 8)
- Deploy to beta users (10% of user base)
- Monitor analytics and feedback
- Address critical issues

### Phase 3: Full Release (Week 9)
- Deploy to 100% of users
- Monitor performance and errors
- Prepare hotfix pipeline

### Rollback Plan
- Keep previous version deployable
- Monitor error rates for 48 hours
- Rollback if error rate > 5%
