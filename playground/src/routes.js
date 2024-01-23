import { lazy } from 'react';

import { NotFound } from 'component/ui';

const SampleDefinition = lazy(() => import('./pages/sample-definition'));
const SampleList = lazy(() => import('./pages/sample-list'));
const SampleDetail = lazy(() => import('./pages/sample-detail'));
const SampleUpdate = lazy(() => import('./pages/sample-update'));

export default [
  {
    name: 'SampleDefinition',
    module: '/playground',
    path: '/sample-definition',
    component: SampleDefinition,
    uiKey: 'u7e7c13a017',
  },
  {
    name: 'SampleList',
    module: '/playground',
    path: '/sample-list',
    component: SampleList,
    uiKey: 'u24bddfade6',
  },
  {
    name: 'SampleDetail',
    module: '/playground',
    path: '/sample-detail',
    component: SampleDetail,
    uiKey: 'u29dhazade8',
  },
  {
    name: 'SampleUpdate',
    module: '/playground',
    path: '/sample-update',
    component: SampleUpdate,
    uiKey: 'u747cnga007',
  },
  {
    name: 'NotFound',
    module: '/playground',
    path: '*',
    component: NotFound,
  },
];
