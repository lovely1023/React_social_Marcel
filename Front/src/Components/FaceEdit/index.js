import React, { Component, useRef } from "react";
import ReactPlayer from 'react-player'
import { Redirect, Link } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "react-string-format";
import { Row, Col, Card, Button } from "react-bootstrap";

import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import './FaceEdit.css';

class Edit extends Component {
    constructor(props) {
        super(props);

    }
    state = {

        template: this.props.location.query,
        videoFilePath: this.props.location.videoFilePath,
        videoWidth: this.props.location.videoWidth,
        videoHeight: this.props.location.videoHeight,
        crop: {
            unit: 'px',
            width: 100,
            height: 100,
            x: (this.props.location.videoWidth - 100) / 2,
            y: (this.props.location.videoHeight - 100) / 2
        },
        shouldRedirect: false

    }
    handleCrop = (crop, percentCrop) => {
        this.setState({ crop })
    }

    render() {
        return (
            <div>
                <div>
                    <Row>
                        <Col>
                            <span>Select Facecam&nbsp;&nbsp;</span>
                            <input type="checkbox" checked={true} readOnly />
                        </Col>
                        <Col>
                            <span>Select gamefeed&nbsp;&nbsp;</span>
                            <input type="checkbox" value={1} disabled="disabled" />
                        </Col>
                        <Col>
                            <span>Preview&nbsp;&nbsp;</span>
                            <input type="checkbox" value={1} disabled="disabled" />
                        </Col>
                    </Row>
                </div>


                <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <ReactCrop
                        crop={this.state.crop}
                        keepSelection={true}
                        onChange={(crop, percentCrop) => { this.handleCrop(crop, percentCrop) }}
                        renderComponent={videoComponent(this.props.location.videoFilePath)} />
                </div>
                <div style={{ marginTop: '30px', marginBottom: "30px", textAlign: 'center' }}>
                    <Link
                        to={{
                            pathname: 'main-edit',
                            query: this.props.location.query,
                            videoFilePath: this.props.location.videoFilePath,
                            videoWidth: this.props.location.videoWidth,
                            videoHeight: this.props.location.videoHeight,
                            faceVideo: this.state.crop,

                        }} >
                        <button>
                            Done
                        </button>
                    </Link>

                </div>
            </div>



        )
    }
}

export default Edit;

const videoComponent = (props) => (

    <video
        autoPlay
        loop
        style={{ display: 'block', maxWidth: '100%' }}
        onLoadStart={e => {
            // You must inform ReactCrop when your media has loaded.
            e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }));
        }}
    >
        <source src={props} type="video/mp4" />
    </video>
);