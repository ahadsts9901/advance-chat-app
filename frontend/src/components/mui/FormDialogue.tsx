import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialogue({ open, setOpen, text }: any) {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Edit message</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        fullWidth
                        variant="standard"
                        multiline
                        value={text}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Edit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}