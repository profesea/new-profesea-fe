import { Avatar, Box, Card, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import Job from 'src/contract/models/job'
import { IUser } from 'src/contract/models/user'
import ButtonFollowCompany from 'src/layouts/components/ButtonFollowCompany'

const CompanyDetailSection = ({ jobDetail, user, isMobile }: { jobDetail: Job | null; isMobile: boolean; user: IUser | null }) => {
  const company = jobDetail?.company
  const router = useRouter()

  return (
    <Card sx={{ border: 0, boxShadow: 0, backgroundColor: '#FFFFFF', padding: isMobile ? '24px' : '32px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Box>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#303030'
            }}
          >
            About the company
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Avatar src={company?.photo} sx={{ width: 51, height: 51 }} />
            <Box sx={{ cursor: 'pointer' }} onClick={() => router.push(`/company/${company?.username}`)}>
              <TruncatedTypography fontSize={14} fontWeight={700} color={'#303030'}>
                {company?.name ?? '-'}
              </TruncatedTypography>
              {/* industry company belum ada di api */}
              {/* todo add industry company */}
              <TruncatedTypography fontSize={14} fontWeight={400} color={'#868686'}>
                {company?.industry?.name ?? '-'}
              </TruncatedTypography>
            </Box>
          </Box>
          <ButtonFollowCompany user_id={company?.id as number} friend_id={Number(user?.id)} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['left', 'flex-start'] }}>
          <Typography
            sx={{
              color: '#5E5E5E',
              fontSize: 14,
              fontWeight: 400,
              whiteSpace: 'pre-line'
            }}
            textAlign={'justify'}
          >
            {company?.about}
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

const TruncatedTypography = (props: { children: any; line?: number; [key: string]: any }) => {
  const { children, line, ...rest } = props
  const maxLine = line ? line : 1

  return (
    <Typography
      sx={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLine,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        maxHeight: `calc(${maxLine} * 1.2em)`,
        minHeight: '1.2em',
        lineHeight: '1.2em',
        fontSize: '16px',
        ...rest
      }}
    >
      {children}
    </Typography>
  )
}

export default CompanyDetailSection
