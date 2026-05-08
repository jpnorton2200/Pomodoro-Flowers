# 🏔️ Alpine Wildflower Garden - Pomodoro Timer

A beautiful, mountain-themed productivity app that combines the Pomodoro technique with growing virtual Colorado alpine wildflowers. Each productive work session grows a unique wildflower species that gets added to your personal alpine meadow garden.

## Features

✨ **Alpine Mountain Aesthetic** - Sky-blue gradients, mountain silhouettes, and natural alpine colors

🌸 **8 Different Alpine Wildflowers** - Including the iconic Colorado Columbine, Indian Paintbrush, Mountain Lupine, Alpine Sunflower, and more

🏔️ **Mountain Garden View** - Your completed flowers are displayed against a beautiful mountain backdrop

🌱 **Growing Flowers** - Watch your wildflower grow in 5 stages throughout each 25-minute Pomodoro session

🏡 **Persistent Garden** - All completed flowers are saved to your personal alpine meadow that grows over time

📱 **Works on iPhone & Desktop** - Progressive Web App (PWA) that can be installed on any device

⏱️ **Classic Pomodoro** - 25-minute work sessions followed by 5-minute breaks

💾 **Offline Support** - Works without internet connection once installed

📊 **Progress Tracking** - See today's flowers and total garden count

## Alpine Wildflowers Featured

Your garden will randomly grow these beautiful Colorado alpine wildflowers:

- 🔵 **Colorado Columbine** (State Flower) - Distinctive blue and white petals with yellow center
- ❤️ **Indian Paintbrush** - Vibrant red brush-like blooms
- 💜 **Mountain Lupine** - Purple spike flowers
- 🌻 **Alpine Sunflower** - Bright yellow mountain sunflower
- 💙 **Alpine Forget-Me-Not** - Delicate blue flowers
- 🔔 **Mountain Bluebells** - Bell-shaped blue blooms
- 🌸 **Alpine Primrose** - Pink five-petaled flowers
- 🌼 **Yellow Avalanche Lily** - Cream and yellow lilies

Each flower type has its own unique appearance and will show its name when you hover over it in your garden!

## Installation

### Option 1: GitHub Pages (Recommended for iPhone)

1. **Create a GitHub repository:**
   - Go to GitHub.com and create a new repository
   - Name it something like `pomodoro-garden`
   - Make it public

2. **Upload the files:**
   - Upload all files from this folder to your repository:
     - `index.html`
     - `styles.css`
     - `app.js`
     - `manifest.json`
     - `sw.js`
     - `icon-192.png`
     - `icon-512.png`

3. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Under "Source", select "main" branch
   - Click Save
   - Your app will be available at: `https://[your-username].github.io/pomodoro-garden/`

4. **Install on iPhone:**
   - Open Safari on your iPhone
   - Navigate to your GitHub Pages URL
   - Tap the Share button (square with arrow)
   - Tap "Add to Home Screen"
   - Name it "Flower Garden" (or whatever you prefer)
   - Tap "Add"
   - The app icon will appear on your home screen like a native app!

### Option 2: Local Hosting (Windows/Mac/Linux)

1. **Simple Python Server:**
   ```bash
   cd pomodoro-garden
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser

2. **Using Node.js:**
   ```bash
   npx serve pomodoro-garden
   ```

3. **For desktop use:** Just open `index.html` in your browser (some features like service worker won't work)

## How to Use

### Starting a Pomodoro Session

1. Click "Start Growing 🌱" to begin a 25-minute work session
2. Watch your flower grow through 5 stages as you work
3. The flower completes when the timer reaches 0:00
4. Your completed flower automatically saves to your garden!

### Taking Breaks

- After completing a work session, take a 5-minute break
- The app will prompt you to start your break timer
- After the break, you can start another work session

### Viewing Your Garden

- Click the 🏡 icon in the top right to see your flower garden
- All your completed flowers are displayed with the date you grew them
- Click ⏱️ to return to the timer view

### Stats

- **Today's Flowers:** How many flowers you've grown today
- **Total Garden:** Your lifetime flower count

## Technical Details

### Technologies Used

- Pure HTML5, CSS3, and JavaScript (no frameworks required)
- Progressive Web App (PWA) capabilities
- LocalStorage for data persistence
- Service Worker for offline functionality
- Wake Lock API to prevent screen sleep during timers (where supported)

### Data Storage

All your flowers are stored locally in your browser using LocalStorage:
- Data persists across sessions
- No data is sent to any server
- Your garden is completely private
- Data is device-specific (won't sync between devices)

### Browser Compatibility

- **Best experience:** Modern browsers (Chrome, Safari, Edge, Firefox)
- **iPhone:** iOS 11.3+ (Safari)
- **Android:** Chrome 40+
- **Desktop:** All modern browsers

## Customization Ideas

Want to customize the app? Here are some easy modifications:

### Change Pomodoro Duration

In `app.js`, find:
```javascript
let timeRemaining = 25 * 60; // 25 minutes
```
Change `25` to your preferred work session length

### Change Break Duration

In `app.js`, find:
```javascript
timeRemaining = 5 * 60; // 5 minutes
```
Change `5` to your preferred break length

### Add More Wildflower Types

In `app.js`, add new flower types to the `alpineFlowers` array:
```javascript
const alpineFlowers = [
    {
        name: 'Your Flower Name',
        colors: ['#COLOR1', '#COLOR2', '#COLOR3'],
        type: 'your-type'
    },
    // Add your custom wildflower here!
];
```

Then add rendering logic for your new type in the `renderFlower` function.

### Change Background/Mountain Colors

In `styles.css`, modify the `body` background to change the sky:
```css
background: linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 40%, #e8f4f0 70%, #f0f4e8 100%);
```

Modify the mountain gradients in `body::before` to customize the mountain appearance.

## Troubleshooting

**App won't install on iPhone:**
- Make sure you're using Safari (not Chrome)
- iOS must be 11.3 or later
- Must be served over HTTPS (GitHub Pages provides this)

**Flowers not saving:**
- Check if your browser allows LocalStorage
- Try in an incognito/private window first
- Some browsers block storage in certain modes

**Timer seems inaccurate:**
- The timer uses JavaScript setInterval which can drift slightly
- This is normal and won't significantly affect the Pomodoro technique

**Screen keeps turning off:**
- The app tries to use Wake Lock API where supported
- This may not work on all devices/browsers
- You can adjust your device's auto-lock settings as a workaround

## Credits

Created with love for productivity and beautiful design! 🌸

The Pomodoro Technique was developed by Francesco Cirillo.

## License

Free to use and modify for personal use. If you share or distribute modifications, please credit the original.

---

Enjoy growing your garden! 🌺🌻🌷
