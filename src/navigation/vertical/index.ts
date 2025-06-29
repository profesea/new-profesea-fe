// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
    return [
        //general section
        {
            path: '/home',
            title: 'Home',
            icon: 'solar:home-smile-bold-duotone',
            action: 'read',
            subject: 'home'
        },

        // non-admin section
        {
            path: '/community',
            title: 'Community',
            icon: 'solar:users-group-two-rounded-bold-duotone',
            action: 'read',
            subject: 'user-community'
        },
        {
            path: '/list-alumni',
            title: 'Alumni',
            icon: 'ic:twotone-school',
            action: 'read',
            subject: 'user-alumni'
        },
        {
            path: '/candidate/find-job',
            title: 'Job',
            icon: 'solar:boombox-bold-duotone',
            action: 'read',
            subject: 'seafarer-jobs'
        },
        {
            path: '/candidate/trainings',
            title: 'My Training',
            icon: 'solar:book-bookmark-bold-duotone',
            action: 'read',
            subject: 'seafarer-training'
        },
        // {
        //   path: '/list-group',
        //   title: 'Group',
        //   icon: 'el:group',
        //   action: 'read',
        //   subject: 'home'
        // },
        // {
        //   path: '/pricing',
        //   title: 'Pricing',
        //   icon: 'solar:tag-price-bold-duotone',
        //   action: 'read',
        //   subject: 'seafarer-training'
        // },
        {
            path: '/company',
            title: 'Home',
            icon: 'solar:home-smile-bold-duotone',
            action: 'read',
            subject: 'user-company'
        },
        {
            path: '/company/job-management',
            title: 'Manage Job',
            icon: 'solar:case-minimalistic-bold-duotone',
            action: 'read',
            subject: 'user-job-management'
        },
        {
            path: '/trainer/training-management',
            title: 'Manage Training',
            icon: 'solar:notebook-bookmark-bold-duotone',
            action: 'read',
            subject: 'user-training-management'
        },
        {
            path: '/company/find-candidate',
            title: 'Find Candidate',
            icon: 'solar:glasses-bold-duotone',
            action: 'read',
            subject: 'user-find-candidate'
        },
        {
            path: '/company/find-training',
            title: 'Find Training',
            icon: 'ic:round-person-search',
            action: 'read',
            subject: 'company-training'
        },
        // {
        //   path: '/trainer/my-participant',
        //   title: 'List of Participant',
        //   icon: 'solar:user-hand-up-bold-duotone',
        //   action: 'read',
        //   subject: 'user-my-participant'
        // },

        // admin section
        {
            path: '/admin/accounts',
            title: 'Accounts',
            icon: 'solar:user-bold-duotone',
            action: 'read',
            subject: 'admin-accounts'
        },
        // {
        //     path: '/admin/job-management/',
        //     title: 'Job Management',
        //     icon: 'solar:suitcase-lines-bold-duotone',
        //     action: 'read',
        //     subject: 'admin-job-management'
        // },
        {
            path: '/admin/company-and-job-management',
            title: 'Company And Job Management',
            icon: 'solar:buildings-2-bold',
            action: 'read',
            subject: 'admin-company-and-job-management'
        },
        {
            path: '#',
            title: 'Training Management',
            icon: 'solar:notebook-bookmark-bold-duotone',
            action: 'read',
            subject: 'admin-training-management',
            children: [
                {
                    title: 'List Training',
                    path: '/admin/training-management',
                    subject: 'admin-training-management',
                    action: 'read'
                },
                {
                    title: 'Create Training',
                    path: '/admin/training-management/create-training',
                    subject: 'admin-training-management',
                    action: 'read'
                }
            ]
        },
        {
            path: '#',
            title: 'Feedback Management',
            icon: 'solar:leaf-bold-duotone',
            action: 'read',
            subject: 'admin-subcription-management',
            children: [
                {
                    title: 'Free Trial Insight',
                    path: '/admin/feedback-management/free-trial-insight',
                    subject: 'admin-training-management',
                    action: 'read'
                }
            ]
        },
        {
            path: '/admin/subcription-management',
            title: 'Subcription Management',
            icon: 'solar:leaf-bold-duotone',
            action: 'read',
            subject: 'admin-subcription-management'
        },
        {
            path: '/admin/ads-management',
            title: 'Ads Management',
            icon: 'solar:presentation-graph-bold-duotone',
            action: 'read',
            subject: 'admin-ads-management'
        },
        {
            path: '/admin/feeds-management',
            title: 'Feeds Management',
            icon: 'solar:feed-bold-duotone',
            action: 'read',
            subject: 'admin-feeds-management'
        },
        {
            path: '/admin/community-management',
            title: 'Community Management',
            icon: 'solar:users-group-two-rounded-bold-duotone',
            action: 'read',
            subject: 'admin-community-management'
        },
        {
            path: '/admin/master-news2',
            title: 'News Management',
            icon: 'solar:card-2-bold-duotone',
            action: 'read',
            subject: 'admin-master-news'
        },
        {
            path: '/admin/alumni',
            title: 'Alumni Management',
            icon: 'ic:twotone-school',
            action: 'read',
            subject: 'admin-master-news'
        },
        {
            path: '#',
            title: 'Event Management',
            icon: 'solar:calendar-mark-bold-duotone',
            action: 'read',
            subject: 'admin-master-event',
            children: [
                {
                    path: '/admin/master-event',
                    title: 'List Event',
                    action: 'read',
                    subject: 'admin-master-event'
                },
                {
                    path: '/admin/list-eventregister',
                    title: 'Event Participant',
                    action: 'read',
                    subject: 'admin-list-eventregister'
                }
            ]
        },
        {
            path: '#',
            title: 'Master Data',
            icon: 'solar:notes-bold-duotone',
            action: 'read',
            subject: 'admin-master-data',
            children: [
                {
                    title: 'Job Category',
                    path: '/admin/master/job-categories',
                    subject: 'master/job-categories',
                    action: 'read'
                },
                {
                    title: 'Job Title',
                    path: '/admin/master/role-type',
                    subject: 'master/role-type',
                    action: 'read'
                },
                {
                    title: 'Training Category',
                    path: '/admin/master/training-categories',
                    subject: 'master/training-categories',
                    action: 'read'
                },
                {
                    title: 'Role Level',
                    path: '/admin/master/role-level',
                    subject: 'master/role-level',
                    action: 'read'
                },
                {
                    title: 'Forum',
                    path: '/admin/master/forum',
                    subject: 'master/forum',
                    action: 'read'
                },
                {
                    title: 'Type of Vessel',
                    path: '/admin/master/vessel-type',
                    subject: 'master/vessel-type',
                    action: 'read'
                },
                {
                    title: 'License',
                    path: '/admin/master/licensi',
                    subject: 'master/licensi',
                    action: 'read'
                },
                {
                    title: 'License Certificate',
                    path: '/admin/master/licensi-coc',
                    subject: 'master/licensi-coc',
                    action: 'read'
                },
                {
                    title: 'License Profesi',
                    path: '/admin/master/licensi-cop',
                    subject: 'master/licensi-cop',
                    action: 'read'
                },
                {
                    title: 'Institution',
                    path: '/admin/master/sekolah',
                    subject: 'master/licensi-cop',
                    action: 'read'
                }
            ]
        }
    ]
}

export default navigation
