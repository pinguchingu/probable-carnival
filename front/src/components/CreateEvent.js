import React, {useState} from 'react';
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./CreateEvent.css";
import FRQBox from "./FRQBox";
import MCQBox from "./MCQBox";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, selectUser } from '../context/reducer';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

// material ui 
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '6px 0px',
  },
}));

function CreateEvent() {

    // material ui
    const classes = useStyles();


    const user = useSelector(selectUser);
    // state for number of frq questions
    const [numFRQ, setNumFRQ] = useState(0);
    // array to hold frqBox components
    const frqs = [];

    // state for number of mcq questions
    const [numMCQ, setNumMCQ] = useState(0);
    // array to hold mcqBox components
    const mcqs = [];

    // array to hold data for frqs and mcqs
    const [frqData, setFRQData] = useState([]);
    const [mcqData, setMCQData] = useState([]);

    const frqCallback = (childData, id) => {
        const copy = frqData;
        copy[id] = childData;
        setFRQData(copy);
        console.log(frqData);
    }

    const mcqCallBack = (childData, id) => {
        const copy = mcqData;
        copy[id] = childData;
        setMCQData(copy);
        console.log(mcqData);
    }

    const getFRQs = (frqs) => {
        for (let i = 0; i < numFRQ; i++) {
            frqs.push(<FRQBox key={i} id={i} callBack={frqCallback} />);
        }
        return frqs;
    }

    const getMCQs = (mcqs) => {
        for (let i = 0; i < numMCQ; i++) {
            mcqs.push(<MCQBox key={i} id={i} callBack={mcqCallBack}></MCQBox>);
        }
        return mcqs;
    }

    const decrementFRQ = () => {
        if (numFRQ - 1 >= 0) {
            setNumFRQ(numFRQ - 1);
        }
        frqs.pop();
    }

    const decrementMCQ = () => {
        if (numMCQ - 1 >= 0) {
            setNumMCQ(numMCQ - 1);
        } 
        mcqs.pop();
    }

    const fq = {
        FRQS: [],
        MCQS: [],
    }

    const event = {
        name: "",
        password: "",
        date: new Date(),
        fieldQuestions: fq,
        responses: []
    };

    const [name, setName] = useState("");
    const [password, setPass] = useState("");
    const [date, setDate] = useState(new Date());

    const onSubmit = () => {
        event.name = name;
        event.date = date;
        event.password = password;
        for (let i = 0; i < numFRQ; i++) {
            fq.FRQS.push(frqData[i]);
        }
        for (let i = 0; i < numMCQ; i++) {
            fq.MCQS.push(mcqData[i]);
        }
        event.fieldQuestions = fq;
        axios.post("http://localhost:5000/events/add", event)
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
    }




   return (
       <div className="main">
        <div className="container">
            <div className="form">
                <div className="infoForm-questions">
                <form onSubmit={onSubmit}>
                    <TextField
                      className={classes.root}
                      required
                      id="outlined-required"
                      label="Name of Event"
                      variant="outlined"
                      value={name} 
                      onChange={e => setName(e.target.value)}
                    />
                    <TextField
                      className={classes.root}
                      id="outlined-password-input"
                      label="Event Password"
                      type="password"
                      autoComplete="current-password"
                      variant="outlined"
                      value={password} onChange={e => setPass(e.target.value)}
                    />
                    <TextField
                        id="datetime-local"
                        label="Date and Time"
                        type="datetime-local"
                        className={classes.root}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        selected = {date} 
                        onChange={(date) => setDate(date)}
                      />
                    <div className="infoForm-configure">
                </div>
                    <h4>Free Response Questions:</h4>
                    {getFRQs(frqs)}
                    <div className="counter">
                        <button onClick={() => setNumFRQ(numFRQ + 1)}>Add FRQ</button>
                        <button onClick={() => decrementFRQ()}>Remove 
                        FRQ</button>
                    </div>
                    <h4>Multiple Choice Questions:</h4>
                    {getMCQs(mcqs)}
                    <div className="counter">
                        <button onClick={() => setNumMCQ(numMCQ + 1)}>Add MCQ</button> 
                        <button onClick={() => decrementMCQ()}>Remove MCQ</button>
                          
                    </div>
                    <input className="submitButton" type="submit" value="Create Event"></input>    
                </form>
                </div>
            </div>
        </div>
    </div>
    )
}

export default CreateEvent;
