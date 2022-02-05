import React, { Component } from "react";
import ReactPlayer from 'react-player'
import  { Redirect } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "react-string-format";
import "./Home.css";
import { whiteBox } from "../../Constants/images"
import { ReactComponent as YourSvg } from '../../Assets/images/white-box.svg';
import sdf from '../../Assets/images/white-box.svg';
import { Row, Col, Card, Button } from "react-bootstrap";

class Home extends Component {
    constructor(props) {
        super(props);
    }
    state={
        videoFilePath:null,
        clipUrl:'',
        shouldRedirect:false,
        videoWidth:null,
        videoHeight:null,
    }
    handleVideoUpload = (event) => {
      event.preventDefault();
      console.log('event.target.files')
      var file=event.target.files;
      const formData = new FormData();
      formData.append('myfile',file[0]);
      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };

      axios.
      post(`${process.env.REACT_APP_API_URL}/upload`,formData,config)
          .then((response) => {
            this.setState({
                videoFilePath:`${process.env.REACT_APP_PUBLIC_URL}/uploadedVideos/${response.data}`
            })
          }).catch((error) => {
              console.log(error)
      });
           
        };
    changeClipUrl=(event)=>{
        this.setState({
            clipUrl:event.target.value
        })
    }
    uploadClipByUrl=()=>{
        this.setState({
            videoFilePath:this.state.clipUrl
        })
    }
    goTemplatePage=()=>{
        this.setState({
            shouldRedirect:true
        })
       
    }
    getVideoSize=(event)=>{
        this.setState({
            videoWidth:event.target.videoWidth,
            videoHeight:event.target.videoHeight
        })
    }
    render() {

        if( this.state.shouldRedirect){
            return <Redirect
            to={{
                pathname: "/template",
                state: { 
                    videoFilePath: this.state.videoFilePath,
                    videoWidth: this.state.videoWidth,
                    videoHeight: this.state.videoHeight
                 }
              }}   />
        }
        return (
                <div>
                   

                <div className="hero-section centered">
                    <div className="w-container">
                        <h1 className="hero-heading">
                            WELCOME TO SOCIALTE
                        </h1>
                        <div className="hero-subheading">
                            <strong>
                                THE WORLDS #1 VIDEO EDITOR FOR CONTENT CREATORS
                            </strong>
                        </div>
                        <div className="text-block">                           
                            <input type="text"
                            onChange={(e) => { this.changeClipUrl(e) }}
                            style={{width:'70%', marginRight:'3%'}} 
                            placeholder="clip url"  />
                            <button onClick={()=>{this.uploadClipByUrl()}}>Clip</button>                
                        </div>

                        <div style={{marginTop:'20px', alignItems:'center'}}>
                            <input type="file"  onChange={(e) => { this.handleVideoUpload(e) }} />
                        </div>
                        <div style={{marginTop:'20px'}}>

                        <video
                            style={{marginRight:"auto", marginLeft:"auto"}}
                            autoPlay
                            controls
                            width="50%"
                            height="50%"
                            src={this.state.videoFilePath}
                            onLoadedMetadata={e => {
                                this.getVideoSize(e)                                
                              }}
                            >
                        </video>
                            
                        </div>
                        {
                            this.state.videoFilePath
                            ?
                            <div style={{marginTop:'20px',textAlign:'center'}}>
                            <button onClick={()=>{this.goTemplatePage()}}>
                                Continue
                            </button>
                            </div>
                            :
                            null
                        }
                       
                    </div>



                    
                    <div className="container w-container">
                        <div className="w-row">
                            <div className="w-col-4 w-col ">
                                <div className="white-box">
                                    <div>
                                        <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738c6548240f_feather2-17-white.svg" className="grid-image" />
                                    </div>
                                    <h3>
                                        CLIP
                            </h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                                </div>
                            </div>
                            <div className=" w-col-4 w-col">
                                <div className="white-box">
                                    <div>
                                        <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738c6548240f_feather2-17-white.svg" className="grid-image" />
                                    </div>
                                    <h3>
                                        CLIP
                            </h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                                </div>
                            </div>
                            <div className=" w-col-4 w-col">
                                <div className="white-box">
                                    <div>
                                        <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738c6548240f_feather2-17-white.svg" className="grid-image" />
                                    </div>
                                    <h3>
                                        CLIP
                            </h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="#" className="button-2 w-button">
                        START YOUR FREE TRIAL
                </a>

                </div>
                <div className="section accent">
                    <div className="w-container">
                        <div className="section-title-group">
                            <h2 className="section-heading centered white">
                            HOW IT WORKS(video below we will add)
                            </h2>
                            <div className="section-subheading center off-white">

                            </div>
                        </div>
                        <div className="w-video w-embed">

                        </div>
                    </div>

                </div>
                <section id="call-to-action" className="call-to-action">
                    <div className="centered-container w-container">
                        <h2>
                            <span className="text-span-2">
                                <strong>
                                    Pricing
                                </strong>
                            </span>
                        </h2>
                        <p className="paragraph">
                            <span className="text-span">
                                <strong>
                                    <em>
                                    12.99/mo. unlimited usage 
                                    </em>
                                </strong>
                            </span>
                            <br />
                            -
                            <span>
                                <strong>
                                Tik Tok aspect ratio made easy
                            
                                <br />
                                -Facecam cropping
                                <br />
                                -Access to all templates
                                <br />
                                -Instant Access to Twitch, Facebook, or YouTube clips
                                <br />
                                -1,000,000+ GIF Images
                                <br />
                                -Ability to post directly to TikTok, Instagram, and YouTube
                                <br />
                                -Up to 1GB per edit
                                </strong>
                            </span>
                            <strong>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </strong>

                            <span className="text-span">
                                <strong>
                                    <em>
                                    19.99/mo. unlimited usage 
                                    </em>
                                </strong>
                            </span>
                            <br />
                            -
                            <span>
                                <strong>
                                -Tik Tok aspect ratio made easy
                            
                                <br />
                                -Facecam cropping
                                <br />
                                -Access to all templates
                                <br />
                                -Instant Access to Twitch, Facebook, or YouTube clips
                                <br />
                                -1,000,000+ GIF Images
                                <br />
                                -Ability to post directly to TikTok, Instagram, and YouTube
                                </strong>
                            </span>
                            <br />
                            <strong>
                                <em className="italic-text">
                                -Up to 4GB per edit
                                </em>
                            </strong>
                            <span>
                                <strong>
                                    <em>
                                        <br />
                                    </em>
                                </strong>
                            </span>
                            <br />
                            
                        </p>
                        <a href="#" className="w-button">
                        SIGN ME UP!
                        </a>

                    </div>
                </section>
                </div>




        )
    }
}

export default Home;