import { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Typography, InputBase, IconButton, Menu, MenuItem } from '@mui/material/';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PoddyLogo from './PoddyLogo';
import SettingsIcon from '@mui/icons-material/Settings';
import { debounce } from 'lodash';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.primary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  borderRadius: theme.shape.borderRadius,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchAppBar({ onSortChange, onFilterChange, onSearchChange, onFavoritesClick, onResetClick, genres }) {
  const theme = useTheme();
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);

  const debouncedSearch = useMemo(
    () => debounce(onSearchChange, 300),
    [onSearchChange]
  );

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (sortOption) => {
    onSortChange(sortOption);
    handleSortClose();
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (genre) => {
    onFilterChange(genre);
    handleFilterClose();
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleResetClick = () => {
    onResetClick();
    handleSettingsClose();
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        backgroundColor: theme.palette.searchAppBar.background,
        color: theme.palette.searchAppBar.color,
      }}
    >
      <Toolbar>
        <Box
          sx={{
            paddingRight: '0.4rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <PoddyLogo />
        </Box>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          Poddy
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </Search>
        <IconButton color="inherit" onClick={handleSortClick}>
          <SortIcon />
        </IconButton>
        <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={handleSortClose}>
          <MenuItem onClick={() => handleSortSelect('A-Z')}>Title A-Z</MenuItem>
          <MenuItem onClick={() => handleSortSelect('Z-A')}>Title Z-A</MenuItem>
          <MenuItem onClick={() => handleSortSelect('newest')}>Newest Added</MenuItem>
          <MenuItem onClick={() => handleSortSelect('oldest')}>Oldest Added</MenuItem>
        </Menu>
        <IconButton color="inherit" onClick={handleFilterClick}>
          <FilterListIcon />
        </IconButton>
        <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
        <MenuItem onClick={() => handleFilterSelect(null)}>Show All</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} onClick={() => handleFilterSelect(genre)}>
              {genre.title}
            </MenuItem>
          ))}
        </Menu>
        <IconButton color="inherit" onClick={onFavoritesClick}>
          <FavoriteIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleSettingsClick}>
          <SettingsIcon />
        </IconButton>
        <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleSettingsClose}>
          <MenuItem onClick={handleResetClick}>Reset Listening History</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

SearchAppBar.propTypes = {
  onSortChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onFavoritesClick: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
  genres: PropTypes.array.isRequired,
};