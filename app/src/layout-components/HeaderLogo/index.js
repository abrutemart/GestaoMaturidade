import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { Box } from '@material-ui/core';

import projectLogo from '../../assets/images/logogb.png';

const HeaderLogo = props => {
  return (
    <Fragment>
      <div className={clsx('app-header-logo', {})}>
        <Box
          className="header-logo-wrapper"
          title="Lobtec">
          <Link to="/DashboardDefault" className="header-logo-wrapper-link">
            <img
              className="app-header-logo-img"
              alt="Lobtec"
              src={projectLogo}
            />
          </Link>
        </Box>
      </div>
    </Fragment>
  );
};

export default HeaderLogo;
