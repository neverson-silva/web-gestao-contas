import { PropsWithChildren } from 'react'
import Helmet from 'react-helmet'

type HeadProps = {
  title: string
  description?: string
}
export const Head: React.FC<PropsWithChildren<HeadProps>> = ({
  title,
  description,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta property="og:locale" content="pt_BR" />
    </Helmet>
  )
}
