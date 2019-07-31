import StudentManage from '../views/base/studentManage'
import TeacherManage from '../views/base/teacherManage'
import GradeManage from '../views/base/gradeManage'
import ChangePassword from '../views/base/changePassword'

export default [
    {
        path: '',
        redirect: {name: 'studentManage'}
    },
    {
        path: '/studentManage',
        name: 'studentManage',
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