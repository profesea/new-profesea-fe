// ** React Import
import { useEffect, useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
// import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import localStorageKeys from 'src/configs/localstorage_keys'
import Router from 'next/router'
import { usePathname } from 'next/navigation'
import { Box } from '@mui/system'
import { MenuItem, styled, TextField } from '@mui/material'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const CustomSelectLanguage = styled(TextField)({
  '& .css-1xr5nzd-MuiInputBase-root-MuiInput-root:before': {
    borderBottom: 'none !important'
  },
  '& .css-haay1k-MuiSelect-select-MuiInputBase-input-MuiInput-input.css-haay1k-MuiSelect-select-MuiInputBase-input-MuiInput-input.css-haay1k-MuiSelect-select-MuiInputBase-input-MuiInput-input':
    {
      padding: '5px'
    },
  '& .css-14bq0fo-MuiSvgIcon-root-MuiSelect-icon': {
    top: 'calc(50% - 0.8em)'
  }
})

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()

  const pathname = usePathname()

  const handleLangItemClick = (lang: string) => {
    localStorage.setItem(localStorageKeys.userLocale, lang)
    i18n.changeLanguage(lang)
    Router.push(pathname, pathname, { locale: lang })
  }

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language])

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Icon icon='ph:globe-simple' color='black' fontSize={18} />
        {/* <TextField id='select-language' select variant='standard' /> */}
        <CustomSelectLanguage
          id='select-language'
          select
          variant='standard'
          size='small'
          defaultValue={'id'}
          onChange={e => {
            handleLangItemClick(e.target.value)
            saveSettings({ ...settings, direction: 'ltr' })
          }}
        >
          <MenuItem value={'id'}>Indonesia</MenuItem>
          <MenuItem value={'en'}>English</MenuItem>
        </CustomSelectLanguage>
      </Box>
      {/* <OptionsMenu
        icon={
          templang == 'en' ? (
            <Icon icon='emojione:flag-for-united-states' color='#ef6c00' fontSize={24} />
          ) : (
            <Icon icon='emojione:flag-for-indonesia' color='#ef6c00' fontSize={24} />
          )
        }
        menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
        iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
        options={[
          {
            text: 'English',
            menuItemProps: {
              sx: { py: 2 },
              selected: i18n.language === 'en',
              onClick: () => {
                handleLangItemClick('en')
                saveSettings({ ...settings, direction: 'ltr' })
              }
            }
          },
          {
            text: 'Indonesia',
            menuItemProps: {
              sx: { py: 2 },
              selected: i18n.language === 'id',
              onClick: () => {
                handleLangItemClick('id')
                saveSettings({ ...settings, direction: 'ltr' })
              }
            }
          }
        ]}
      /> */}
    </>
  )
}

export default LanguageDropdown
