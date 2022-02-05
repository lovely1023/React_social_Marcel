import React, { Component, useRef } from "react";
import ReactPlayer from 'react-player'
import { Redirect, Link } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "react-string-format";
import { Row, Col, Card, Button } from "react-bootstrap";

import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import './Preview.css';

class Preview extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        console.log('this.state')
        console.log(this.state)
        console.log('this.props')
        console.log(this.props)


        return (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {
                    this.props.location.previewVideo
                        ?
                        <video
                            style={{ marginRight: "auto", marginLeft: "auto" }}
                            autoPlay
                            controls
                            width="30%"
                            height="30%"
                            src={`${process.env.REACT_APP_PUBLIC_URL}/editedVideos/${this.props.location.previewVideo}`}
                        >
                        </video>
                        :
                        null
                }
            </div>



        )
    }
}

export default Preview;
