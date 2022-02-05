import React, { Component, useRef } from "react";
import ReactPlayer from 'react-player'
import { Redirect, Link } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "react-string-format";
import { Row, Col, Card, Button } from "react-bootstrap";

import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import './MainEdit.css';

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
        shouldRedirect: false,
        previewVideo: '',
        loading: false,

    }
    handleCrop = (crop, percentCrop) => {
        this.setState({ crop })
    }
    sendSelectedVideo = () => {
        this.setState({
            loading: true
        })
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/editor/thumbnail`, {
                videoFilePath: this.props.location.videoFilePath,
                template: this.props.location.query,
                faceVideo: this.props.location.faceVideo ? this.props.location.faceVideo : null,
                mainVideo: this.state.crop
            }
            )
            .then((res) => {
                console.log('res')
                console.log(res)
                this.setState({
                    loading:false,
                    shouldRedirect: true,
                    previewVideo: res.data
                })

            });
    }
    componentDidMount() {
        axios.interceptors.request.use(function (config) {
            // Do something before request is sent
            console.log('Start Ajax Call');
            return config;
        }, function (error) {
            // Do something with request error
            console.log('Error');
            return Promise.reject(error);
        });

        axios.interceptors.response.use(function (response) {
            // Do something with response data
            console.log('Done with Ajax call');
            return response;
        }, function (error) {
            // Do something with response error
            console.log('Error fetching the data');
            return Promise.reject(error);
        });
    }


    render() {
        console.log('this.state')
        console.log(this.state)
        console.log('this.props')
        console.log(this.props)

        if (this.state.shouldRedirect) {
            return <Redirect
                to={{
                    pathname: "/preview",
                    previewVideo: this.state.previewVideo
                }} />
        }

        return (
            <div>
                {
                    this.state.loading
                        ?
                        <div style={{ marginTop: '100px', textAlign: 'center' }} >
                            <h5>
                                Wait a second...
                            </h5>
                        </div>
                        :
                        <div>
                            <div>
                                <Row>
                                    <Col>
                                        {
                                            this.state.template && this.state.template.gamerVideo
                                                ?
                                                <div>
                                                    <span>Select Facecam&nbsp;&nbsp;</span>
                                                    <input type="checkbox" checked value={1} readOnly />
                                                </div>
                                                :
                                                null
                                        }

                                    </Col>
                                    <Col>
                                        {
                                            this.state.template && this.state.template.mainVideo
                                                ?
                                                <div>
                                                    <span>Select gamefeed&nbsp;&nbsp;</span>
                                                    <input type="checkbox" checked value={1} readOnly />
                                                </div>
                                                :
                                                null
                                        }
                                    </Col>
                                    <Col>
                                        <span>Preview&nbsp;&nbsp;</span>
                                        <input type="checkbox" defaultChecked={false} />
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
                                <button onClick={() => { this.sendSelectedVideo() }}>
                                    Done
                                </button>
                            </div>
                        </div>
                }

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