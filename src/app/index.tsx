import { ConfigProvider } from 'antd';
import antdLocale from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/dist/locale/zh-cn';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ready as AMapReady } from '@/core/geo';

import { TripDetailPage } from './pages/TripDetailPage';
import { TripListPage } from './pages/TripListPage';

import 'antd/dist/antd.css';
import './index.less';

moment.locale('zh-cn');
(window as any).moment = moment;

async function main() {
  await AMapReady();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root = createRoot(document.querySelector('body > #tw-app-root')!);
  root.render(
    <ConfigProvider locale={antdLocale}>
      <AppRouter />
    </ConfigProvider>,
  );
}

const AppRouter = () => {
  return (
    <div className="tw-app">
      <HashRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to="trips" />} />
            <Route path="trips">
              <Route index element={<TripListPage />} />
              <Route path=":tripId" element={<TripDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
};

main();
