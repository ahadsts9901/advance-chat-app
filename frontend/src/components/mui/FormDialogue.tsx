import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialogue({ open, setOpen, text, setText, fun, isLoading }: any) {

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
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        await fun()
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
                        defaultValue={text}
                        onChange={(e: any) => setText(e?.target?.value)}
                        sx={{ width: "60vw",padding: "1em"}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={isLoading} onClick={handleClose}>Cancel</Button>
                    <Button disabled={isLoading} type="submit">Edit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}