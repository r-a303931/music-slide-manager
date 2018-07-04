import * as React from 'react';

import './Signin.css';

export default class SigninForm extends React.Component<
	{ onAuthorize: () => void },
	{ authError: string; username: string; password: string }
> {
	public state = {
		authError: '',
		password: '',
		username: ''
	};

	constructor(props: { onAuthorize: () => void }) {
		super(props);

		this.updatePassword = this.updatePassword.bind(this);
		this.updateUsername = this.updateUsername.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		const test = localStorage.getItem('authorized');
		if (!!test && test === 'true') {
			this.props.onAuthorize();
		}
	}

	public render() {
		return (
			<div id="signin-form-box">
				<form id="signin-form" onSubmit={this.onSubmit}>
					{this.state.authError !== '' ? (
						<div id="signin-form-autherror">
							{this.state.authError}
						</div>
					) : null}
					<div className="row">
						<label>Username</label>
						<input
							onChange={this.updateUsername}
							value={this.state.username}
						/>
					</div>
					<div className="row">
						<label>Password</label>
						<input
							type="password"
							onChange={this.updatePassword}
							value={this.state.password}
						/>
					</div>
					<div className="row">
						<input type="submit" value="Sign in" />
					</div>
				</form>
			</div>
		);
	}
	private onSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (
			this.state.username === 'singer' &&
			this.state.password === 'wassup'
		) {
			localStorage.setItem('authorized', 'true');
			this.props.onAuthorize();
		} else {
			this.setState({
				authError: 'Incorrect username and password'
			});
		}
	}
	private updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			username: e.target.value
		});
	}
	private updatePassword(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			password: e.target.value
		});
	}
}
