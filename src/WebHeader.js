import React, { Component, PropTypes } from 'react';
import Head from './Head';
import Item from './Item';
import defaultMenuItems from './menu-items.json';
import styles from './WebHeader.styl';
import classNames from 'classnames/bind';
import cxN from 'classnames';

const cx = classNames.bind(styles);

class WebHeader extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    menuItems: PropTypes.array,
    theme: PropTypes.oneOf(['light', 'dark']),
    featuredEnable: PropTypes.bool,
    featuredLink: PropTypes.string,
    featuredText: PropTypes.string,
    primaryButtonEnable: PropTypes.bool,
    primaryButtonLink: PropTypes.string,
    primaryButtonOnClick: PropTypes.func,
    primaryButtonText: PropTypes.string,
    secondaryButtonEnable: PropTypes.bool,
    secondaryButtonLink: PropTypes.string,
    secondaryButtonOnClick: PropTypes.func,
    secondaryButtonText: PropTypes.string,
    breakpoint: PropTypes.number
  };

  static defaultProps = {
    className: '',
    children: null,
    menuItems: defaultMenuItems,
    theme: 'light',
    featuredEnable: true,
    featuredLink: 'https://auth0.com/jobs',
    featuredText: 'We\'re hiring!',
    primaryButtonEnable: true,
    primaryButtonLink: '',
    primaryButtonOnClick: () => {},
    primaryButtonText: 'Log in',
    secondaryButtonEnable: true,
    secondaryButtonLink: '?contact=true',
    secondaryButtonOnClick: () => {},
    secondaryButtonText: 'Talk to sales',
    breakpoint: 992
  };

  constructor(props) {
    super(props);

    this.navbarDropdownHandler = ::this.navbarDropdownHandler;
    this.handleResize = ::this.handleResize;
  }

  state = {
    navbarDropdownIsOpen: false,
    mobileState: true
  };

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    if (window.innerWidth < this.props.breakpoint) return this.setState({ mobileState: true });
    return this.setState({ mobileState: false });
  }

  navbarDropdownHandler() {
    this.setState({ navbarDropdownIsOpen: !this.state.navbarDropdownIsOpen });
  }

  renderButton(link, onClick, text, className) {
    return !!link
      ? <a href={link} className={className}>{text}</a>
      : <button className={className} onClick={onClick}>{text}</button>;
  }

  render() {
    const {
      className,
      children,
      menuItems,
      theme,
      featuredEnable,
      featuredLink,
      featuredText,
      primaryButtonEnable,
      primaryButtonLink,
      primaryButtonOnClick,
      primaryButtonText,
      secondaryButtonEnable,
      secondaryButtonLink,
      secondaryButtonOnClick,
      secondaryButtonText
    } = this.props;
    const { navbarDropdownIsOpen, mobileState } = this.state;

    const primaryButton = this.renderButton(
      primaryButtonLink,
      primaryButtonOnClick,
      primaryButtonText,
      'btn btn-success btn-sm'
    );
    const secondaryButton = this.renderButton(
      secondaryButtonLink,
      secondaryButtonOnClick,
      secondaryButtonText,
      'btn btn-transparent btn-sm'
    );
    const renderedMenuItems = menuItems.map(item =>
      <Item
        key={item.position + item.id}
        item={item}
        theme={theme}
        simpleList={item.simpleList}
      />
    );

    return (
      <header
        className={cx('siteHeader', [`theme-${theme}`], {
          dropdownOpen: navbarDropdownIsOpen
        }, className)}
      >
        <nav>
          <div className="container">
            <Head
              toggleDropdownHandler={this.navbarDropdownHandler}
              featured={featuredEnable}
              featuredLink={featuredLink}
              featuredText={featuredText}
              dropdownOpen={navbarDropdownIsOpen}
              theme={theme}
            />
            <div
              className={cx('collapse', {
                dropdownOpen: navbarDropdownIsOpen,
                in: navbarDropdownIsOpen
              })}
            >
              <ul className={cx('navigationLeft')}>{!!children ? children : renderedMenuItems}</ul>
              <ul
                className={cxN(cx('navigationRight'), {
                  'theme-dark': theme === 'dark' && !mobileState
                })}
              >
                {secondaryButtonEnable ? secondaryButton : null}
                {primaryButtonEnable ? primaryButton : null}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default WebHeader;
