import React, {Component, PropTypes} from 'react';
import * as session from '../session';

class SignUp extends Component {
  state = {
    step: 1,
    agreeToTerms: false,
    loading: false,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    error: '',
  };

  _handleUpdateInput = e => {
    this.setState({[e.target.name]: e.target.value, error: ''});
  };

  _handleUpdatePasswordConfirm = e => {
    this._handleUpdateInput(e);

    if (this.state.password !== e.target.value) {
      e.target.setCustomValidity('Passwords did not match');
    } else {
      e.target.setCustomValidity('');
    }
  };

  _handleBack = e => {
    e.preventDefault();
    this.setState({step: this.state.step - 1});
  };

  _handleSubmit = async e => {
    e.preventDefault();

    if (this.state.step < 2) {
      this.setState({step: this.state.step + 1});
      return;
    }

    if (!this.state.agreeToTerms) {
      alert('Please verify that you agree to the terms of service');
      return;
    }

    this.setState({loading: true});

    try {
      await session.signupAndLogin(
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        this.state.password,
      );
      window.location = '/app/';
    } catch (err) {
      console.error('Failed to sign up', err);
      this.setState({error: err.message, loading: false});
    }
  };

  renderStep1 () {
    const {error, loading} = this.state;
    return (
      <div key="step-1">
        <div className="form-row">
          <div className="form-control">
            <label>First Name *
              <input type="text"
                     name="firstName"
                     placeholder="Maria"
                     defaultValue={this.state.firstName}
                     onChange={this._handleUpdateInput}
                     autoFocus
                     required/>
            </label>
          </div>
          <div className="form-control">
            <label>Last Name
              <input type="text"
                     name="lastName"
                     placeholder="Garcia"
                     defaultValue={this.state.lastName}
                     onChange={this._handleUpdateInput}/>
            </label>
          </div>
        </div>
        <div className="form-control">
          <label>Email Address *
            <input type="email"
                   name="email"
                   placeholder="name@domain.com"
                   defaultValue={this.state.email}
                   onChange={this._handleUpdateInput}
                   required/>
          </label>
        </div>
        <div className="form-control">
          <label>Password * <span className="subtle">(minimum 8 characters)</span>
            <input type="password"
                   name="password"
                   onChange={this._handleUpdateInput}
                   defaultValue={this.state.password}
                   placeholder="•••••••••••••"
                   pattern=".{8,}"
                   required/>
          </label>
        </div>
        {error ? <div className="form-control error">** {error}</div> : null}
        <div className="form-row padding-top-sm">
          <div className="form-control">
            or, <a href="/app/login">Log In</a>
          </div>
          <div className="form-control right">
            {loading ?
              <button type="button" disabled className="button">Loading</button> :
              <button type="submit" className="button">Proceed to Next Step</button>
            }
          </div>
        </div>
      </div>
    )
  }

  renderStep2 () {
    const {error, loading, agreeToTerms} = this.state;
    return (
      <div key="step-2">
        <div className="form-control">
          <p className="notice info small">
            Keep your password safe because it cannot be recovered.
            <br/>
            <a href="https://insomnia.rest/documentation/plus/">Read More</a> about
            how your password is used to encrypt your data.
          </p>
        </div>
        <div className="form-control">
          <label>Confirm Password
            <input type="password"
                   name="passwordConfirm"
                   placeholder="•••••••••••••"
                   defaultValue={this.state.passwordConfirm}
                   onChange={this._handleUpdatePasswordConfirm}
                   autoFocus/>
          </label>
        </div>
        <div className="form-control right">
          <label>
            <input type="checkbox"
                   name="agreeToTerms"
                   required
                   defaultChecked={agreeToTerms}
                   onChange={this._handleUpdateInput}/>
            I agree to the
            {" "}
            <a href="https://insomnia.rest/terms/" target="_blank">Terms</a>
          </label>
        </div>
        {error ? <small className="form-control error">** {error}</small> : null}
        <div className="form-row padding-top-sm">
          <div className="form-control">
            <a href="#" onClick={this._handleBack}>&lt; Back</a>
          </div>
          <div className="form-control right">
            {loading ?
              <button type="button" disabled className="button">Loading</button> :
              <button type="submit" className="button">Create Account</button>
            }
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {step} = this.state;

    let inner;
    if (step === 1) {
      inner = this.renderStep1();
    } else if (step === 2) {
      inner = this.renderStep2();
    }

    return (
      <form onSubmit={this._handleSubmit}>
        {inner}
        <hr/>
        <div className="center">
          <a href="/eula">Privacy Policy</a>
        </div>
      </form>
    )
  }
}

SignUp.propTypes = {};

export default SignUp;
