import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    searchAppBar: {
      background: '#f5f5f5', 
      color: '#121212', 
      inputBackground: '#e0e0e0', 
      inputText: '#000000',
    },
    audioPlayer: {
      background: '#f5f5f5', 
      controls: '#121212',
      slider: '#121212', 
    }
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    searchAppBar: {
      background: '#212121',
      color: '#fafafa'
    },
    audioPlayer: {
      background: '#212121',
      controls: '#fafafa', 
      slider: '#fafafa'
    }
  },
});