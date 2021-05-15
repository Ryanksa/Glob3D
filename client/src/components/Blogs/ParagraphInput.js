import React from 'react';
import './Blogs.scss';
import TextField from '@material-ui/core/TextField';

const ParagraphInput = () => (
    <TextField
      className="blog-paragraph blog-section"
      label="Write a paragraph..."
      multiline
      rows={10}
      variant="outlined"
    />
);

export default ParagraphInput;