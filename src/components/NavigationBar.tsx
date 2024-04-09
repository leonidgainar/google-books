import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

const NavigationBar: React.FC = () => {
  const location = useLocation();

  const [selectedKey, setSelectedKey] = useState<string>('search');

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setSelectedKey('search');
        break;
      case '/favorites':
        setSelectedKey('favorites');
        break;
      default:
        setSelectedKey('404');
    }
  }, [location.pathname]);

  return (
    <Menu mode="horizontal"
      style={{ marginBottom: 20 }}
      selectedKeys={[selectedKey]}
      items={[
        {
          key: 'search',
          label: <Link to="/">Search</Link>,
          title: 'Search'
        },
        {
          key: 'favorites',
          label: <Link to="/favorites">Favorites</Link>,
          title: 'Favorites'
        },
      ]}
    />
  );
};

export default NavigationBar;
