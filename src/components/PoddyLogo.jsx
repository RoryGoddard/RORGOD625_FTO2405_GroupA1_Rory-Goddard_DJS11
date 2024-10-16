import { useMediaQuery } from '@mui/material';
import PoddyLogoDarkMode from '../assets/poddy_logo_darkmode.png'
import PoddyLogoLightMode from '../assets/poddy_logo_lightmode.png'

export default function ThemeIcon() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <img 
      src={prefersDarkMode ? PoddyLogoDarkMode : PoddyLogoLightMode} 
      alt="Themed Poddy Logo"
      width={"40px"}
    />
  );
}
