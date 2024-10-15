import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingSpinner() {
  return (
    <Box sx={{     
      position: 'absolute',
      top: '50%',
      left: '50%',
      }}>
      <CircularProgress />
    </Box>
  );
}