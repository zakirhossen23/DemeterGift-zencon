import React from 'react';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';
import UseFormInput from '../../components/components/UseFormInput';
import useContract from '../../services/useContract';
import { Header } from '../../components/layout/Header'
import NavLink from 'next/link';
import isServer from '../../components/isServer';

export default function CreateEvents() {
    const { contract, signerAddress } = useContract('ERC721');
    if (isServer()) return null;


    const [EventTitle, EventTitleInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Title',
        id: ''
    });
    const [EventDescription, EventDescriptionInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Description',
        id: ''
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
        placeholder: 'Event Goal in CELO Euro (CEUR)',
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
                    description: EventLogo
                },
                wallet: {
                    type: 'string',
                    description: window.ethereum.selectedAddress
                },
                typeimg: {
                    type: 'string',
                    description: "Event"
                }
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
    const [EventLogo, EventLogoInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Logo Link',
        id: 'logo'
    });

function CreateEventBTN(){
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
        <Button style={{ margin: "17px 0 0px 0px", width: "100%" }} onClick={createEvent}>
            Create Event
        </Button>
    </>)
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
                            <h6>Event End Date</h6>
                            {EventDateInput}
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h6>Event Goal</h6>
                            {EventGoalInput}
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h6>Event Logo Link</h6>
                            {EventLogoInput}
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
                        <CreateEventBTN/>
                    </div>
                </div>
            </div>

        </>
        </>
    );
}
