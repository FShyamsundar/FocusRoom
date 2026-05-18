import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import InputField from "../components/common/InputField";
import Logo from "../components/common/Logo";
import { clearAuthError, registerUser } from "../features/auth/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/room", { replace: true });
    }

    return () => dispatch(clearAuthError());
  }, [dispatch, navigate, token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    dispatch(
      registerUser({
        name: formData.get("name"),
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
          <h1 className="font-display text-4xl text-ink">Create your room identity</h1>
          <p className="mt-3 text-muted">
            One account, one quiet room, and a clearer commitment to focused work.
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <InputField label="Name" name="name" type="text" placeholder="Shyam Reddy" required />
          <InputField label="Email" name="email" type="email" placeholder="you@example.com" required />
          <InputField label="Password" name="password" type="password" placeholder="At least 6 characters" required />
          {error && <p className="text-sm text-[#9b4d4d]">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted">
          Already joined?{" "}
          <Link to="/login" className="text-accent">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
