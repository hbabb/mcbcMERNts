// mcbcMERN/frontend/src/routes/router.tsx
/** @type {import('react-router-dom').RouteObject} */

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// lazy loading
const Home = React.lazy(() => import('../pages/home/index'));
const About = React.lazy(() => import('../pages/about/about'));
const Missions = React.lazy(() => import('../pages/about/missions/missions'));
const School = React.lazy(() => import('../pages/about/school/school'));
const Staff = React.lazy(() => import('../pages/about/staff/staff'));
const Admin = React.lazy(() => import('../pages/admin/admin'));
const Blogs = React.lazy(() => import('../pages/blog/blogs'));
const BlogPost = React.lazy(() => import('../pages/blog/post/blogPost'));
const Contact = React.lazy(() => import('../pages/contact/contact'));
const Prayer = React.lazy(() => import('../pages/prayer/prayer'));
const Event = React.lazy(() => import('../pages/event/events'));
const EventPost = React.lazy(() => import('../pages/event/post/eventPost'));

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/missions" element={<Missions />} />
        <Route path="/about/school" element={<School />} />
        <Route path="/about/staff" element={<Staff />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/blog" element={<Blogs />} />
        <Route path="/blog/Post" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/prayer" element={<Prayer />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event/Post" element={<EventPost />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
