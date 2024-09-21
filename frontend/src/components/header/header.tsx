// Navbar.tsx
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './header.scss'; // Import the SCSS file

const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="nav" className={`navbar ${isOpen ? 'open' : ''}`}>
      <Flex className="navbar-container">
        <Link as={RouterLink} to="/" className="navbar-link">
          Home
        </Link>

        {/* Full navigation links */}
        <Flex className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <Menu>
            <MenuButton as={Button} className="menu-button">
              About
            </MenuButton>
            <MenuList className="menu-list">
              <MenuItem as={RouterLink} to="/about" className="navbar-link">
                About Us
              </MenuItem>
              <MenuItem
                as={RouterLink}
                to="/about/missions"
                className="navbar-link"
              >
                Missions
              </MenuItem>
              <MenuItem
                as={RouterLink}
                to="/about/school"
                className="navbar-link"
              >
                School
              </MenuItem>
              <MenuItem
                as={RouterLink}
                to="/about/staff"
                className="navbar-link"
              >
                Staff
              </MenuItem>
            </MenuList>
          </Menu>
          <Link as={RouterLink} to="/blog" className="navbar-link">
            Blog
          </Link>
          <Link as={RouterLink} to="/contact" className="navbar-link">
            Contact
          </Link>
          <Link as={RouterLink} to="/prayer" className="navbar-link">
            Prayer
          </Link>
          <Link as={RouterLink} to="/event" className="navbar-link">
            Events
          </Link>
          <Link as={RouterLink} to="/admin" className="navbar-link">
            Admin
          </Link>
        </Flex>

        {/* Hamburger menu button for mobile */}
        <IconButton
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          className="hamburger-menu"
          onClick={isOpen ? onClose : onOpen}
          style={{ display: 'none' }}
        />
      </Flex>

      {/* Mobile navigation */}
      {isOpen && (
        <Box className="mobile-nav">
          <Flex direction="column">
            <Link as={RouterLink} to="/" className="navbar-link">
              Home
            </Link>
            <Menu>
              <MenuButton as={Button} className="menu-button">
                About
              </MenuButton>
              <MenuList className="menu-list">
                <MenuItem as={RouterLink} to="/about" className="navbar-link">
                  About Us
                </MenuItem>
                <MenuItem
                  as={RouterLink}
                  to="/about/missions"
                  className="navbar-link"
                >
                  Missions
                </MenuItem>
                <MenuItem
                  as={RouterLink}
                  to="/about/school"
                  className="navbar-link"
                >
                  School
                </MenuItem>
                <MenuItem
                  as={RouterLink}
                  to="/about/staff"
                  className="navbar-link"
                >
                  Staff
                </MenuItem>
              </MenuList>
            </Menu>
            <Link as={RouterLink} to="/blog" className="navbar-link">
              Blog
            </Link>
            <Link as={RouterLink} to="/contact" className="navbar-link">
              Contact
            </Link>
            <Link as={RouterLink} to="/prayer" className="navbar-link">
              Prayer
            </Link>
            <Link as={RouterLink} to="/event" className="navbar-link">
              Events
            </Link>
            <Link as={RouterLink} to="/admin" className="navbar-link">
              Admin
            </Link>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
