import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { memberAPI } from '../services/api';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    sponsor_code: '',
    position: 'left'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sponsorInfo, setSponsorInfo] = useState(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const verifySponsorCode = async () => {
    if (!formData.sponsor_code) {
      setError('Please enter a sponsor code');
      return;
    }

    setVerifyingCode(true);
    setError('');
    setSponsorInfo(null);

    try {
      const response = await memberAPI.verifySponsor(formData.sponsor_code);
      if (response.data.valid) {
        setSponsorInfo(response.data.sponsor);
        setSuccess(`✓ Valid sponsor: ${response.data.sponsor.name}`);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid Sponsor Code');
      setSponsorInfo(null);
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      sponsor_code: formData.sponsor_code || null,
      position: formData.position
    });

    if (result.success) {
      setSuccess(
        `✓ Registration Successful!\n\n` +
        `Your Member Code: ${result.data.member_code}\n` +
        `Placed Under: ${result.data.placed_under}\n` +
        `Position: ${result.data.position.toUpperCase()}\n\n` +
        `Please save your member code for future reference.`
      );
      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        sponsor_code: '',
        position: 'left'
      });
      setSponsorInfo(null);

      // Redirect to login after 4 seconds
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Member Joining Form</h1>
          <p>Join our MLM Binary Tree Network</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message" style={{ whiteSpace: 'pre-line' }}>{success}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sponsor_code">
              Sponsor Code {formData.sponsor_code && '(Optional for first member)'}
            </label>
            <div className="sponsor-input-group">
              <input
                type="text"
                id="sponsor_code"
                name="sponsor_code"
                value={formData.sponsor_code}
                onChange={handleChange}
                placeholder="Enter sponsor code (e.g., MEM00001)"
              />
              <button
                type="button"
                onClick={verifySponsorCode}
                className="verify-btn"
                disabled={verifyingCode || !formData.sponsor_code}
              >
                {verifyingCode ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            {sponsorInfo && (
              <div className="sponsor-info">
                <p>✓ Sponsor: {sponsorInfo.name}</p>
                <p>Left: {sponsorInfo.left_filled ? '✖ Filled' : '✓ Available'}</p>
                <p>Right: {sponsorInfo.right_filled ? '✖ Filled' : '✓ Available'}</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="position">Preferred Position *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="position"
                  value="left"
                  checked={formData.position === 'left'}
                  onChange={handleChange}
                />
                <span>Left</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="position"
                  value="right"
                  checked={formData.position === 'right'}
                  onChange={handleChange}
                />
                <span>Right</span>
              </label>
            </div>
            <small className="helper-text">
              Note: If your preferred position is occupied, you will be automatically placed in the next available slot (Spill Logic).
            </small>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register Member'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;