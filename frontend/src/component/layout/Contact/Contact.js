import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
    return (
        <div className="contactContainer">
            <a className="mailBtn" href="mailto:pradeepjaiswalsidd@gmail.com">
                <Button>Contact: pradeepjaiswalsidd@gmail.com</Button>
            </a>
            <p>I'm <b>Pradeep Jaiswal</b> having 2 years of experience in MERN stack development</p>
            <div className="SkillsSection">
                <p>My skills are :</p>
                <ul>
                    <li>JavaScript</li>
                    <li>NodeJs</li>
                    <li>React</li>
                    <li>Java</li>
                </ul>
            </div>
        </div>
    );
};

export default Contact;
