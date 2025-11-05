import React from 'react';
import { cn } from '@/lib/utils';

// Pixel-art style icons using CSS box-shadow technique
// Each icon is an 8x8 grid represented as a string of 0s and 1s

const ICONS = {
  trophy: [
    '00111100',
    '01111110',
    '01111110',
    '00111100',
    '00111100',
    '01111110',
    '11111111',
    '00111100',
  ],
  star: [
    '00011000',
    '00011000',
    '11111111',
    '01111110',
    '00111100',
    '01011010',
    '10000001',
    '00000000',
  ],
  sword: [
    '00000110',
    '00001100',
    '00011000',
    '00110000',
    '01100000',
    '11000110',
    '10001100',
    '00011000',
  ],
  shield: [
    '00111100',
    '01111110',
    '11111111',
    '11111111',
    '11111111',
    '01111110',
    '00111100',
    '00011000',
  ],
  gem: [
    '00111100',
    '01111110',
    '11111111',
    '11111111',
    '01111110',
    '00111100',
    '00011000',
    '00000000',
  ],
  scroll: [
    '01111110',
    '11111111',
    '11000011',
    '11000011',
    '11000011',
    '11000011',
    '11111111',
    '01111110',
  ],
  lock: [
    '00111100',
    '01000010',
    '01000010',
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '01111110',
  ],
  check: [
    '00000000',
    '00000001',
    '00000011',
    '10000110',
    '11001100',
    '01111000',
    '00110000',
    '00000000',
  ],
  plus: [
    '00011000',
    '00011000',
    '00011000',
    '11111111',
    '11111111',
    '00011000',
    '00011000',
    '00011000',
  ],
  edit: [
    '00000011',
    '00000110',
    '00001100',
    '00011000',
    '00110000',
    '01100000',
    '11000000',
    '11111111',
  ],
  delete: [
    '11000011',
    '11100111',
    '01111110',
    '00111100',
    '00111100',
    '01111110',
    '11100111',
    '11000011',
  ],
  label: [
    '01111110',
    '11111111',
    '11011011',
    '11011011',
    '11011011',
    '11011011',
    '11111111',
    '01111110',
  ],
};

export default function PixelIcon({ name, size = 16, color = 'currentColor', className }) {
  const icon = ICONS[name] || ICONS.star;
  
  // Generate box-shadow for pixel art effect
  const generatePixelShadow = () => {
    const shadows = [];
    const pixelSize = size / 8;
    
    icon.forEach((row, y) => {
      for (let x = 0; x < 8; x++) {
        if (row[x] === '1') {
          const xPos = x * pixelSize;
          const yPos = y * pixelSize;
          shadows.push(`${xPos}px ${yPos}px 0 ${color}`);
        }
      }
    });
    
    return shadows.join(', ');
  };

  return (
    <div
      className={cn('inline-block', className)}
      style={{
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size / 8,
          height: size / 8,
          boxShadow: generatePixelShadow(),
          backgroundColor: color,
        }}
      />
    </div>
  );
}

