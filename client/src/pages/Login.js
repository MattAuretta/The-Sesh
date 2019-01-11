import React, { Component } from "react";
import API from "../utils/API";
import { Input, FormBtn } from "../components/Form";
import Modal from "../components/Modal";

class Login extends Component {
    state = {
        username: "",
        password: "",
        age: "",
        skill: "",
        display: "none",
        header: "Login",
        loginError: "",
        usernameTaken: "",
    };

    componentDidMount = () => {
        let user = sessionStorage.getItem("username");
        if (user) {
            this.setState({ display: "none" })
        } else {
            this.setState({ display: "block" })
        }
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleFormSignUp = event => {
        event.preventDefault();
        if (this.state.username && this.state.password && this.state.age) {
            API.saveUser({
                username: this.state.username,
                password: this.state.password,
                age: this.state.age
            })
                .then(res => {
                    console.log(res)
                    if (res.data.errmsg) {
                        this.setState({
                            usernameTaken: true,
                            username: "",
                            password: "",
                            age: ""
                        });
                    } else {
                        this.setState({
                            header: "Login",
                            username: "",
                            password: ""
                        });
                    }
                });
        }
    };

    handleLogin = event => {
        event.preventDefault();
        if (this.state.username && this.state.password) {
            console.log(this.state.username)
            console.log(this.state.password)
            API.findUser({
                username: this.state.username,
                password: this.state.password
            })
                .then(res => {
                    console.log(res);
                    // If the password is incorrect, res.data will be empty
                    if (!res.data) {
                        this.setState({ loginError: true });
                    } else {
                        sessionStorage.setItem("username", res.data.username);
                        this.setState({ display: "none"});
                        this.props.toHome("home");
                    }
                })
                .catch(err => console.log(err))
        }
    }

    toggleModal = () => {
        this.setState({
            display: "block"
        });
    }

    handleCloseModal = () => {
        this.setState({
            display: "none"
        });
    }

    handleSignUp = () => {
        this.setState({
            header: "Sign Up!",
            username: "",
            password: "",
            loginError: ""
        });
    }

    handleBackToLogin = () => {
        this.setState({
            header: "Login",
            username: "",
            password: "",
            age: "",
            usernameTaken: ""
        });
    }

    render() {
        if (this.state.header === "Sign Up!") {
            return (
                <div>
                    <Modal display={this.state.display}
                        header={this.state.header}>
                        {this.state.usernameTaken ? <div className="alert alert-danger" role="alert">
                            Username is already taken.
                        </div> : ""}
                        <form>
                            <Input
                                value={this.state.username}
                                onChange={this.handleInputChange}
                                name="username"
                                placeholder="Username (required)"
                            />
                            <Input
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                type="password"
                                name="password"
                                placeholder="Password (required)"
                            />
                            <Input
                                value={this.state.age}
                                onChange={this.handleInputChange}
                                type="date"
                                name="age"
                                placeholder="Age"
                            />
                            <FormBtn
                                disabled={!(this.state.username && this.state.password && this.state.age)}
                                onClick={this.handleFormSignUp}
                            >
                                Register
                        </FormBtn>
                        </form>
                        <button onClick={this.handleBackToLogin} className="btn-link" href="">Cancel</button>
                    </Modal>
                </div>
            )
        } else
            return (
                <div>
                    <Modal display={this.state.display}
                        header={this.state.header}>
                        {this.state.loginError ? <div className="alert alert-danger" role="alert">
                            Incorrect username or password
                        </div> : ""}
                        <form>
                            <Input
                                value={this.state.username}
                                onChange={this.handleInputChange}
                                name="username"
                                placeholder="Username (required)"
                            />
                            <Input
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                type="password"
                                name="password"
                                placeholder="Password (required)"
                            />
                            <FormBtn
                                disabled={!(this.state.username && this.state.password)}
                                onClick={this.handleLogin}
                            >
                                Login
                        </FormBtn>
                        </form>
                        <p>Not a Member?
                        <button onClick={this.handleSignUp} className="btn-link" href="">Sign Up!</button>
                        </p>
                    </Modal>
                </div>
            )
    }
}

export default Login;