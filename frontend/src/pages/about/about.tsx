// mcbcMERN/frontend/src/pages/about/about.tsx

import React from 'react';
import { Link } from 'react-router-dom';

import './about.css';

const About: React.FC = () => {
  return (
    <div>
      <h1>About</h1>
      <Link to="/">Home</Link>
    </div>
  );
};

export default About;
