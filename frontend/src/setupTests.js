import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill global for Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Vite env variables for Jest
globalThis.VITE_BACKEND_URL = 'http://localhost:3000';
