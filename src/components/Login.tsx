const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=6b765ffc9a314d22a1c14dba65be55cc&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

const Login = () => {
  return (
    <div className="container">
      <a href={AUTH_URL}>Login with spotify</a>
    </div>
  );
};

export default Login;
