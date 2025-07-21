import { Route, Routes } from 'react-router-dom';
import PublicLayout from './Layouts/PublicLayout';
import HomePage from './Routes/Home';
import AuthenticationLayout from './Layouts/AuthLayout';
import SignInPage from './Routes/SignInPage';
import SignUpPage from './Routes/SignUpPage';
import MainLayout from './Layouts/MainLayout';
import ProtectedRoutes from './Layouts/Protected_Routes';
import Generate from './components/Generate';
import {Dashboard} from './Routes/Dashboard';
import CreateEditPages from './Routes/CreateEditPages';
import {MockLoadPage} from './Routes/MockLoadPage';
import {MockInterviewPage} from './Routes/MockInterviewPage';
import {Feedback} from './Routes/Feedback';
function App() {
  return (
    <div>
      
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Authentication routes */}
        <Route path="/" element={<AuthenticationLayout />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
        </Route>

      


      {/* add all the protect routes */}
<Route  path = "/generate" element={<Generate />} >
    <Route index element={<Dashboard />} />
    <Route path = ":interviewId" element = {<CreateEditPages/>} />
    <Route path = "interview/:interviewId" element = {<MockLoadPage />} />
    <Route path="interview/:interviewId/start" element={<MockInterviewPage />} />
    <Route path="feedback/:interviewId" element={<Feedback />} />
</Route>

</Routes>
    </div>
  );
}

export default App;