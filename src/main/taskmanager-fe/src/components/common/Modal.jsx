import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalComponent = ({ isOpen, onClose, title, children }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <Typography id="modal-title" variant="h6" component="h2">
                        {title}
                        <IconButton onClick={onClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </Typography>
                </div>
                <div id="modal-description">
                    {children}
                </div>
            </Box>
        </Modal>
    );
};

export default ModalComponent;
