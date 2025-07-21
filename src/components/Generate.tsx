
import { Outlet } from 'react-router';
import Header from './Header';

function Generate() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default Generate;