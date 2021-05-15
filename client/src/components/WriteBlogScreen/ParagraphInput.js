import React from 'react';
import './WriteBlogScreen.scss';
import TextField from '@material-ui/core/TextField';

const ParagraphInput = () => (
    <TextField
      className="blog-paragraph-input blog-section"
      label="Write a paragraph..."
      multiline
      rows={10}
      variant="outlined"
    />
);

export default ParagraphInput;