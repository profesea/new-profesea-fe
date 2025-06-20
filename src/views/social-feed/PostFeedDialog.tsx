import {
  Avatar,
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  Fade,
  FadeProps,
  IconButton,
  ImageList,
  ImageListItem,
  Typography
} from '@mui/material'
import React, { forwardRef, ReactElement, Ref, useCallback, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { IUser } from 'src/contract/models/user'
import { getUserAvatar, validateAutomatedContentModeration } from 'src/utils/helpers'
import { useDropzone, Accept } from 'react-dropzone'
import styles from '../../../styles/scss/Dropzone.module.scss'

export interface IPostFeedDialog {
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  user: IUser | null
  handleUpdateStatus: (content_type: string, content: string, attachments?: any) => Promise<void>
  contentTypeFromParent: string
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const srcset = (image: string) => {
  return {
    src: image ?? '/images/no-image.jpg',
    srcSet: image ?? '/images/no-image.jpg'
  }
}

const PostFeedDialog: React.FC<IPostFeedDialog> = ({
  isLoading,
  isOpen,
  onClose,
  user,
  handleUpdateStatus,
  contentTypeFromParent
}) => {
  const [content, setContent] = useState('')
  const [contentType, setContentType] = useState('text')
  const [isUploadFile, setIsUploadFile] = useState(false)
  const [imagePreviewUrls, setPreviewUrls] = useState<string[]>([])
  const [attachments, setAttachments] = useState<any[]>([])
  const [errMaxFileImage, setErrMaxFileImage] = useState(false)
  const [errMaxFileVideo, setErrMaxFileVideo] = useState(false)

  useEffect(() => {
    if (contentTypeFromParent != 'text') {
      setContentType(contentTypeFromParent)
      setIsUploadFile(true)
    }
  }, [contentTypeFromParent])

  const acceptFile: Accept =
    contentType === 'images'
      ? {
          'image/*': ['.jpeg', '.png'],
          'application/pdf': ['.pdf']
        }
      : contentType === 'videos'
      ? {
          'video/mp4': ['.mp4']
        }
      : {}

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      setErrMaxFileImage(false)
      setErrMaxFileVideo(false)
      const maxImageSize = 3 * 1024 * 1024 // 3MB in bytes
      const maxVideoSize = 110 * 1024 * 1024 // 110MB in bytes``

      // for video preview
      if (acceptedFiles[0].type === 'video/mp4') {
        if (acceptedFiles[0].size > maxVideoSize) {
          setErrMaxFileVideo(true)

          return
        }

        const objURL = URL.createObjectURL(acceptedFiles[0])

        setAttachments(acceptedFiles)
        setPreviewUrls([objURL])
      } else {
        const urls: React.SetStateAction<string[]> = []

        for (const file of acceptedFiles) {
          if (file.size > maxImageSize) {
            setErrMaxFileImage(true)

            return
          }
        }

        for (const file of acceptedFiles) {
          urls.push(URL.createObjectURL(file))
        }

        if (attachments.length > 0) {
          setPreviewUrls(prevState => [...prevState, ...urls])
          setAttachments(prevState => [...prevState, ...acceptedFiles])

          return
        }

        setPreviewUrls(urls)
        setAttachments(acceptedFiles)
      }
    },
    [attachments]
  )
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      ...acceptFile
    }
  })

  const handleOnClickPost = () => {
    const { errorMessage, censoredContent } = validateAutomatedContentModeration(content)
    if (errorMessage !== null) {
      handleUpdateStatus(contentType, censoredContent, attachments)
    } else {
      handleUpdateStatus(contentType, content, attachments)
    }

    setTimeout(() => {
      onClose()
      setContent('')
      setContentType('text')
      setIsUploadFile(false)
      setPreviewUrls([])
      setAttachments([])
      setErrMaxFileImage(false)
      setErrMaxFileVideo(false)
    }, 1000)
  }

  const handleOpenDropZoneFile = (contentType: string) => {
    setIsUploadFile(true)
    setContentType(contentType)
  }

  const handleCloseDropZoneFile = () => {
    setIsUploadFile(false)
    setContentType('text')
    setPreviewUrls([])
    setAttachments([])
  }

  const handleOnClose = () => {
    onClose()
    setContent('')
    setContentType('text')
    setIsUploadFile(false)
    setPreviewUrls([])
    setAttachments([])
  }

  const handleDisabledButton = (): boolean => {
    if (contentType == 'text') {
      if (content.length == 0) {
        return true
      }
    }

    if (contentType == 'images' || contentType == 'videos') {
      if (imagePreviewUrls.length == 0 || content.length == 0) {
        return true
      }
    }

    return false
  }

  // variable for
  const total = imagePreviewUrls.length
  const column = total === 2 ? 6 : imagePreviewUrls.length > 1 ? 5 : 1

  const itemCols = (i: number) => {
    if (i === 0) return 3
    else return total === 2 ? 3 : 2
  }
  const itemRows = (i: number) => {
    if (i === 0) return 3
    else return total === 2 ? 3 : total === 3 ? 1.5 : 1
  }

  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        maxWidth='sm'
        scroll='body'
        onClose={handleOnClose}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            position: 'relative',
            padding: '16px'
          }}
        >
          <IconButton size='small' onClick={handleOnClose} sx={{ position: 'absolute', right: '8px', top: '8px' }}>
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ pb: 4, textAlign: 'center', borderBottom: '1px solid rgba(219, 219, 219, 1)' }}>
            <Typography
              variant='h3'
              color={'rgba(48, 48, 48, 1)'}
              fontWeight='700'
              sx={{ fontSize: '16px !important' }}
            >
              Create Post
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', mt: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
              <Box>
                <Avatar
                  src={getUserAvatar(user!)}
                  alt={user?.name || 'Profile Picture'}
                  sx={{ height: 50, width: 50 }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center' }}>
                <Typography
                  variant='h3'
                  color={'rgba(48, 48, 48, 1)'}
                  fontWeight='700'
                  sx={{ fontSize: '16px !important' }}
                >
                  {user?.name}
                </Typography>
              </Box>
            </Box>
            <Box>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                id='outlined-multiline-static'
                placeholder='Start a post, share your thoughts...'
                rows={6}
                style={{
                  border: 0,
                  width: '100%',
                  resize: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: 'rgba(102, 102, 102, 1)',
                  fontFamily: 'Figtree'
                }}
              />
            </Box>
            {isUploadFile && total > 0 && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Box
                  sx={{
                    background: 'rgba(240, 240, 240, 1)',
                    p: '8px',
                    borderRadius: '6px',
                    opacity: contentType == 'images' ? '100%' : '0',
                    cursor: 'pointer'
                  }}
                  onClick={open}
                >
                  Add Photos
                </Box>
                <Box sx={{ background: 'rgba(240, 240, 240, 1)', borderRadius: '50%', width: '24px', height: '24px' }}>
                  <Icon icon={'basil:cross-solid'} fontSize={24} onClick={handleCloseDropZoneFile} />
                </Box>
              </Box>
            )}
            {total > 1 ? (
              <>
                <ImageList
                  variant='quilted'
                  cols={column}
                  rowHeight={430 / 3}
                  gap={2}
                  sx={{
                    width: '100%',
                    height: 430,
                    objectFit: 'contain',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {imagePreviewUrls.slice(0, 3).map((item, i) => (
                    <ImageListItem key={item} cols={itemCols(i)} rows={itemRows(i)}>
                      <img
                        {...srcset(item)}
                        style={{
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        alt={item}
                        loading='lazy'
                      />
                    </ImageListItem>
                  ))}
                  {total === 3 && (
                    <ImageListItem cols={itemCols(3)} rows={itemRows(3)} sx={{ position: 'relative' }}>
                      <img
                        {...srcset(imagePreviewUrls[3])}
                        style={{
                          height: '100%',
                          objectFit: 'cover',
                          backgroundColor: 'gray'
                        }}
                        alt={imagePreviewUrls[3]}
                        loading='lazy'
                      />
                    </ImageListItem>
                  )}
                  {total > 3 && (
                    <ImageListItem cols={itemCols(3)} rows={itemRows(3)} sx={{ position: 'relative' }}>
                      <img
                        {...srcset(imagePreviewUrls[3])}
                        style={{
                          height: '100%',
                          objectFit: 'cover',
                          backgroundColor: 'gray'
                        }}
                        alt='blurred'
                        loading='lazy'
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: 'rgba(10, 12, 15, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        <Typography sx={{ color: 'white', fontSize: 24 }}>+{total - 3}</Typography>
                      </Box>
                    </ImageListItem>
                  )}
                </ImageList>
              </>
            ) : contentType == 'videos' && total > 0 ? (
              <CardMedia sx={{ width: '100%' }} component='video' controls src={`${imagePreviewUrls![0]}`} />
            ) : contentType == 'images' && total > 0 ? (
              <CardMedia
                component='img'
                src={imagePreviewUrls ? imagePreviewUrls[0] : '/images/no-image.jpg'}
                loading='lazy'
                sx={{ objectFit: 'contain', height: '100%', backgroundColor: 'gray', cursor: 'pointer' }}
              />
            ) : null}

            {isUploadFile && total == 0 && (
              <Box>
                <div {...getRootProps({ className: styles['dropzone-wrapper'] })}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <Icon icon='material-symbols-light:upload' fontSize={24} />
                      <p style={{ fontSize: '16px', fontWeight: 700 }}>Choose a file or drag & drop it here</p>
                      {contentType === 'images' ? (
                        <p style={{ fontSize: '14px', fontWeight: 400 }}>JPEG, PNG, and PDF formats, up to 3MB</p>
                      ) : (
                        <p style={{ fontSize: '14px', fontWeight: 400 }}>MP4 formats up to 110MB</p>
                      )}
                    </div>
                  )}
                </div>
                {errMaxFileImage && (
                  <Box>
                    <Typography variant='body2' color={'red'} sx={{ fontSize: '14px' }}>
                      Image file size must be less than 3MB.
                    </Typography>
                  </Box>
                )}
                {errMaxFileVideo && (
                  <Box>
                    <Typography variant='body2' color={'red'} sx={{ fontSize: '14px' }}>
                      Video file size must be less than 110MB.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: '20px', marginBottom: '16px', alignItems: 'center' }}>
              <Typography
                variant='h3'
                color={'rgba(48, 48, 48, 1)'}
                fontWeight='700'
                sx={{ fontSize: '14px !important' }}
              >
                Add to your post
              </Typography>
              <Icon
                style={{ cursor: 'pointer' }}
                onClick={() => handleOpenDropZoneFile('images')}
                icon='icon-park-outline:picture-album'
                fontSize={24}
                color='#4CAF50'
              />
              <Icon
                style={{ cursor: 'pointer' }}
                onClick={() => handleOpenDropZoneFile('videos')}
                icon='icon-park-outline:video'
                fontSize={24}
                color='#FF5722'
              />
            </Box>
          </Box>
          <Box>
            <Button
              disabled={handleDisabledButton()}
              sx={{ width: '100%', textTransform: 'capitalize', fontSize: '14px', fontWeight: 400, color: 'white' }}
              variant='contained'
              onClick={handleOnClickPost}
            >
              {isLoading ? <CircularProgress /> : 'Create Post'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostFeedDialog
