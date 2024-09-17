//mcbcMERN/frontend/src/pages/event/Post/eventPost.tsx

import React from 'react';
import { useParams } from 'react-router-dom';

import './eventPost.css';

const EventPost: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Use useParams to get the id from the route

  return (
    <div>
      <h1>Event Post by ID: {id}</h1>
    </div>
  );
};

export default EventPost;
