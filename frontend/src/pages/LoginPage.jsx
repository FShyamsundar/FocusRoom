import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import InputField from "../components/common/InputField";
import Logo from "../components/common/Logo";
import { clearAuthError, loginUser } from "../features/auth/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate(location.state?.from || "/room", { replace: true });
    }

    return () => dispatch(clearAuthError());
  }, [dispatch, location.state, navigate, token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    dispatch(
      loginUser({
        email: formData.get("email"),
        password: formData.get("password"),
      })
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-xl p-8">
        <Logo />
        <div className="mt-8">
          <h1 className="font-display text-4xl text-ink">Welcome back</h1>
          <p className="mt-3 text-muted">Return to the room and let your next block begin.</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <InputField label="Email" name="email" type="email" placeholder="you@example.com" required />
          <InputField label="Password" name="password" type="password" placeholder="Your password" required />
          {error && <p className="text-sm text-[#9b4d4d]">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted">
          New here?{" "}
          <Link to="/register" className="text-accent">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
