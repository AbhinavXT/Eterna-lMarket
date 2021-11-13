/* pages/index.js */
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Head from 'next/head'

import { nftaddress, nftmarketaddress } from '../config.js'

import NFT from '../utils/EternalNFT.json'
import Market from '../utils/EternalMarketplace.json'

export default function Home() {
	const [account, setAccount] = useState('')
	const [nfts, setNfts] = useState([])
	const [loadingState, setLoadingState] = useState(0)

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window

		if (!ethereum) {
			console.log('Metamask not detected')
			return
		} else {
			console.log('Metamask detected')
		}

		const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

		if (accounts.length !== 0) {
			console.log('Found account', accounts[0])
			setAccount(accounts[0])
		}
	}

	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	const loadEternalNFT = async () => {
		const provider = await new ethers.providers.Web3Provider(ethereum)
		const signer = provider.getSigner()
		const marketContract = new ethers.Contract(
			nftmarketaddress,
			Market.abi,
			provider
		)
		const itemsData = await marketContract.fetchEternalItems()

		const items = await Promise.all(
			itemsData.map(async (i) => {
				const tokenUri = await tokenContract.tokenURI(i.tokenId)
				const meta = await axios.get(tokenUri)

				let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					image: meta.data.image,
					name: meta.data.name,
					description: meta.data.description,
				}
				return item
			})
		)
		setNfts(items)
		setLoadingState(1)
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		loadEternalNFT()
		//console.log(account)
	}, [])

	return (
		<div className='flex flex-col justify-center items-center'>
			<Head>
				<title>Eternal NFT</title>
				<meta name='description' content='Eternal Domain' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{account === '' ? (
				<div className='mt-20'>
					<button
						className='text-2xl font-bold py-3 px-12 bg-gray-500 hover:text-gray-700 hover:bg-gray-400 transition-colors duration-300 shadow-lg rounded-lg mb-10'
						onClick={connectWallet}
					>
						Connect Wallet
					</button>
				</div>
			) : (
				<div className='font-semibold text-lg mt-12'>Connected: {account}</div>
			)}

			<div className='flex justify-center'>
				<div className='px-4' style={{ maxWidth: '1600px' }}>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
						{nfts.map((nft, i) => (
							<div key={i} className='border shadow rounded-xl overflow-hidden'>
								<img src={nft.image} />
								<div className='p-4'>
									<p
										style={{ height: '64px' }}
										className='text-2xl font-semibold'
									>
										{nft.name}
									</p>
									<div style={{ height: '70px', overflow: 'hidden' }}>
										<p className='text-gray-400'>{nft.description}</p>
									</div>
								</div>
								<div className='p-4 bg-black'>
									<p className='text-2xl mb-4 font-bold text-white'>
										{nft.price} ETH
									</p>
									<button
										className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded'
										onClick={() => buyNft(nft)}
									>
										Buy
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
