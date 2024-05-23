import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

// components
import Icon from 'components/ui/icon';

// constants
import { APP_HEADER_ITEMS } from 'layout/header/constants';

const HeaderMenuMobile = ({ header, user, setMobileOpened }) => {
  const { pathname } = useRouter();
  const { mobileOpened } = header;
  const classNames = classnames({ '-opened': mobileOpened });

  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileOpened);
  }, [mobileOpened]);

  return (
    <div className="c-header-menu-mobile">
      <button
        className="c-button -secondary -alt -compressed header-burger-button"
        onClick={() => setMobileOpened(true)}
      >
        Menu
      </button>

      <div className={`header-menu-mobile-content ${classNames}`}>
        {/* Backdrop */}
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          className={`c-button -clean header-menu-mobile-backdrop ${classNames}`}
          onClick={() => setMobileOpened(false)}
        />

        {/* Nav */}
        <nav className={`header-menu-mobile-nav ${classNames}`}>
          <button
            className="c-button -secondary -compressed -square header-close-button"
            onClick={() => setMobileOpened(false)}
          >
            <Icon name="icon-cross" className="-smaller" />
          </button>

          <ul>
            {APP_HEADER_ITEMS.map((item) => {
              return (
                <li
                  key={item.label}
                  className={classnames({ '-active': pathname.startsWith(item.root) })}
                >
                  {item.href && !item.external && (
                    <h2>
                      <Link href={item.href}>
                        <a>{item.label}</a>
                      </Link>
                    </h2>
                  )}

                  {item.href && item.external && (
                    <h2>
                      <a href={item.href}>{item.label}</a>
                    </h2>
                  )}

                  {!item.href && <h2>{item.label}</h2>}

                  {item.children && (
                    <ul>
                      {item.children.map((c) => {
                        return (
                          <li key={c.label}>
                            {c.href && (
                              <Link href={c.href}>
                                <a>{c.label}</a>
                              </Link>
                            )}
                            {c.href && c.external && <a href={c.href}>{c.label}</a>}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

HeaderMenuMobile.propTypes = {
  header: PropTypes.shape({
    mobileOpened: PropTypes.bool.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  setMobileOpened: PropTypes.func.isRequired,
};

export default HeaderMenuMobile;
