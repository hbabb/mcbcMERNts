// File: src/pages/blog/[id]/blog[id].tsx

import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook

import './blogPost.css';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Use useParams to get the id from the route

  return (
    <div>
      <h1>Blog Post by ID: {id}</h1>
    </div>
  );
};

export default BlogPost;
