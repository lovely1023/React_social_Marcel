import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "react-string-format";
import { Link } from "react-router-dom";
import "./Header.css";
import { connect } from 'react-redux';
import { saveAuthInfo } from '../../../Store/actions/actions';
import { Dropdown, DropdownButton } from "react-bootstrap";

class Header extends Component {
    constructor(props) {
        super(props);
    }
    logout = () => {
        this.props.saveAuthInfo({}, '');
    }
    render() {
        return (
            <div className="w-nav navigation-bar">
                <div className="w-container">
                    <Link to="/" className="brand-link w-nav-brand">
                        <h1 className="brand-text">
                            SOCIALITE
                        </h1>
                    </Link>
                    <nav className="w-nav-menu">
                        <Link to="/" className="w-nav-link">
                            Home
                        </Link>
                        <Link to="/" className="w-nav-link">
                            How It Works (clicking scrolls down to video section)
                        </Link>
                        {
                            this.props.auth.authInfo.token == ''
                                ?
                                <Link to="/login" className="w-nav-link">
                                    Login
                                </Link>
                                :
                                <DropdownButton id="dropdown-basic-button" title="Profile">
                                    <Dropdown.Item>
                                        <Link to="/profile">
                                            View profile
                                        </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>Membership</Dropdown.Item>
                                    <Dropdown.Item>
                                        <span style={{ marginRight: "10px" }}>Balance</span>
                                        <span>0.00</span>
                                        <span>usd</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item>Make a deposit</Dropdown.Item>
                                    <Dropdown.Item>Support</Dropdown.Item>
                                    <Dropdown.Item>Invite friends</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.logout()} >
                                        Logout
                                    </Dropdown.Item>
                                </DropdownButton>
                        }

                        {/* <div className="dropdown">
                                <span className="dropbtn">Dropdown</span>
                                <div className="dropdown-content">
                                    <a href="#">Link 1</a>
                                    <a href="#">Link 2</a>
                                    <a href="#">Link 3</a>
                                </div>
                            </div> */}
                    </nav>
                </div>
            </div>

        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => {
    return {
        saveAuthInfo: (user, token) => dispatch(saveAuthInfo(user, token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
