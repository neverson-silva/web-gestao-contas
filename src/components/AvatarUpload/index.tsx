import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Pessoa } from '@models/auth'
import { message } from 'antd'
import Upload, {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'antd/es/upload'
import { useState } from 'react'

type AvatarUploadProps = {
  pessoa: Pessoa
  //   onChange: (file: UploadFile) => Promise<string>
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
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
  //   onChange,
}) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>(pessoa.perfil)

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      //   onChange(info.file).then((res) => setImageUrl(res))
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <div>
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            height={150}
            width={150}
            alt="avatar"
            style={{ borderRadius: 100 }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  )
}
