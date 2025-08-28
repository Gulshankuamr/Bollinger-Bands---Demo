# 📈 Bollinger Boilerplate

A modern, professional trading chart application built with Next.js, KLineChart, and Tailwind CSS. This project provides a TradingView-style interface with Bollinger Bands indicators and a comprehensive set of trading tools.

## ✨ Features

### 🎯 **Core Functionality**
- **Interactive Candlestick Charts** using KLineChart
- **Bollinger Bands Indicator** with customizable settings
- **Moving Average (MA) Indicator** on price pane
- **Volume Indicator** below price chart
- **Real-time OHLCV Data** support
- **Responsive Design** for all devices

### 🎨 **TradingView-Style UI**
- **Professional Header Bar** with company info and price data
- **Interactive Toolbar** with chart drawing tools
- **Timeframe Selector** (1D, 5D, 1M, 3M, 6M, YTD, 1Y, 5Y, All)
- **Trading Buttons** (BUY/SELL) with modern styling
- **Bottom Panel Tabs** for additional features
- **Modern Color Scheme** with smooth transitions

### 🛠️ **Chart Tools**
- **Crosshair Tool** - Price and time measurement
- **Trend Line Tool** - Draw trend lines on charts
- **Horizontal Line Tool** - Support and resistance levels
- **Fibonacci Tool** - Fibonacci retracement levels
- **Drawing Lock** - Lock/unlock drawing tools
- **Fullscreen Mode** - Toggle fullscreen view

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bollinger_boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
   Demo Link:- [ https://bollinger-bands-demo.vercel.app/ ]
## 📁 Project Structure

```
bollinger_boilerplate/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/             # React components
│   ├── BollingerSettings.tsx  # Bollinger Bands settings panel
│   └── Chart.tsx          # Main chart component
├── lib/                    # Utility libraries
│   └── indicators/        # Technical indicators
│       └── bollinger.ts   # Bollinger Bands calculation
├── public/                 # Static assets
│   └── data/              # Sample OHLCV data
│       └── ohlcv.json     # Sample price data
├── types.ts               # TypeScript type definitions
└── package.json           # Project dependencies
```

## 🧩 Components

### Chart Component (`components/Chart.tsx`)

The main chart component that provides the trading interface.

**Props:**
```typescript
type Props = {
  ohlcv: OHLCV[]           // Price data array
  indicatorEnabled: boolean // Toggle Bollinger Bands
  indicatorSettings: Settings // Bollinger Bands configuration
}
```

**Features:**
- KLineChart integration with MA and Volume indicators
- Interactive toolbar with drawing tools
- Real-time price updates and calculations
- Responsive design with modern UI elements

### Bollinger Settings (`components/BollingerSettings.tsx`)

Configuration panel for customizing Bollinger Bands parameters.

**Configurable Options:**
- **Length**: Period for moving average calculation
- **Multiplier**: Standard deviation multiplier
- **Offset**: Time offset for calculations
- **Line Styles**: Color, width, and visibility for each band
- **Background**: Opacity and color settings

## 📊 Data Format

### OHLCV Structure
```typescript
type OHLCV = {
  time: number      // Unix timestamp
  open: number     // Opening price
  high: number     // Highest price
  low: number      // Lowest price
  close: number    // Closing price
  volume: number   // Trading volume
}
```

### Sample Data
The project includes sample data in `public/data/ohlcv.json` for testing and development.

## 🎨 Customization

### Styling
- **Tailwind CSS** for responsive design
- **Custom color schemes** for different UI elements
- **Smooth transitions** and hover effects
- **Professional trading platform** appearance

### Chart Configuration
- **Grid styling** with customizable colors
- **Price marks** for high/low values
- **Indicator colors** and line styles
- **Responsive chart** sizing

## 🔧 Technical Details

### Dependencies
- **Next.js 14** - React framework
- **KLineChart** - Professional charting library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** - Full feature set with sidebar
- **Tablet** - Optimized layout for medium screens
- **Mobile** - Touch-friendly interface

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy Options
- **Vercel** - Recommended for Next.js apps
- **Netlify** - Static site hosting
- **AWS Amplify** - Full-stack hosting
- **Docker** - Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **KLineChart** for the powerful charting library
- **TradingView** for UI inspiration
- **Next.js** team for the excellent framework
- **Tailwind CSS** for the utility-first CSS approach

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---
Screenshot 2025-08-28 234126.png
Screenshot 2025-08-28 231146.png
Screenshot 2025-08-28 231147.png

<img width="1915" height="813" alt="Screenshot 2025-08-28 231147" src="https://github.com/user-attachments/assets/9adf81a7-19fa-44c9-8f08-e8aa7b5d8158" />


