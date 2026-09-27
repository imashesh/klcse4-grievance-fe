import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { login as loginAPI } from "./api";
import useHashRouter from "./hooks/useHashRouter";
import WelcomeScreen from "./components/WelcomeScreen";
import LoginScreen from "./components/LoginScreen";
import Shell from "./components/Shell";

const STORAGE_KEY = "kl_grievance_user";

function getSavedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore corrupt data */ }
  return null;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(getSavedUser);
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState(null);

  // Determine default path based on whether user is logged in
  const defaultPath = currentUser ? "/dashboard" : "/welcome";
  const { path, navigate, replace } = useHashRouter(defaultPath);

  // Keep localStorage in sync with currentUser
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // When user logs in or out, sync the hash path
  useEffect(() => {
    if (currentUser && (path === "/welcome" || path === "/login")) {
      replace("/dashboard");
    }
    if (!currentUser && path.startsWith("/dashboard")) {
      replace("/login");
    }
  }, [currentUser, path, replace]);

  function showToast(msg, kind = "success") {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3200);
  }

  async function handleLogin(id, password) {
    try {
      const user = await loginAPI(id, password);
      setLoginError("");
      setCurrentUser(user);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Please try again.";
      setLoginError(msg);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    navigate("/login");
  }

  // --- Routing logic ---
  // Not logged in: show Welcome or Login based on hash
  if (!currentUser) {
    if (path === "/login") {
      return (
        <LoginScreen
          onLogin={handleLogin}
          error={loginError}
          clearError={() => setLoginError("")}
          onBack={() => { setLoginError(""); navigate("/welcome"); }}
        />
      );
    }
    // Default: welcome
    return <WelcomeScreen onSignIn={() => navigate("/login")} />;
  }

  // Logged in: show dashboard
  return (
    <>
      <Shell
        currentUser={currentUser}
        onLogout={handleLogout}
        showToast={showToast}
        navigate={navigate}
        currentPath={path}
      />
      {toast && <div className={`toast toast-${toast.kind}`}>{toast.msg}</div>}
    </>
  );
}
