import React, { useState } from 'react';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';
import UseFormInput from '../../components/components/UseFormInput';
import UseFormTextArea from '../../components/components/UseFormTextArea';
import useContract from '../../services/useContract';
import { Header } from '../../components/layout/Header'
import NavLink from 'next/link';
import isServer from '../../components/isServer';
import { NFTStorage, File } from 'nft.storage'


export default function CreateEvents() {
    const { contract, signerAddress } = useContract('ERC721');
    const [EventImage, setEventImage] = useState([]);
    if (isServer()) return null;
    const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8'
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

    const [EventTitle, EventTitleInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Title',
        id: ''
    });
    const [EventDescription, EventDescriptionInput] = UseFormTextArea({
        defaultValue: "",
        placeholder: 'Event Description',
        id: '',
        rows: 4
    });
    const [EventDate, EventDateInput] = UseFormInput({
        defaultValue: "",
        type: 'datetime-local',
        placeholder: 'Event End Date ',
        id: 'enddate',
    });
    const [EventGoal, EventGoalInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Goal in ZENIQ',
        id: 'goal',
    });


    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
    async function CreatePlugin(src) {
        const output = `<html><head></head><body><iframe src="${src}" style="width: 100%;height: 100%;" /></body></html>`;
        // Download it
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        downloadURI(fileDownloadUrl, "Generated Plugin.html");
        console.log(output);
    }
    async function createEvent() {
        var CreateEVENTBTN = document.getElementById("CreateEVENTBTN")
        CreateEVENTBTN.disabled = true
        let allFiles = []
        for (let index = 0; index < EventImage.length; index++) {
            const element = EventImage[index];
            const metadata = await client.storeBlob(element)
            const urlImageEvent = "https://" + metadata + ".ipfs.nftstorage.link"
            allFiles.push(urlImageEvent)
            console.log(urlImageEvent)
        }

        const createdObject = {
            title: 'Asset Metadata',
            type: 'object',
            properties: {
                Title: {
                    type: 'string',
                    description: EventTitle,
                },
                Description: {
                    type: 'string',
                    description: EventDescription,
                },
                Date: {
                    type: 'string',
                    description: EventDate,
                },
                Goal: {
                    type: 'string',
                    description: EventGoal
                },
                logo: {
                    type: 'string',
                    description: allFiles[0]
                },
                wallet: {
                    type: 'string',
                    description: window.ethereum.selectedAddress
                },
                typeimg: {
                    type: 'string',
                    description: "Event"
                },
                allFiles
            }
        };


        try {
            const result = await contract.createEvent(
                JSON.stringify(createdObject)
            );

            console.log(result);
            let eventid = await contract.totalEvent();
            if (document.getElementById("plugin").checked) {
                await CreatePlugin(`http://${window.location.host}/donation/auction?[${eventid}]`);
            }


        } catch {
            window.location.href = ('/login');
        }
        window.location.href = ('/donation');
    }


    function CreateEventBTN() {
        if (window.localStorage.getItem("Type") != "manager" && typeof window.ethereum !== 'undefined') {
            return (<>
                <NavLink href="/login?[/CreateEvents]">
                    <Button style={{ margin: "17px 0 0px 0px", width: "100%" }}>
                        Login as Event Manager
                    </Button>
                </NavLink>

            </>);
        }
        return (<>
            <Button id="CreateEVENTBTN" style={{ margin: "17px 0 0px 0px", width: "100%" }} onClick={createEvent}>
                Create Event
            </Button>
        </>)
    }
    function FilehandleChange(event) {
        var namefileInput = document.getElementById("js-file-name")
        var allNames = []
        var FilesImage = []
        var VideosAll = []
        var VideosAllFiles = []
        var allVideoName = []
        for (let index = 0; index < event.target.files.length; index++) {
            const element = event.target.files[index].name;
            if (event.target.files[index].type.includes("video") !== true) {
                allNames.push(element)
                FilesImage.push(event.target.files[index])
            }else  {
                VideosAll.push(element)
                VideosAllFiles.push(event.target.files[index])
            }
        }
        allVideoName = allNames.concat(VideosAll)
        namefileInput.innerText = allVideoName.join("\n")
        setEventImage(FilesImage.concat(VideosAllFiles))
    }

    return (
        <><>
            <Head>
                <title>Create Event</title>
                <meta name="description" content="Create Event" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
            <div className="row" style={{ "height": "100%" }}>
                <div className='createevents col' >
                    <div style={{ background: "transparent", padding: "19px", borderRadius: "4px", height: "100%", border: "white solid" }}>
                        <div style={{ margin: "0px 0px 30px 0px" }}>
                            <h1>Create Event</h1>
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h6>Event Title</h6>
                            {EventTitleInput}
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h6>Event Description</h6>
                            {EventDescriptionInput}
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h6>Event End Date</h6>
                            {EventDateInput}
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h6>Event Goal</h6>
                            {EventGoalInput}
                        </div>
                        <div style={{ height: '100px' }}>
                            <div className="Event-Create-file-container">
                                <input className="file-input" onChange={FilehandleChange} id="EventImage" name="EventImage" type="file" multiple="multiple" />
                                <div className="Event-Create-file-content">
                                    <div className="file-infos">
                                        <p className="file-icon">
                                            <i className="fas fa-file-upload fa-7x" />
                                            <span className="icon-shadow" />
                                            <span>
                                                Click to browse<span className="has-drag">or drop file here</span>
                                            </span>
                                        </p>
                                    </div>
                                    <p className="file-name" id="js-file-name">
                                        No file selected
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            margin: '18px 0px',
                            display: 'flex',
                            alignContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '5px'
                        }} >
                            <input type="checkbox" id="plugin" />
                            <h5 style={{ margin: '0' }}>Generate Plugin?</h5>
                        </div>
                        <CreateEventBTN />
                    </div>
                </div>
            </div>

        </>
        </>
    );
}
