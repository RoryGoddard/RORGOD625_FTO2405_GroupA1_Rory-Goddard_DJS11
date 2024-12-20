import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    NavBar: {
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
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: '#f0f0f0', 
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: '#121212', 
          },
          outlined: {
            border: '2px solid #121212', 
            '&:hover': {
              backgroundColor: 'rgba(18, 18, 18, 0.04)',
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            color: '#121212', 
          },
      }
    },
  }
  });

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    NavBar: {
      background: '#212121',
      color: '#fafafa'
    },
    audioPlayer: {
      background: '#212121',
      controls: '#fafafa', 
      slider: '#fafafa'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#555',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#333',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fafafa',
        },
        outlined: {
          border: '2px solid #fafafa',
          '&:hover': {
            backgroundColor: 'rgba(18, 18, 18, 0.04)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#fafafa', 
        },
    }
  },
  },
});