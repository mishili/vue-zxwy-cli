import HomeContent from '../views/base/homeContent'
import StudentManage from '../views/base/studentManage'
import TeacherManage from '../views/base/teacherManage'
import RoleManage from '../views/base/roleManage'
import GradeManage from '../views/base/gradeManage'
import ChangePassword from '../views/base/changePassword'

export default [
    {
        path: '',
        components: {
            sidebar: HomeContent
        }
    },
    {
        path: '/studentManage',
        components: {
            sidebar: StudentManage
        }
    },
    {
        path: '/teacherManage',
        components: {
            sidebar: TeacherManage
        }
    },
    {
        path: '/roleManage',
        components: {
            sidebar: RoleManage
        }
    },
    {
        path: '/gradeManage',
        components: {
            sidebar: GradeManage
        }
    },
    {
        path: '/changePassword',
        components: {
            sidebar: ChangePassword
        }
    }
]