import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
    return (
        <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Global Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    zIndex: -2,
                    transform: 'translate(-50%, -50%)',
                    objectFit: 'cover'
                }}
                poster="/admission-side.png"
            >
                <source src="/vid reg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(139, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%)',
                zIndex: -1,
                pointerEvents: 'none'
            }}></div>

            <RegisterForm />
        </main>
    )
}
