import React, { PropsWithChildren } from 'react'
import { default as HeadNext } from 'next/head'

type HeadProps = {
	title: string
	description?: string
}
const Head: React.FC<PropsWithChildren<HeadProps>> = ({
	title,
	description,
}) => {
	return (
		<HeadNext>
			<title>{title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="description" content={description} />
			<meta property="og:locale" content="pt_BR" />
		</HeadNext>
	)
}

export default Head
