import "../main.css"
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { IconButton } from '@mui/material';
import { BsEmojiSmile } from "react-icons/bs";

export default function FormDialogue({ open, setOpen, text, setText, fun, isLoading }: any) {

    const emojiPickerRef = React.useRef<HTMLDivElement>(null);

    const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false)

    React.useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) setShowEmojiPicker(false)
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [emojiPickerRef]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => setText((prevText: any) => prevText + emojiData?.emoji);

    return (
        <React.Fragment>
            <Dialog
                className="dialog-sts"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        await fun()
                    },
                    sx: {
                        position: 'absolute',
                        top: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 800,
                    }
                }}
            >
                <DialogTitle>Edit message</DialogTitle>
                <DialogContent className='dialogContent-sts' sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: "1em",
                }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        variant="standard"
                        multiline
                        value={text}
                        onChange={(e: any) => setText(e?.target?.value)}
                        sx={{ width: "60vw", padding: "1em" }}
                        placeholder='Enter message'
                    />
                    <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} sx={{ marginLeft: "1em" }}>
                        <BsEmojiSmile />
                    </IconButton>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isLoading} onClick={handleClose}>Cancel</Button>
                    <Button disabled={isLoading} type="submit">Edit</Button>
                </DialogActions>
            </Dialog>
            {
                showEmojiPicker ?
                    <div className="emojiPickerCont-sts" ref={emojiPickerRef}>
                        <EmojiPicker searchPlaceHolder="Search emoji" onEmojiClick={handleEmojiClick} />
                    </div>
                    : null
            }
        </React.Fragment>
    );
}