import { createElement } from 'react';
import classnames from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';

// components
import { APP_HEADER_ITEMS } from 'layout/header/constants';

const header = {
  menu: import('../header-menu'),
  'menu-mobile': import('../header-menu-mobile'),
};

const HeaderMenu = () => {
  const { pathname } = useRouter();

  return (
    <nav className="header-menu">
      <ul>
        {APP_HEADER_ITEMS.map((item) => {
          let DropdownMenu;
          if (!['home', 'coastal-profiles', 'coral-reef-dashboards', 'about', 'partners'].includes(item.id)) {
            DropdownMenu = dynamic(() => header[item.id]);
          }

          return (
            <li
              key={item.label}
              className={classnames({
                '-active': pathname.startsWith(item.root),
              })}
            >
              {!DropdownMenu && item.href && !item.external && (
                <Link href={item.href}>
                  <a>{item.label}</a>
                </Link>
              )}

              {!DropdownMenu && item.external && <a href={item.href}>{item.label}</a>}

              {DropdownMenu && createElement(DropdownMenu, item)}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default HeaderMenu;
