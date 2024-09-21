// mcbcMERN/frontend/src/components/footer/footer.tsx

import { Icon } from '@chakra-ui/react';
import React from 'react';
import { FaFacebook } from 'react-icons/fa';

import './footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <section className="copyright">
        <p>
          &copy; {new Date().getFullYear()} Motlow Creek Baptist Church. All
          rights reserved. <em className="construction">Under Construction</em>
        </p>
      </section>
      <section className="social">
        <a href="https://www.facebook.com/profile.php?id=100064495938328">
          <Icon as={FaFacebook} />
        </a>
      </section>
    </footer>
  );
};
