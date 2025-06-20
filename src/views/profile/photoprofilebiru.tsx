import React from 'react'
import Typography from '@mui/material/Typography'
import { styled, TypographyProps, BoxProps, Box } from '@mui/material'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const MenuItemTitle = styled(Typography)<TypographyProps>(() => ({
  fontWeight: 600,
  position: 'absolute',
  top: '85%',
  left: '30%',
  //   transform: 'translate(-50%, -50%)',
  background: 'linear-gradient(to right, rgb(252,148,4), #FFCD80)', // Customize background color and opacity
  //   padding: theme.spacing(5), // Customize padding
  borderRadius: 5, // Customize border radius
  color: '#32487a'
}))
const BlankLayoutWithAppBarWrapper = styled(Box)<BoxProps>(() => ({
  position: 'relative'
}))

interface TextOverImageProps {
  imageUrl: string
  text: string
}

const TextOverImage: React.FC<TextOverImageProps> = ({ imageUrl, text }) => {
  return (
    <Box>
      <BlankLayoutWithAppBarWrapper>
        <MenuItemTitle>{text}</MenuItemTitle>
        <ProfilePicture src={imageUrl} alt={text} sx={{ width: 100, height: 100, objectFit: 'cover' }} />
      </BlankLayoutWithAppBarWrapper>
    </Box>
  )
}

export default TextOverImage
