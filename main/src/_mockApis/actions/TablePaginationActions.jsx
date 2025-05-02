import React from "react";
import {
  IconButton,
  Box,
} from "@mui/material";
import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage as LastPageIcon,
} from "@mui/icons-material";

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
    const handleFirstPage = (event) => onPageChange(event, 0);
    const handleBack = (event) => onPageChange(event, page - 1);
    const handleNext = (event) => onPageChange(event, page + 1);
    const handleLastPage = (event) => onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPage} disabled={page === 0} aria-label="first page">
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBack} disabled={page === 0} aria-label="previous page">
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton onClick={handleNext} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
                <KeyboardArrowRight />
            </IconButton>
            <IconButton onClick={handleLastPage} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
                <LastPageIcon />
        </IconButton>
        </Box>
    );
};

export default TablePaginationActions;