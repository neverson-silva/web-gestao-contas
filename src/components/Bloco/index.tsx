import React from 'react'

type BlocoProps = {
	children: any
} & React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>

const Bloco: React.FC<BlocoProps> = (props) => {
	return (
		<div
			style={{
				...props.style,
				backgroundColor: 'white',
				borderRadius: 10,
				// minHeight: 80,
				width: '100%',
				padding: 16,
				marginTop: 8,
				marginBottom: 8,
			}}
		>
			{props.children}
		</div>
	)
}
export default Bloco
