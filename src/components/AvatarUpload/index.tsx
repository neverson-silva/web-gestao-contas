import { UploadProfileWrapper } from '@components/AvatarUpload/components/UploadProfileWrapper'
import { Pessoa } from '@models/auth'
import { isValidValue } from '@utils/util.ts'
import { Button, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import Upload, { RcFile, UploadFile } from 'antd/es/upload'
import React, { useMemo, useState } from 'react'
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'

type AvatarUploadProps = {
  pessoa: Pessoa
  size?: number
  onChange?: (file: RcFile | Blob | string) => Promise<string>
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('Somente imagens PNG/JPEG são permitidas')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Imagem deve ser menor que 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  pessoa,
  size,
  onChange,
}) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>(pessoa.perfil)

  const temFotoPerfil = useMemo(() => isValidValue(imageUrl), [imageUrl])

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const uploaded = async (request: RcCustomRequestOptions) => {
    const { file } = request

    setLoading(true)

    if (onChange) {
      setImageUrl(await onChange(file))
    }

    //    const formData = new FormData()
    // Adicione o arquivo ao FormData
    // formData.append('file', arquivo)
    // const { data } = await api.post('/pessoas/upload', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data', // Importante definir o cabeçalho correto
    //   },
    // })
    // setImageUrl(data)
    setLoading(false)
  }

  return (
    <ImgCrop rotationSlider modalTitle={'Editar imagem'}>
      <Upload
        name="perfil"
        customRequest={uploaded}
        beforeUpload={beforeUpload}
        onPreview={onPreview}
        showUploadList={false}
      >
        {!temFotoPerfil && (
          <UploadProfileWrapper loading={loading} size={120} />
        )}
        {temFotoPerfil && (
          <>
            <div className="cursor-pointer">
              <img
                className="opacity-100 hover:opacity-70 hover:border-[1.5px] hover:border-gray-500 hover:border-dashed"
                src={imageUrl}
                height={size ?? '100%'}
                width={size ?? '100%'}
                alt="avatar"
                style={{ borderRadius: 100 }}
              />
            </div>
            <div className="flex justify-center capitalize mt-3">
              <Button type="link">Alterar</Button>
            </div>
          </>
        )}
      </Upload>
    </ImgCrop>
  )
}
