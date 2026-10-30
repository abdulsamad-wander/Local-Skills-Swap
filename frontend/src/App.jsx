import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./page/Home.jsx";
import Login from "./page/Login.jsx";
import SignUp from "./page/SignUp.jsx";
import OnBoarding from "./page/OnBoarding.jsx";
import ChatPage from "./page/ChatPage.jsx";
import CallPage from "./page/CallPage.jsx";
import Notifications from "./page/Notifications.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import Friends from "./page/Friends.jsx";
import Settings from "./page/Settings.jsx";
import ChatProvider from "./context/ChatProvider.jsx";

function App() {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen" data-theme={theme}>
      <ChatProvider>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true} title="Home">
                <Home />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUp />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnBoarded ? (
                <OnBoarding />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true} title="Chat" fullBleed>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true} title="Friends">
                <Friends />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnBoarded ? (
                <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true} title="Settings">
                <Settings />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true} title="Notifications">
                <Notifications />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      </Routes>
      </ChatProvider>
      <Toaster position="top-center" toastOptions={{ className: "font-semibold" }} />
    </div>
  );
}

export default App;
