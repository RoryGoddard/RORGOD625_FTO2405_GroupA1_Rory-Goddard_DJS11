import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from '@mui/material';
import PropTypes from 'prop-types';

const ResetConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action cannot be undone. This will permanently delete your entire listening history.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Reset History
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetConfirmationDialog;

ResetConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};