import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import { RegisterRequest } from '../../interfaces/auth';
import './Register.css';

interface PasswordStrength {
  score: number;
  message: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    message: ''
  });

  const validatePassword = (password: string): PasswordStrength => {
    let score = 0;
    let message = '';

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) {
      message = 'Weak';
    } else if (score <= 3) {
      message = 'Medium';
    } else {
      message = 'Strong';
    }

    return { score, message };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate password strength
    if (passwordStrength.score <= 2) {
      setError('Please choose a stronger password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      localStorage.setItem('api_key', response.api_key);
      navigate('/lists');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
    
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength.score <= 2) return 'strength-weak';
    if (passwordStrength.score <= 3) return 'strength-medium';
    return 'strength-strong';
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join us to start organizing your tasks</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              autoComplete="username"
              autoFocus
              minLength={3}
              maxLength={30}
              aria-describedby={error ? "register-error" : undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
              aria-describedby={error ? "register-error" : undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              autoComplete="new-password"
              minLength={8}
              aria-describedby={error ? "register-error" : "password-requirements"}
            />
            <div id="password-requirements" className="password-requirements">
              Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters
            </div>
            {formData.password && (
              <div className="password-strength">
                <div 
                  className={`password-strength-bar ${getPasswordStrengthClass()}`}
                  role="progressbar"
                  aria-valuenow={passwordStrength.score}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-label={`Password strength: ${passwordStrength.message}`}
                />
              </div>
            )}
          </div>

          {error && (
            <div 
              className="error-message" 
              id="register-error" 
              role="alert"
            >
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || !formData.username || !formData.email || !formData.password}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}; 