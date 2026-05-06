import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const EmployerLayout = ({ setUser }) => {
  return (
    <div className="employer-layout">
      <Sidebar setUser={setUser} />
      <main className="employer-main">
        <Outlet /> {/* Nested routes render here */}
      </main>
    </div>
  );
};

export default EmployerLayout;