import 'tailwindcss/tailwind.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
	return (
		<div className='bg-gray-300 h-screen'>
			<div className='flex justify-between items-baseline pt-8 px-8'>
				<div className='font-extrabold text-3xl'>Eternal Domain</div>
				<div className='flex gap-x-12 text-xl font-bold'>
					<Link href='/'>Home</Link>
					<Link href='/'>Sell NFT</Link>
					<Link href='/createItem'>My NFT</Link>
				</div>
			</div>
			<Component {...pageProps} />
		</div>
	)
}

export default MyApp