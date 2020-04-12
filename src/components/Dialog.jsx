import React, { useRef } from "react";
import { func, bool, arrayOf, number } from "prop-types";
import {
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Box,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Button, ClearButton, Chart } from "../components";
import { any } from "prop-types";
import { useCallback } from "react";

const useDialogStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.bkgs.main,
    borderRadius: theme.shape.borderRadius * 4,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important",
      margin: 0,
    },
  },
}));

const CustomDialog = ({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  ...props
}) => {
  const dialogClasses = useDialogStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={dialogClasses}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      transitionDuration={0}
      {...props}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        {description && (
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

CustomDialog.propTypes = {
  open: bool.isRequired,
  onClose: func,
  title: any,
  description: any,
  children: any,
  actions: any,
};

CustomDialog.defaults = {
  onClose: null,
  children: null,
  actions: null,
  title: null,
  description: null,
};

const ClearDataDialog = ({ open, dismiss, confirm }) => {
  const { t } = useTranslation();
  return (
    <CustomDialog
      open={open}
      onClose={dismiss}
      title={t("clearDataTitle")}
      description={t("clearDataWarning")}
      actions={
        <>
          <Button onClick={dismiss} variant="text">
            {t("cancel")}
          </Button>
          <ClearButton onClick={confirm} />
        </>
      }
    />
  );
};

ClearDataDialog.propTypes = {
  open: bool.isRequired,
  dismiss: func.isRequired,
  confirm: func.isRequired,
};

const ShareDialog = ({ open, filters, onClose, ...props }) => {
  const { t } = useTranslation();
  const inputRef = useRef();
  const location = window.location.toString();
  const handleCopy = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, location.length, "backward");
      document.execCommand("copy");
    }
  }, [location]);

  const actions = (
    <>
      <Typography>{t("shareClipboard")}</Typography>
      <Box mx={{ xs: "0", sm: "1" }} width="50%">
        <TextField
          id="url"
          type="text"
          fullWidth
          inputRef={inputRef}
          onTouchEnd={handleCopy}
          onClick={handleCopy}
          onFocus={handleCopy}
          value={location}
        />
      </Box>
      <Button onClick={handleCopy}>{t("copyButton")}</Button>
      <Button onClick={onClose}>{t("closeButton")}</Button>
    </>
  );
  const description = t("shareDialog");
  return (
    <CustomDialog
      open={open}
      maxWidth="md"
      fullWidth
      actions={actions}
      description={description}
      {...props}
    >
      {open && (
        <Box mx={[-2.5, 0]}>
          <Chart filters={filters} />
        </Box>
      )}
    </CustomDialog>
  );
};

ShareDialog.propTypes = {
  open: bool.isRequired,
  filters: arrayOf(number).isRequired,
  onClose: func.isRequired,
};

export { CustomDialog as Dialog, ClearDataDialog, ShareDialog };
