'use client'
import React, { useEffect, useRef, useState } from 'react'
import { init, dispose } from 'klinecharts'
import computeBollingerBands from '../lib/indicators/bollinger'
import type { OHLCV, BollingerSettings as Settings } from '../types'

type Props = {
  ohlcv: OHLCV[]
  indicatorEnabled: boolean
  indicatorSettings: Settings
}

type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'All';

export default function ChartComponent({ ohlcv, indicatorEnabled, indicatorSettings }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstanceRef = useRef<any>(null)
  const [currentTimeframe, setCurrentTimeframe] = useState<Timeframe>('1D')
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0)
  const [activeTool, setActiveTool] = useState<string>('crosshair')
  const [isDrawingLocked, setIsDrawingLocked] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Convert OHLCV data to KLineChart format
  const klineData = React.useMemo(() => {
    if (!ohlcv || ohlcv.length === 0) return []
    
    return ohlcv.map(d => ({
      timestamp: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    }))
  }, [ohlcv])

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return

    // Initialize KLineChart
    chartInstanceRef.current = init(chartRef.current, {
      locale: 'en',
      timezone: 'UTC',
              styles: {
          grid: {
            show: true,
            horizontal: {
              show: true,
              color: '#f0f0f0',
              size: 1
            },
            vertical: {
              show: true,
              color: '#f0f0f0',
              size: 1
            }
          },
        candle: {
          priceMark: {
            show: true,
            high: {
              show: true,
              color: '#26a69a'
            },
            low: {
              show: true,
              color: '#ef5350'
            }
          }
        }
      }
    })

    // Create indicators
    chartInstanceRef.current.createIndicator('MA', false, { id: 'candle_pane' })
    chartInstanceRef.current.createIndicator('VOL')

    // Apply data if available
    if (klineData.length > 0) {
      chartInstanceRef.current.applyNewData(klineData)
      updatePriceInfo()
    }

    return () => {
      if (chartRef.current) {
        dispose(chartRef.current)
      }
    }
  }, [])

  // Update data when OHLCV changes
  useEffect(() => {
    if (chartInstanceRef.current && klineData.length > 0) {
      chartInstanceRef.current.applyNewData(klineData)
      updatePriceInfo()
    }
  }, [klineData])

  // Update price information
  const updatePriceInfo = () => {
    if (ohlcv && ohlcv.length > 0) {
      const latest = ohlcv[ohlcv.length - 1]
      const previous = ohlcv[ohlcv.length - 2]
      
      setCurrentPrice(latest.close)
      if (previous) {
        const change = latest.close - previous.close
        setPriceChange(change)
        setPriceChangePercent((change / previous.close) * 100)
      }
      setVolume(latest.volume)
    }
  }

  // Update Bollinger Bands overlay
  useEffect(() => {
    if (!chartInstanceRef.current) return

    // Clear previous overlays
    ;['bb_upper', 'bb_basis', 'bb_lower'].forEach(id => {
      try { chartInstanceRef.current.removeOverlay(id) } catch (e) {}
    })

    if (!indicatorEnabled || !ohlcv || ohlcv.length === 0) return

    const bands = computeBollingerBands(ohlcv, indicatorSettings.inputs)

    const pointsBasis = bands.map(b => ({ timestamp: b.time, value: b.basis }))
    const pointsUpper = bands.map(b => ({ timestamp: b.time, value: b.upper }))
    const pointsLower = bands.map(b => ({ timestamp: b.time, value: b.lower }))

    if (indicatorSettings.style.upper.visible) {
      chartInstanceRef.current.createOverlay({
        id: 'bb_upper',
        name: 'polyline',
        lock: true,
        styles: {
          line: {
            style: indicatorSettings.style.upper.style,
            color: indicatorSettings.style.upper.color,
            size: indicatorSettings.style.upper.width
          }
        } as any,
        points: pointsUpper,
      })
    }

    if (indicatorSettings.style.basis.visible) {
      chartInstanceRef.current.createOverlay({
        id: 'bb_basis',
        name: 'polyline',
        lock: true,
        styles: {
          line: {
            style: indicatorSettings.style.basis.style,
            color: indicatorSettings.style.basis.color,
            size: indicatorSettings.style.basis.width
          }
        } as any,
        points: pointsBasis,
      })
    }

    if (indicatorSettings.style.lower.visible) {
      chartInstanceRef.current.createOverlay({
        id: 'bb_lower',
        name: 'polyline',
        lock: true,
        styles: {
          line: {
            style: indicatorSettings.style.lower.style,
            color: indicatorSettings.style.lower.color,
            size: indicatorSettings.style.lower.width
          }
        } as any,
        points: pointsLower,
      })
    }
  }, [ohlcv, indicatorEnabled, indicatorSettings])

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: Timeframe) => {
    setCurrentTimeframe(timeframe)
    // Here you would typically fetch new data based on the timeframe
    // For now, we'll just update the UI
  }

  // Handle tool selection
  const handleToolSelect = (tool: string) => {
    setActiveTool(tool)
    // Here you would implement the actual tool functionality
    console.log(`Selected tool: ${tool}`)
  }

  // Handle drawing lock toggle
  const handleDrawingLock = () => {
    setIsDrawingLocked(!isDrawingLocked)
    // Here you would implement the actual drawing lock functionality
    console.log(`Drawing locked: ${!isDrawingLocked}`)
  }

  // Handle fullscreen toggle
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Handle trading actions
  const handleTrade = (action: 'buy' | 'sell') => {
    console.log(`${action.toUpperCase()} order placed`)
    // Here you would implement actual trading functionality
  }

  const timeframes: Timeframe[] = ['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'All']

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header Bar - TradingView Style */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Apple Inc.</h2>
              <p className="text-sm text-gray-500">1D · NASDAQ</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Price Information */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${currentPrice.toFixed(2)}
              </div>
              <div className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
              </div>
            </div>
            
            {/* OHLC Data */}
            <div className="flex space-x-4 text-sm">
              <div>
                <span className="text-gray-500">O</span>
                <span className="ml-1 font-medium">{ohlcv?.[ohlcv.length - 1]?.open.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span className="text-gray-500">H</span>
                <span className="ml-1 font-medium">{ohlcv?.[ohlcv.length - 1]?.high.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span className="text-gray-500">L</span>
                <span className="ml-1 font-medium">{ohlcv?.[ohlcv.length - 1]?.low.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span className="text-gray-500">C</span>
                <span className="ml-1 font-medium">{ohlcv?.[ohlcv.length - 1]?.close.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            
            {/* Volume */}
            <div className="text-sm">
              <span className="text-gray-500">Vol</span>
              <span className="ml-1 font-medium">{(volume / 1000000).toFixed(2)}M</span>
            </div>
            
            {/* Trading Buttons */}
            <div className="flex space-x-2">
              <button 
                onClick={() => handleTrade('sell')}
                className="px-4 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors duration-200 shadow-sm"
              >
                SELL
              </button>
              <button 
                onClick={() => handleTrade('buy')}
                className="px-4 py-2 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-colors duration-200 shadow-sm"
              >
                BUY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Toolbar */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleToolSelect('crosshair')}
              className={`p-2 rounded transition-all duration-200 ${
                activeTool === 'crosshair' 
                  ? 'bg-blue-100 text-blue-600 border border-blue-300' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title="Crosshair Tool"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              onClick={() => handleToolSelect('trendline')}
              className={`p-2 rounded transition-all duration-200 ${
                activeTool === 'trendline' 
                  ? 'bg-green-100 text-green-600 border border-green-300' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
              title="Trend Line Tool"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4" />
              </svg>
            </button>
            <button 
              onClick={() => handleToolSelect('horizontal')}
              className={`p-2 rounded transition-all duration-200 ${
                activeTool === 'horizontal' 
                  ? 'bg-purple-100 text-purple-600 border border-purple-300' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
              title="Horizontal Line Tool"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m6-2V6l12-3v13m-6-2c0 1.105-1.343 2-3 2s-3-.895-3-2" />
              </svg>
            </button>
            <button 
              onClick={() => handleToolSelect('fibonacci')}
              className={`p-2 rounded transition-all duration-200 ${
                activeTool === 'fibonacci' 
                  ? 'bg-orange-100 text-orange-600 border border-orange-300' 
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
              title="Fibonacci Tool"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button 
              onClick={handleDrawingLock}
              className={`p-2 rounded transition-all duration-200 ${
                isDrawingLocked 
                  ? 'bg-red-100 text-red-600 border border-red-300' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
              title="Lock/Unlock Drawing Tools"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-white rounded border border-gray-300">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => handleTimeframeChange(timeframe)}
                className={`px-3 py-1 text-sm font-medium border-r border-gray-300 last:border-r-0 hover:bg-gray-50 ${
                  currentTimeframe === timeframe
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleToolSelect('watchlist')}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all duration-200"
              title="Watchlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
            </button>
            <button 
              onClick={() => handleToolSelect('settings')}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-all duration-200"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button 
              onClick={handleFullscreen}
              className={`p-2 rounded transition-all duration-200 ${
                isFullscreen 
                  ? 'bg-purple-100 text-purple-600 border border-purple-300' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
              title="Toggle Fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <div 
          ref={chartRef} 
          className="w-full"
          style={{ height: '600px' }}
        />
      </div>

      {/* Bottom Panel Tabs */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="flex space-x-6">
          <button 
            onClick={() => handleToolSelect('pine-editor')}
            className="text-sm text-gray-600 hover:text-blue-600 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-all duration-200"
          >
            Pine Editor
          </button>
          <button 
            onClick={() => handleToolSelect('strategy-tester')}
            className="text-sm text-gray-600 hover:text-green-600 font-medium px-3 py-1 rounded hover:bg-green-50 transition-all duration-200"
          >
            Strategy Tester
          </button>
          <button 
            onClick={() => handleToolSelect('replay-trading')}
            className="text-sm text-gray-600 hover:text-purple-600 font-medium px-3 py-1 rounded hover:bg-purple-50 transition-all duration-200"
          >
            Replay Trading
          </button>
          <button 
            onClick={() => handleToolSelect('trading-panel')}
            className="text-sm text-gray-600 hover:text-orange-600 font-medium px-3 py-1 rounded hover:bg-orange-50 transition-all duration-200"
          >
            Trading Panel
          </button>
        </div>
      </div>
    </div>
  )
}
