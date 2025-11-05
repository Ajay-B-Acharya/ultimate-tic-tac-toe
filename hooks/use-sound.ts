"use client"

import { useCallback, useRef } from 'react'

// Web Audio API based sound generator
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playMoveSound = useCallback(() => {
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.1)
    } catch (error) {
      console.error('Error playing move sound:', error)
    }
  }, [getAudioContext])

  const playWinSound = useCallback(() => {
    try {
      const ctx = getAudioContext()
      
      // Play a sequence of ascending notes
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      
      notes.forEach((frequency, index) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        const startTime = ctx.currentTime + (index * 0.15)
        gainNode.gain.setValueAtTime(0.2, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + 0.3)
      })
    } catch (error) {
      console.error('Error playing win sound:', error)
    }
  }, [getAudioContext])

  const playHoverSound = useCallback(() => {
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = 600
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.05)
    } catch (error) {
      console.error('Error playing hover sound:', error)
    }
  }, [getAudioContext])

  return {
    playMoveSound,
    playWinSound,
    playHoverSound,
  }
}
