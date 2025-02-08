import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material/';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PoddyLogo from './PoddyLogo';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIconWrapper from './SearchIconWrapper'
import Search from './Search'
import StyledInputBase from './StyledInputBase'
import { useDispatch, useSelector } from 'react-redux';
import { setSortOption, setFilterOption, setSearchTerm } from '../state/podcastSlice';
import { setFavouriteSortOption, setFavouriteSearchTerm } from '../state/favouritesSlice';
import { useLocation } from 'react-router-dom';



export default function NavBar({ onFavoritesClick, onResetClick }) {
  const genres = useSelector((state) => state.podcasts.genres)
  const theme = useTheme();
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation()

  const isFavouritePage = location.pathname === "/favourites"

  const handleSort = (option) => {
    if (isFavouritePage) {
      dispatch(setFavouriteSortOption(option))
      handleSortMenuClose
    } else {
      dispatch(setSortOption(option));
      handleSortMenuClose()
    }
  };

  const handleFilter = (option) => {
    dispatch(setFilterOption(option))
    handleFilterMenuClose()
  };

  const handleSearchChange = (term) => {
    if (isFavouritePage) {
      dispatch(setFavouriteSearchTerm(term))
    } else {
      dispatch(setSearchTerm(term))
    }
  };

  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleResetClick = () => {
    onResetClick();
    handleSettingsMenuClose();
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        backgroundColor: theme.palette.NavBar.background,
        color: theme.palette.NavBar.color,
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
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </Search>
        <IconButton color="inherit" onClick={handleSortMenuOpen}>
          <SortIcon />
        </IconButton>
        <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={handleSortMenuClose}>
          <MenuItem onClick={() => handleSort('A-Z')}>Title A-Z</MenuItem>
          <MenuItem onClick={() => handleSort('Z-A')}>Title Z-A</MenuItem>
          <MenuItem onClick={() => handleSort('newest')}>Newest Added</MenuItem>
          <MenuItem onClick={() => handleSort('oldest')}>Oldest Added</MenuItem>
        </Menu>
        <IconButton color="inherit" onClick={handleFilterMenuOpen}>
          <FilterListIcon />
        </IconButton>
        <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterMenuClose}>
        <MenuItem onClick={() => handleFilter(null)}>Show All</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} onClick={() => handleFilter(genre)}>
              {genre.title}
            </MenuItem>
          ))}
        </Menu>
        <IconButton color="inherit" onClick={onFavoritesClick}>
          <FavoriteIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleSettingsMenuOpen}>
          <SettingsIcon />
        </IconButton>
        <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleSettingsMenuClose}>
          <MenuItem onClick={handleResetClick}>Reset Listening History</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

NavBar.propTypes = {
  onFavoritesClick: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
};