

interface LoadingStateProps {
  message: string;
  subtitle?: string;
}

const LoadingState = ({ message, subtitle }: LoadingStateProps) => (
  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
    <h2>{message}</h2>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

export default LoadingState;
