const AUTH_URL = import.meta.env.VITE_AUTH_URL;

const Login = () => {
  return (
    <div className="container">
      <a href={AUTH_URL}>Login with spotify</a>
    </div>
  );
};

export default Login;
