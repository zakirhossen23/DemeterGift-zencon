import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import isServer from '../../../components/isServer';
import UseFormInput from '../UseFormInput';
import { useRouter } from 'next/router';
import { NFTStorage, File } from 'nft.storage'

export default function DonateNFTModal({
	show,
	onHide,
	contract,
	senderAddress,
	type,
	EventID,
	SelectedTitle,
	enddate
}) {

	const router = useRouter();
	const [Image, setImage] = useState([]);
	if (isServer()) return null;
	const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8'
	const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

	console.log(contract);
	const [name, nameInput] = UseFormInput({
		type: 'text',
		placeholder: 'Enter name',
	});
	const [description, descriptionInput] = UseFormInput({
		as: 'textarea',
		placeholder: 'Enter description',
	});
	const [url, urlInput] = UseFormInput({
		type: 'text',
		placeholder: 'Enter image url',
	});

	const [price, priceInput] = UseFormInput({
		type: 'text',
		placeholder: 'Enter Price',
	});
	const [NFTaddress, NFTaddressInput] = UseFormInput({
		type: 'text',
		placeholder: 'Enter NFT address',
	});

	function FilehandleChange(event) {
		var namefileInput = document.getElementById("js-file-name")
		var allNames = []
		for (let index = 0; index < event.target.files.length; index++) {
			const element = event.target.files[index].name;
			allNames.push(element)
		}
		namefileInput.innerText = allNames.join("\n")
		setImage(event.target.files)
	}
	async function createNFT() {

		var CreateDonateBTN = document.getElementById("CreateDonateBTN")
		CreateDonateBTN.disabled = true
		let allFiles = []
		for (let index = 0; index < Image.length; index++) {
			const element = Image[index];
			const metadata = await client.storeBlob(element)
			const urlImage = "https://" + metadata + ".ipfs.nftstorage.link"
			allFiles.push(urlImage)
			console.log(urlImage)
		}

		let Logourl = allFiles[0];
		console.log("logo = >",Logourl)
		var tokenAddress = NFTaddress;


		const createdObject = {
			title: 'Asset Metadata',
			type: 'object',
			properties: {
				name: {
					type: 'string',
					description: name,
				},
				description: {
					type: 'string',
					description: description,
				},
				image: {
					type: 'string',
					description: Logourl,
				},
				price: {
					type: 'string',
					description: price
				},
				typeimg: {
					type: 'string',
					description: type
				},
				nftaddress: {
					type: 'string',
					description: tokenAddress
				},
				higherbidadd: {
					type: 'string',
					description: ""
				},
				date: {
					type: 'string',
					description: enddate
				}
			},
			bids: []
		};
		console.log(createdObject);
		const result = await contract.claimToken(
			senderAddress,
			JSON.stringify(createdObject),
			EventID
		);
		await window.document.getElementsByClassName("btn-close")[0].click();
		window.location.href = `/donation/auction?[${EventID}]`;
		console.log(result);


	}

	return (
		<Modal
			show={show}
			onHide={onHide}
			aria-labelledby="contained-modal-title-vcenter"
			size="lg"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Donate {type} - {SelectedTitle}
				</Modal.Title>

			</Modal.Header>
			<Modal.Body className="show-grid">
				<Form>
					<Form.Group className="mb-3" controlId="formGroupName">
						<Form.Label>Name</Form.Label>
						{nameInput}
					</Form.Group>
					<Form.Group className="mb-3" controlId="formGroupDescription">
						<Form.Label>Description</Form.Label>
						{descriptionInput}
					</Form.Group>
					<Form.Group className="mb-3" controlId="formGroupName">
						<Form.Label>Opening price in ZENIQ</Form.Label>
						{priceInput}
					</Form.Group>

					<div style={{ height: '100px' }}>
						<div className="Event-Create-file-container">
							<input className="file-input" onChange={FilehandleChange} id="EventImage" name="DonateImage" type="file" />
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
					<Form.Group className="mb-3" controlId="formGroupImageUrl">
						<Form.Label>NFT address</Form.Label>
						{NFTaddressInput}
					</Form.Group>


					<div className="d-grid">
						<Button variant="primary" id='CreateDonateBTN' onClick={createNFT}>
							Donate {type}
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
