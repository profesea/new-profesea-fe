// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Menu Components
import HorizontalNavItems from './HorizontalNavItems'

// ** Types
interface Props {
  settings: LayoutProps['settings']
  horizontalNavItems: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['navMenu']>['navItems']
}

const Navigation = (props: Props) => {
  return (
    <Box
      className='menu-content'
      sx={{
        display: 'flex',
        // flexWrap: 'wrap',
        alignItems: 'center',
        gap: '10px',
        '& > *': {
          ...(themeConfig.menuTextTruncate && { maxWidth: 220 })
        }
      }}
    >
      <HorizontalNavItems {...props} />
    </Box>
  )
}

export default Navigation
