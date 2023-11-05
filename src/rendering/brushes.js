import React, { useState } from 'react';
const brushes = (brushName) => {
 
  switch (brushName) {
    case 'calligraphy':
      return {
        width: 10,
        height: 2,
        angle: -45 * Math.PI / 180,
      };
    case 'pencil':
      return {
        width: 1,
        height: 1,
        angle: 0,
      };
    case 'bold':
      return {
        width: 6,
        height: 6,
        angle: 0,
      };
    default:
      return {
        width: 1,
        height: 1,
        angle: 0,
      };
      
  }
};

export default brushes;
