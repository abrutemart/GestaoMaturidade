import React, { Fragment } from 'react';

import { PageTitle } from '../../layout-components';

import Cookies from 'universal-cookie';


import DashboardDefaultSection1 from '../../example-components/DashboardDefault/DashboardDefaultSection1';
import DashboardDefaultSection2 from '../../example-components/DashboardDefault/DashboardDefaultSection2';
import DashboardDefaultSection3 from '../../example-components/DashboardDefault/DashboardDefaultSection3';
import DashboardDefaultSection4 from '../../example-components/DashboardDefault/DashboardDefaultSection4';
export default function DashboardDefault() {
  const cookies = new Cookies();
  
  return (
    <Fragment>
       <PageTitle
        /* titleHeading="Default"
        titleDescription="This is a dashboard page example built using this template." */
      />
{/*
      <DashboardDefaultSection1 />
      <DashboardDefaultSection2 />
      <DashboardDefaultSection3 />
      <DashboardDefaultSection4 /> */}
    </Fragment>
  );
}
