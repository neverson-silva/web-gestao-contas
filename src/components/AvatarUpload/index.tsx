// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { UploadProfileWrapper } from '@components/AvatarUpload/components/UploadProfileWrapper'
import { Pessoa } from '@models/auth'
import { classNames, isValidValue } from '@utils/util.ts'
import { Button, message, Spin } from 'antd'
import ImgCrop from 'antd-img-crop'
import Upload, { RcFile, UploadFile } from 'antd/es/upload'
import React, { useMemo, useState } from 'react'
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'

type AvatarUploadProps = {
  pessoa: Pessoa
  size?: number
  onUpload: (file: RcFile | Blob | string) => Promise<string>
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
  onUpload,
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

    try {
      setLoading(true)
      setImageUrl(await onUpload(file))
    } catch (e: any) {
      message.error('Ocorreu um erro ao enviar a foto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImgCrop rotationSlider modalTitle={'Editar imagem'}>
      <Upload
        name="perfil"
        customRequest={uploaded}
        beforeUpload={beforeUpload}
        onPreview={onPreview}
        showUploadList={false}
        disabled={loading}
      >
        {!temFotoPerfil && (
          <UploadProfileWrapper loading={loading} size={120} />
        )}
        {temFotoPerfil && (
          <>
            <div className="cursor-pointer relative">
              {loading && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
                  <Spin size="large" />
                </div>
              )}
              <img
                className={classNames('', {
                  'opacity-100': !loading,
                  'opacity-30': loading,
                  'hover:opacity-70 hover:border-[1.5px] hover:border-gray-500 hover:border-dashed':
                    !loading,
                })}
                src={imageUrl}
                height={size ?? '100%'}
                width={size ?? '100%'}
                alt="avatar"
                style={{
                  borderRadius: 100,
                  zIndex: 1,
                }}
              />
            </div>
            <div className="flex justify-center capitalize mt-3">
              <Button type="link" disabled={loading}>
                Alterar
              </Button>
            </div>
          </>
        )}
      </Upload>
    </ImgCrop>
  )
}
