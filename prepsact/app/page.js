'use client';
import { useState } from 'react';

export default function Home() {
  const [examPhase, setExamPhase] = useState('module-1');
  
  return (
    
      SAT Digital Simulator
      
      
        
          Module 1: Math
          ⏱ 35:00
        
        
        If 3x - 5 = 16, what is the value of x?
        
        
          {['5', '7', '9', '11'].map(opt => (
            
               {opt}
            
          ))}
        
      
      
      
        Submit Module
      
    
  );
}
