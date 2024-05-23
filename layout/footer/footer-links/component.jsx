import { useMemo, useCallback } from 'react';
import classnames from 'classnames';
import Link from 'next/link';

// hooks
import { useFeaturedDashboards } from 'hooks/dashboard';

// constants
import { FOOTER_LINKS } from './constants';

export default function FooterLinks() {

  const footerMenu = useMemo(
    () =>
      FOOTER_LINKS.map((i) => {
        const children = i.children || [];
        return [...[i], ...children];
      }),
    [],
  );

  const getMenuItems = useCallback(
    () =>
      footerMenu.map((subMenu) => (
        <div className="c-compound-menu-item" key={subMenu[0].label}>
          <ul className="subMenu">
            {subMenu.map((item, index) => {
              let link;
              if (item.href) {
                link = (
                  <Link href={item.href}>
                    <a>{item.label}</a>
                  </Link>
                );
              }

              if (item.isExternalLink) {
                link = (
                  <a href={item.href} role="button" tabIndex={-1}>
                    {item.label}
                  </a>
                );
              }

              return (
                <li
                  key={item.id || item.label}
                  className={classnames('item', {
                    title: index === 0,
                  })}
                >
                  {index === 0 ? <h3>{item.label}</h3> : link}
                </li>
              );
            })}
          </ul>
        </div>
      )),
    [footerMenu],
  );

  return (
    <nav className="c-compound-menu">
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <div className="c-compound-menu-wrapper">{getMenuItems()}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
