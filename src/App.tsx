const LoginPage = () => {
  const handleSSOLogin = () => {
    window.location.href = "https://bannano-api-eha2esbgbkdzdchj.canadacentral-01.azurewebsites.net/auth/microsoft_login";  
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome</h2>
        <button onClick={handleSSOLogin} style={styles.button}>
          Login with SSO
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f0f2f5",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  } as const,
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center", // <- This is the line TypeScript complained about
  } as const,
  title: {
    marginBottom: "30px",
  } as const,
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#1677ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  } as const,
};


export default LoginPage;
