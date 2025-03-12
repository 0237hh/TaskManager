function GoogleLoginButton() {
    return (
        <a
            href="http://localhost:8080/oauth2/authorization/google"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '24px',
                padding: '10px 15px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#5f6368',
                cursor: 'pointer',
                textDecoration: 'none',
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
            <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                style={{width: '18px', height: '18px', marginRight: '10px'}}
            />
            Google로 로그인
        </a>
    );
}

export default GoogleLoginButton;
